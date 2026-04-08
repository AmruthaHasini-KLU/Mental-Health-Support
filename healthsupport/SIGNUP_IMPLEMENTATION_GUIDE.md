# Sign-Up System Implementation Guide

## Overview
Your Mental Health Support platform now supports two types of user sign-ups: **Students** and **Doctors**. Each user type has distinct registration flows, data requirements, and dashboard access.

---

## 1. Sign-Up UI Update

### Role Selection
When a user clicks "Sign Up" on the Login page, they are presented with two options:
- **I am a Student** ✅
- **I am a Doctor** 💉

The selection uses **radio buttons** in a highlighted box for clear visibility.

### UI Location
The role selector appears at the top of the sign-up form with descriptive text:
- "You will get access to all wellness features" (for Students)
- "You will receive a doctor dashboard after verification" (for Doctors)

---

## 2. Conditional Data Capture

### Student Sign-Up Flow
**Required Fields:**
1. Full Name (2+ characters)
2. Email Address (valid email format)
3. Student ID (e.g., STU-2024-001)
4. Contact Number (10+ digits)
5. Password (8+ characters)
6. Confirm Password (must match)

**After Submission:**
- Data stored in `localStorage['healthsupport_accounts']`
- User automatically redirected to `/student/dashboard`
- Gains access to all student features:
  - Yoga & Wellness Exercises
  - Stress Buster Techniques
  - Therapy Booking
  - Support Forums
  - Resources

### Doctor Sign-Up Flow
**Required Fields:**
1. Full Name (2+ characters)
2. Email Address (MUST follow format: `dr.<name>@gmail.com`)
   - Example: `dr.sarah@gmail.com`, `dr.michael@gmail.com`
3. Contact Number (10+ digits)
4. Password (8+ characters)
5. Confirm Password (must match)

**Form Validation:**
- Email format strictly enforced: `dr.*@gmail.com`
- If format incorrect: "Doctor email must follow format: dr.<name>@gmail.com"

**After Submission:**
- Data stored in `localStorage['healthsupport_doctors']`
- Automatically synced to Admin Panel Doctor Management
- User redirected to `/doctor/dashboard`
- Gains access to doctor features:
  - View assigned therapy requests
  - Accept/Reject requests
  - See patient details (name, issue, contact, attendees)

---

## 3. Database & Admin Sync

### Student Account Storage
**Location:** `localStorage['healthsupport_accounts']`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+1 (555) 123-4567",
  "studentId": "STU-2024-001",
  "role": "student",
  "createdAt": "2026-02-24T10:30:00Z"
}
```

### Doctor Account Storage
**Location:** `localStorage['healthsupport_doctors']`

```json
{
  "id": 1708856400000,
  "name": "Dr. Sarah Johnson",
  "email": "dr.sarah@gmail.com",
  "password": "DocPass123",
  "phone": "+1 (555) 987-6543",
  "specialization": "Not specified",
  "active": true,
  "createdAt": "2026-02-24T10:30:00Z"
}
```

### Admin Sync Details
✅ **Automatic Integration:**
- When a doctor signs up, they are immediately visible in Admin Panel
- Admin Dashboard → Doctor Management tab shows all registered doctors
- Admin can:
  - View doctor email, name, join date
  - Edit doctor specialization
  - Activate/Deactivate accounts
  - Delete doctors

✅ **Real-Time Sync:**
- All changes in Admin Panel persist to localStorage immediately
- Doctor login reflects activation status instantly

---

## 4. Routing Logic

### New Dashboard Routes

After sign-up or login, users are directed to their appropriate dashboard:

| User Role | Old Route | New Route | Component |
|-----------|-----------|-----------|-----------|
| Student | `/dashboard` | `/student/dashboard` | Dashboard (Yoga & Relief page) |
| Doctor | `/doctor-portal` | `/doctor/dashboard` | DoctorPortal (Requests) |
| Admin | `/admin-dashboard` | `/admin/dashboard` | AdminDashboard (Management) |

**Note:** Old routes still work for backward compatibility (redirects to new paths)

### Routing Logic Implementation
```javascript
// Login redirects based on role
const redirectPath = {
  'student': '/student/dashboard',
  'doctor': '/doctor/dashboard',
  'admin': '/admin/dashboard'
}

// Sign-up redirects based on selected role
if (signupRole === 'student') navigate('/student/dashboard')
if (signupRole === 'doctor') navigate('/doctor/dashboard')
```

---

## 5. File Changes Summary

### Modified Files

#### 1. **Login.jsx**
- Added `signupRole` state (separate from `userRole` for login)
- Added role selection UI with radio buttons
- Updated formData to include `studentId` for students
- Added conditional Student ID field (only appears for students)
- Updated validation:
  - Student ID required for students
  - Doctor email format check (dr.*@gmail.com) for doctors
- Updated redirect paths to new URLs

#### 2. **AuthContext.jsx**
- Completely rewrote `signup()` function to handle both roles
- Added doctor email format validation
- Added doctor auto-registration to `healthsupport_doctors`
- Added student account registration to `healthsupport_accounts`
- Returns user object with role and role-specific fields (doctorId/studentId)

#### 3. **App.jsx**
- Updated redirect logic in `ProtectedRoute`
- Added new routes:
  - `/student/dashboard` → Dashboard (role protection: student)
  - `/doctor/dashboard` → DoctorPortal (role protection: doctor)
  - `/admin/dashboard` → AdminDashboard (role protection: admin)
- Kept old routes for backward compatibility
- Updated redirect paths in role-based redirects

---

## 6. Usage Examples

### Example 1: Student Sign-Up
1. Navigate to `/login`
2. Click "Sign Up"
3. Choose "Student"
4. Fill form:
   - Full Name: Emma Wilson
   - Email: emma.wilson@university.edu
   - Student ID: STU-2024-1453
   - Contact: (555) 234-5678
   - Password: SecureStudentPass123
   - Confirm: SecureStudentPass123
5. Click "Sign Up"
6. Redirected to `/student/dashboard` (Yoga & Relief page)
7. Can now book therapy, track exercises, etc.

### Example 2: Doctor Sign-Up
1. Navigate to `/login`
2. Click "Sign Up"
3. Choose "Doctor"
4. Fill form:
   - Full Name: Dr. Lisa Park
   - Email: dr.lisa@gmail.com ✅ (correct format)
   - Contact: (555) 876-5432
   - Password: SecureDocPass123
   - Confirm: SecureDocPass123
5. Click "Sign Up"
6. Redirected to `/doctor/dashboard` (Requests page)
7. Account automatically appears in Admin Panel Doctor Management
8. Can now view assigned therapy requests

### Example 3: Invalid Doctor Email
1. Try to sign up as doctor with email: `lisa@gmail.com` ❌
2. Error: "Doctor email must follow format: dr.<name>@gmail.com"
3. Must correct to: `dr.lisa@gmail.com` ✅

### Example 4: Login Flow
**Student Login:**
1. Click "Login" (not Sign Up)
2. Choose "Student"
3. Enter email: john@example.com
4. Enter password: StudentPass123
5. Click "Login"
6. Redirected to `/student/dashboard`

**Doctor Login:**
1. Click "Login" (not Sign Up)
2. Choose "Doctor"
3. Enter email: dr.sarah@gmail.com
4. Enter password: docpass123
5. Click "Login"
6. Redirected to `/doctor/dashboard`

---

## 7. Admin Panel Integration

### Doctor Management Tab
When a doctor signs up:
1. ✅ Auto-appears in Admin Dashboard → Doctor Management
2. ✅ Shows email, name, specialization, active status
3. ✅ Admin can edit, deactivate, or delete
4. ✅ Changes persist to localStorage instantly

### Example Admin Action
Doctor "Dr. Michael Chen" (dr.michael@gmail.com) signs up
- Instantly visible in Doctor Management table
- Admin can click to edit and add specialization
- Admin can deactivate if needed (doctor can't login)
- When doctor tries to login, gets "Invalid credentials or account is inactive"

---

## 8. Data Validation Rules

### Student Sign-Up Validation
| Field | Validation | Error Message |
|-------|-----------|---------------|
| Full Name | 2+ chars | "Name must be at least 2 characters" |
| Email | Valid email format | "Please enter a valid email" |
| Student ID | Required if student | "Student ID is required" |
| Phone | 10+ digits | "Please enter a valid phone number" |
| Password | 8+ chars | "Password must be at least 8 characters" |
| Confirm Password | Must match password | "Passwords do not match" |

### Doctor Sign-Up Validation
| Field | Validation | Error Message |
|-------|-----------|---------------|
| Full Name | 2+ chars | "Name must be at least 2 characters" |
| Email | `dr.*.@gmail.com` format | "Doctor email must follow format: dr.<name>@gmail.com" |
| Phone | 10+ digits | "Please enter a valid phone number" |
| Password | 8+ chars | "Password must be at least 8 characters" |
| Confirm Password | Must match password | "Passwords do not match" |

---

## 9. Security Features

✅ **Email Uniqueness Check**
- No duplicate emails across students and doctors
- Error: "Email already registered"

✅ **Role-Based Access Control**
- Doctors can't access `/student/dashboard`
- Students can't access `/doctor/dashboard`
- Auto-redirects to correct dashboard based on role

✅ **Doctor Email Format Enforcement**
- Prevents doctors from registering with non-standard emails
- Ensures consistency for identification

✅ **Inactive Doctor Handling**
- Admin can deactivate doctor accounts
- Deactivated doctors can't login
- Students can't be assigned to inactive doctors

---

## 10. Testing Checklist

### Sign-Up Tests
- [ ] Student sign-up with all fields filled
- [ ] Doctor sign-up with dr.* email format
- [ ] Doctor sign-up with wrong email format (shows error)
- [ ] Duplicate email rejection (both student and doctor)
- [ ] Short password rejection (< 8 chars)
- [ ] Password mismatch error
- [ ] Missing Student ID for student signup
- [ ] Student redirects to `/student/dashboard` after signup
- [ ] Doctor redirects to `/doctor/dashboard` after signup

### Login Tests
- [ ] Student login with valid credentials
- [ ] Doctor login with valid credentials
- [ ] Admin login with valid credentials
- [ ] Student login redirects to `/student/dashboard`
- [ ] Doctor login redirects to `/doctor/dashboard`
- [ ] Admin login redirects to `/admin/dashboard`
- [ ] Invalid credentials error

### Admin Sync Tests
- [ ] New doctor signup appears in Admin Dashboard
- [ ] Can edit doctor (name, specialization)
- [ ] Can deactivate doctor
- [ ] Deactivated doctor can't login
- [ ] Can reactivate doctor
- [ ] Can view all active doctors in Doctor Management

### Route Tests
- [ ] New routes work: `/student/dashboard`, `/doctor/dashboard`, `/admin/dashboard`
- [ ] Old routes still work and redirect: `/dashboard`, `/doctor-portal`, `/admin-dashboard`
- [ ] Protected routes reject unauthorized users
- [ ] Redirects happen correctly for each role

---

## 11. Database Schema Summary

### healthsupport_accounts (Students)
```javascript
[
  {
    name: string,
    email: string (unique),
    password: string,
    phone: string,
    studentId: string,
    role: "student",
    createdAt: ISO timestamp
  }
]
```

### healthsupport_doctors (Doctors)
```javascript
[
  {
    id: number (timestamp),
    name: string,
    email: string (unique, format: dr.*.@gmail.com),
    password: string,
    phone: string,
    specialization: string,
    active: boolean,
    createdAt: ISO timestamp
  }
]
```

---

## 12. Troubleshooting

**Q: Doctor can't sign up with valid dr. email**
A: Check browser console for errors. Ensure email format is exactly: `dr.lowercase@gmail.com`

**Q: New doctor not appearing in Admin Dashboard**
A: Refresh page (Ctrl+Shift+R). Check Admin Dashboard Doctor Management tab.

**Q: Student gets redirected to wrong dashboard after login**
A: Check that user role is correctly saved in localStorage as "student"

**Q: Doctor account shows as "Inactive" after signup**
A: This shouldn't happen. If it does, admin can reactivate by toggling status.

**Q: Old routes not working**
A: Old routes (like `/dashboard`) should still work and redirect. Check browser dev tools for 404 errors.

---

## Summary

Your sign-up system now provides:
✅ Role-based user registration (Student/Doctor)
✅ Conditional data capture based on user type
✅ Automatic doctor admin sync
✅ Email format validation for doctors
✅ Student ID tracking for students
✅ Proper role-based routing and redirects
✅ Admin integration and doctor management
✅ Comprehensive error handling and validation
✅ Backward compatibility with old routes

The system is fully functional and ready for user testing!
