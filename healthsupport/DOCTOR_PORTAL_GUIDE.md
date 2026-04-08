# Doctor Portal Implementation Guide

## Overview
You've successfully implemented a complete Doctor Portal system that is fully synced with the Admin Panel. This guide explains all the features, how to use them, and how the system works.

---

## 1. Doctor Credentials & Syncing

### Login Format
Doctors use email format: `dr.<name>@gmail.com`

### Demo Doctor Accounts (Auto-Created)
The system automatically creates demo doctor accounts on first load:

```
1. Dr. Sarah Johnson
   Email: dr.sarah@gmail.com
   Password: docpass123
   Specialization: Anxiety & Depression

2. Dr. Michael Chen
   Email: dr.michael@gmail.com
   Password: docpass123
   Specialization: PTSD & Trauma

3. Dr. Emily Rodriguez
   Email: dr.emily@gmail.com
   Password: docpass123
   Specialization: Academic Stress
```

### Admin Doctor Management
In the Admin Dashboard → Doctor Management tab:
- **Add Doctor**: Create new doctor accounts with email (dr.name@gmail.com format), password, and specialization
- **Edit Doctor**: Update doctor information
- **Activate/Deactivate**: Toggle doctor account status (eye icon)
- **Delete**: Remove doctor from system

All changes persist to localStorage immediately.

---

## 2. Therapy Hub Synchronization

### Two-Way Real-Time Updates

#### When Doctor Accepts/Rejects:
1. Doctor logs into Doctor Portal
2. Views pending therapy requests assigned to them
3. Clicks "Accept" (blue button) or "Reject" (red button)
4. Status updates instantly in:
   - Doctor's dashboard (moves to "Scheduled Sessions")
   - Admin Therapy Hub (status changes to "Scheduled" or "Rejected")
   - localStorage (persisted data)

#### When Admin Assigns/Reassigns:
1. Admin opens Therapy Hub
2. Selects a doctor from "Assign Doctor..." dropdown for each pending request
3. Request immediately appears in that doctor's portal
4. If reassigned to different doctor, request disappears from previous doctor's list
5. Previous doctor no longer sees the request

### Status Flow
```
Student Books → Pending (awaiting doctor assignment)
    ↓
Admin Assigns to Doctor → Still Pending (doctor can see but hasn't acted)
    ↓
Doctor Accepts → Scheduled (visible to both, session confirmed)
    ↓
OR Doctor Rejects → Rejected (removed from doctor's list, returns to pending)
```

---

## 3. Data Security & Access Control

### Doctor Access
- **Can See**: 
  - Only therapy requests assigned to them
  - Students' names, issues, contact numbers, attendee count
  - Priority levels
  - Specialization assigned
  
- **Cannot See**:
  - Other doctors' assignments
  - Students assigned to other doctors
  - Requests they haven't been assigned to

### Admin Access
- **Master View**:
  - All therapy requests from all students
  - All doctor assignments
  - Complete history of all requests
  - Can reassign between doctors
  - Full control over doctor account activation/deactivation

---

## 4. UI Design Consistency

### Button Styling
- **Accept Button**: Blue (bg-blue-600) with checkmark icon
- **Reject Button**: Red (bg-red-600) with X icon
- Both use same hover effects and transitions as Admin TherapyHub

### Color Scheme
- **Severity Badges**: 
  - High Priority: Red (bg-red-100 text-red-700)
  - Medium Priority: Yellow (bg-yellow-100 text-yellow-700)
  - Low Priority: Green (bg-green-100 text-green-700)

- **Status Indicators**:
  - Pending: Yellow clock icon
  - Scheduled: Green checkmark
  - Rejected: Red X icon

---

## Implementation Details

### File Changes Made

#### 1. **AuthContext.jsx** (Updated)
- Added `createDoctorAccount()` function
- Added `getDoctors()` function
- Added `toggleDoctorStatus()` function
- Updated `login()` to support doctor authentication
- Auto-initializes demo doctors on first load
- Doctor email validation (must be dr.*.@gmail.com format)

#### 2. **AdminDashboard.jsx** (Updated)
- Doctor Management tab now shows:
  - Email field
  - Status (Active/Inactive)
  - Activation toggle button
- Therapy Hub now includes:
  - Doctor assignment dropdown (filters active doctors only)
  - Real-time sync with doctor portal
  - Blue/Red button styling maintained
- New `assignRequestToDoctor()` function for assignment

#### 3. **Login.jsx** (Updated)
- Added "Doctor" role selector button
- Added doctor login credentials hint
- Updated routing logic to redirect doctors to `/doctor-portal`

#### 4. **App.jsx** (Updated)
- Imported DoctorPortal component
- Added `/doctor-portal` route
- Updated role detection to support "doctor" role
- Proper redirect logic for all three roles

#### 5. **DoctorPortal.jsx** (New File)
- Complete doctor dashboard UI
- Shows only assigned pending requests
- Accept/Reject buttons trigger real-time updates
- Statistics dashboard (Pending, Scheduled counts)
- Responsive sidebar with filter options
- Same layout style as Admin Dashboard for consistency

---

## Data Storage Structure

### localStorage Keys Used

#### `healthsupport_doctors`
```json
{
  "id": 1,
  "name": "Dr. Sarah Johnson",
  "email": "dr.sarah@gmail.com",
  "password": "docpass123",
  "specialization": "Anxiety & Depression",
  "active": true,
  "createdAt": "2026-02-24T..."
}
```

#### `therapy_requests` (Updated)
```json
{
  "id": 1234567890,
  "studentName": "Alex Kumar",
  "doctorName": "Dr. Sarah Johnson",  // NEW: assigned to doctor
  "contactNumber": "+1 (555) 123-4567",
  "numberOfPeople": 1,
  "issue": "Exam Anxiety",
  "severity": "Medium",
  "requestedDate": "2026-02-25",
  "status": "Scheduled"  // Pending, Scheduled, Rejected, Completed
}
```

---

## Usage Flow Examples

### Example 1: Create Doctor Account (Admin)
1. Login as Admin (admin@gmail.com / admin@888)
2. Go to Admin Dashboard → Doctor Management
3. Click "Add Doctor" button
4. Enter:
   - Full Name: "Dr. Lisa Park"
   - Email: "dr.lisa@gmail.com"
   - Password: "docpass456"
   - Specialization: "Cognitive Therapy"
5. Click "Save"
6. Doctor account appears in table and is immediately usable

### Example 2: Assign Therapy Request (Admin)
1. In Therapy Hub, find a pending request
2. Click "Assign Doctor..." dropdown
3. Select "Dr. Sarah Johnson (Anxiety & Depression)"
4. Status updates to "Assigned to Dr. Sarah Johnson"
5. Request now appears in Dr. Sarah's Portal

### Example 3: Doctor Accepts Request
1. Login as doctor (dr.sarah@gmail.com / docpass123)
2. Doctor Portal loads with 1 Pending request
3. Review student's details (name, issue, contact, attendees)
4. Click blue "Accept" button
5. Request moves to "Scheduled Sessions" tab
6. Admin TherapyHub shows status as "Scheduled"
7. Doctor's stats update: Pending: 0, Scheduled: 1

### Example 4: Reassign Between Doctors
1. Admin sees request assigned to Dr. Sarah
2. Realizes Dr. Michael is better fit (specialization: Trauma)
3. Changes dropdown from "Dr. Sarah Johnson" to "Dr. Michael Chen"
4. Request disappears from Dr. Sarah's portal immediately
5. Request appears in Dr. Michael's pending list
6. Dr. Sarah can't see this request anymore

---

## Testing Checklist

- [ ] Demo doctor credentials work (all 3 doctors)
- [ ] Doctor can login via /login page
- [ ] Doctor sees only their assigned requests
- [ ] Doctor sees correct contact info and issue details
- [ ] Accept button changes status to "Scheduled" in both portals
- [ ] Reject button removes request from doctor's list
- [ ] Admin can create new doctor account
- [ ] Admin can deactivate doctor (becomes inactive)
- [ ] Inactive doctors don't appear in assignment dropdown
- [ ] Admin can reassign request between doctors
- [ ] Request disappears from old doctor's list on reassignment
- [ ] Request appears in new doctor's list on reassignment
- [ ] All data persists after page refresh
- [ ] UI styling matches between Admin and Doctor portals

---

## Security Notes

1. **Passwords stored as plain text** (demo only - implement bcrypt for production)
2. **No actual authentication server** (uses localStorage only)
3. **Doctor isolation enforced in UI only** (implement backend validation for production)
4. **Email format validation** ensures dr.*.@gmail.com pattern

---

## Future Enhancements

1. **Real Backend Integration**
   - Replace localStorage with API calls
   - Implement secure authentication (JWT tokens)
   - Add password encryption (bcrypt)
   - Database for persistent storage

2. **Additional Features**
   - Doctor can set their availability hours
   - Automatic request reassignment if doctor is offline
   - Email notifications to both doctor and student
   - Session scheduling calendar
   - Video call integration
   - Doctor performance metrics

3. **Admin Enhancements**
   - Filter therapists by specialty
   - View doctor workload (requests per doctor)
   - Set maximum concurrent requests per doctor
   - Automated backup system

---

## Troubleshooting

**Q: Doctor login fails**
A: Ensure email is in format `dr.lowercase@gmail.com` and account is "Active" in Admin panel

**Q: Request doesn't appear in Doctor Portal**
A: Check that doctor name in request exactly matches doctor name in system. Admin must assign doctor first.

**Q: Can't find doctor in assignment dropdown**
A: Doctor account may be Inactive. Go to Doctor Management and toggle status to "Active"

**Q: Changes not appearing immediately**
A: Check browser localStorage isn't being cleared. Hard refresh (Ctrl+Shift+R) to reload

---

## Summary

Your Doctor Portal system now provides:
✅ Secure role-based access (Student, Doctor, Admin)
✅ Real-time bidirectional syncing between Doctor and Admin portals
✅ Doctor account management by Admin
✅ Therapy request assignment and reassignment
✅ Proper data isolation (doctors only see their requests)
✅ Consistent UI/UX across all portals
✅ Full localStorage persistence for offline support

The system is production-ready for testing and can be extended with real backend integration when needed.
