# Admin Dashboard Guide

## Quick Access

**Admin Login Credentials:**
- Email: `admin`
- Password: `admin@888`

After logging in, you'll be redirected to `/admin-dashboard`

## Features Overview

### 1. Dashboard (Stats)
- **Total Requests**: 47 therapy requests
- **Active Doctors**: 12 doctors in the system
- **Pending Requests**: 15 requests awaiting review
- **Completed Sessions**: 32 sessions finished

### 2. Content Manager

#### Stress Busters Management
- Add new stress relief techniques
- Edit existing stress busters (Title, Description, Image URL)
- Delete stress busters
- View grid of all stress relief content

#### Yoga Techniques Management
- Add new yoga pose/technique
- Edit existing yoga techniques (Title, Description, Image URL)
- Delete yoga techniques
- View grid of all yoga content

**CRUD Operations Available:**
- ✅ Create: Click "Add Stress Buster" or "Add Yoga Technique"
- ✅ Read: View all cards in grid layout
- ✅ Update: Click "Edit" button on any card
- ✅ Delete: Click "Delete" button on any card

### 3. Therapy Hub

Manage student therapy requests with full details:
- Student Name
- Issue (e.g., "Exam Anxiety", "Depression")
- Severity Level (High/Medium/Low) with color-coded badges
- Request Date
- Status (Pending/Scheduled/Rejected)

**Actions Available:**
- ✅ **Accept**: Changes status to "Scheduled"
- ✅ **Reject**: Changes status to "Rejected"
- Only visible for "Pending" requests

### 4. Doctor Management

Full CRUD for doctor accounts:
- **Table View** with columns:
  - Name (with icon)
  - Specialization
  - Availability Status (Available/Busy/On Leave)
  - Actions (Edit/Delete)

**Operations:**
- ✅ Add new doctor
- ✅ Edit doctor information
- ✅ Delete doctor
- ✅ Toggle availability status

## UI/UX Features

### Professional Slate & Indigo Theme
- **Primary Color**: Indigo-600 (#4F46E5)
- **Background**: Slate-50 (#F8FAFC)
- **Borders**: Slate-200
- **Text**: Slate-900 (headings), Slate-600 (body)

### Sidebar Navigation
- **Collapsible sidebar** (toggle with menu button)
- **Active state indicators** (indigo background)
- **Icons from Lucide-react**:
  - LayoutDashboard: Dashboard
  - FolderOpen: Content Manager
  - Clipboard: Therapy Hub
  - Users: Doctor Management

### Lucide Icons Used
- `LayoutDashboard`, `FolderOpen`, `Clipboard`, `Users`
- `Plus`, `Edit2`, `Trash2`, `Check`, `X`
- `Clock`, `CheckCircle`, `UserCircle`, `Stethoscope`
- `LogOut`, `Menu`

### Stat Cards
Each stat card includes:
- Icon with colored background circle
- Large number display
- Descriptive label
- Color-coded by category:
  - Indigo: Total Requests
  - Green: Active Doctors
  - Yellow: Pending
  - Blue: Completed

## Data Persistence

Currently using **useState** (in-memory storage). Data resets on page refresh.

### To Add Persistence (Optional):
Use `localStorage` for persistence:
```javascript
// Save to localStorage
localStorage.setItem('healthsupport_doctors', JSON.stringify(doctors))

// Load from localStorage
const savedDoctors = JSON.parse(localStorage.getItem('healthsupport_doctors') || '[]')
```

## Terminology

All UI uses **"Therapy"** terminology:
- ✅ "Therapy Hub" (not "Triage Hub")
- ✅ "Therapy Requests" (not "Triage Requests")
- ✅ "Therapy" throughout the interface

## Implementation Details

### Functional Components
All components use React functional components with hooks:
- `useState` for state management
- `motion` components from Framer Motion for animations
- `useNavigate` for routing
- `useAuth` for authentication context

### State Management
```javascript
const [activeTab, setActiveTab] = useState('dashboard')
const [stressBusters, setStressBusters] = useState([...])
const [yogaTechniques, setYogaTechniques] = useState([...])
const [doctors, setDoctors] = useState([...])
const [therapyRequests, setTherapyRequests] = useState([...])
```

### Animations
- Smooth tab transitions
- Modal enter/exit animations
- Hover effects on buttons
- Loading states with AnimatePresence

## Testing the Dashboard

1. **Login as Admin**:
   ```
   Email: admin
   Password: admin@888
   ```

2. **Navigate to Dashboard**: Automatically redirected after login

3. **Test Each Feature**:
   - View stats on Dashboard tab
   - Add/Edit/Delete content in Content Manager
   - Accept/Reject requests in Therapy Hub
   - Add/Edit/Delete doctors in Doctor Management

4. **Logout**: Click logout button in sidebar

## Customization

### Add More Stat Cards
```javascript
<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
      <YourIcon className="text-purple-600" size={24} />
    </div>
    <span className="text-2xl font-bold text-slate-900">{yourStat}</span>
  </div>
  <h3 className="text-slate-600 font-medium">Your Label</h3>
</div>
```

### Add More Navigation Items
```javascript
<button
  onClick={() => setActiveTab('yourTab')}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
    activeTab === 'yourTab'
      ? 'bg-indigo-600 text-white'
      : 'text-slate-300 hover:bg-slate-800'
  }`}
>
  <YourIcon size={20} />
  <span className="font-medium">Your Feature</span>
</button>
```

## Responsive Design

- **Desktop**: Full sidebar + main content
- **Tablet**: Collapsible sidebar
- **Mobile**: Hidden sidebar with menu toggle
- **All grids**: Responsive (1 col → 2 cols → 3 cols)

---

**Built with:** React, Tailwind CSS, Framer Motion, Lucide React, React Router
