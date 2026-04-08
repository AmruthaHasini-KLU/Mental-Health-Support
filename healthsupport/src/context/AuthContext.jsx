import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('healthsupport_token');
    const savedUser = localStorage.getItem('healthsupport_user_data');
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('healthsupport_token');
        localStorage.removeItem('healthsupport_user_data');
      }
    }
    setIsLoading(false);

    // Listen for auth errors thrown by the api interceptor to gracefully log out
    const handleAuthError = () => {
      logout();
    };
    window.addEventListener('auth-error', handleAuthError);
    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  const signup = async (userData) => {
    try {
      // Backend expects: name, email, password, phone, role, studentId (maybe map it?)
      const registerData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role.toUpperCase(), // backend enums typically expect upper case (STUDENT, DOCTOR, ADMIN)
        studentId: userData.studentId,
        specialization: userData.specialization
      };

      const response = await api.post('/auth/register', registerData);
      const data = response.data;
      
      const userObj = {
        name: data.name || userData.name,
        email: data.email || userData.email,
        role: (data.role || userData.role).toLowerCase(),
      };
      
      localStorage.setItem('healthsupport_token', data.token);
      localStorage.setItem('healthsupport_user_data', JSON.stringify(userObj));
      setUser(userObj);
      return userObj;
    } catch (error) {
      const message = error.response?.data || error.message || 'Signup failed';
      throw new Error(message);
    }
  };

  const login = async (email, password, _role) => {
    try {
      // The old frontend passed role here, but backend shouldn't need it for standard login.
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      
      const userObj = {
        name: data.name,
        email: data.email,
        role: data.role.toLowerCase(),
      };

      localStorage.setItem('healthsupport_token', data.token);
      localStorage.setItem('healthsupport_user_data', JSON.stringify(userObj));
      setUser(userObj);
      return userObj;
    } catch (error) {
      const message = error.response?.data || 'Invalid email or password. Please check your credentials.';
      throw new Error(typeof message === 'string' ? message : message.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('healthsupport_token');
    localStorage.removeItem('healthsupport_user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signup, 
      login, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
