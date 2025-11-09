# Edit & Delete Features

## Overview
Added comprehensive edit and delete functionality for users to manage their projects and profiles.

## New Features

### 1. Edit Projects ✏️
**Location:** Dashboard > My Projects > Edit button

**Features:**
- Edit all project fields (title, description, funding goal, etc.)
- Update project stage, team size, timeline
- Modify technology, impact metrics, unique value
- Change market size and pitch video URL
- Cancel or save changes

**Access:** Only project owners can edit their own projects

**Route:** `/dashboard/edit-project/:id`

### 2. Delete Projects 🗑️
**Location:** Dashboard > My Projects > Delete button

**Features:**
- Delete button on each project
- Confirmation dialog before deletion
- Permanent deletion from database
- Automatic refresh after deletion

**Access:** Only project owners can delete their own projects

### 3. Investor Profile Management 👔
**Location:** Dashboard > Investor Profile (for investors only)

**Features:**
- Edit company name, investment range
- Update areas of interest
- Modify investment thesis
- Change portfolio companies
- Update preferred stage and ticket sizes
- Edit geographic focus and decision timeline
- Modify value-add description
- Create profile if doesn't exist
- Update existing profile

**Access:** Only approved investors (role = 'investor')

**Route:** `/dashboard/investor-profile`

### 4. Profile Settings ⚙️
**Location:** Dashboard > Profile Settings (all users)

**Features:**
- Edit full name
- Update bio
- Change location
- Modify phone number
- Update website URL
- Edit LinkedIn profile
- View email and role (read-only)

**Access:** All users (user, investor, admin)

**Route:** `/dashboard/settings`

## User Interface

### My Projects Page
Each project card now shows:
- **View** button - See project details
- **Edit** button (blue) - Edit project
- **Delete** button (red) - Delete project

### Navigation Updates
**User Navigation:**
- Added "Profile Settings" at bottom

**Investor Navigation:**
- Added "Investor Profile" (for investor-specific info)
- Added "Profile Settings" (for basic user info)

## Database Permissions

All features respect Row Level Security (RLS):
- Users can only edit/delete their own projects
- Investors can only update their own investor_profiles
- Users can only update their own profiles

## Usage Guide

### To Edit a Project:
1. Go to Dashboard > My Projects
2. Find the project you want to edit
3. Click "Edit" button
4. Modify any fields
5. Click "Save Changes" or "Cancel"

### To Delete a Project:
1. Go to Dashboard > My Projects
2. Find the project you want to delete
3. Click "Delete" button
4. Confirm deletion in popup
5. Project is permanently deleted

### To Manage Investor Profile:
1. Be an approved investor (role = 'investor')
2. Go to Dashboard > Investor Profile
3. Fill in or update all fields
4. Click "Save Profile"
5. Profile is visible to innovators in "Browse Investors"

### To Update Profile Settings:
1. Go to Dashboard > Profile Settings
2. Update your personal information
3. Click "Save Changes"
4. Information is updated across platform

## Benefits

### For Users:
✅ Fix mistakes in project submissions
✅ Update projects as they evolve
✅ Remove outdated projects
✅ Keep profile information current
✅ Better control over their data

### For Investors:
✅ Update investment criteria
✅ Modify portfolio information
✅ Change ticket sizes as needed
✅ Keep profile attractive to innovators
✅ Manage both investor and user profiles

### For Platform:
✅ More accurate data
✅ Better user experience
✅ Reduced support requests
✅ Higher user satisfaction
✅ More engaged users

## Security

### Project Editing:
- Only project owner can edit
- Verified through user_id match
- RLS policies enforce ownership

### Project Deletion:
- Confirmation required
- Only owner can delete
- Cascading deletes handled by database

### Profile Updates:
- Users can only update own profile
- Investor profiles linked to user_id
- RLS policies prevent unauthorized access

## Technical Details

### New Files Created:
1. `src/pages/dashboard/EditProject.jsx` - Edit project form
2. `src/pages/dashboard/InvestorProfile.jsx` - Investor profile management
3. `src/pages/dashboard/ProfileSettings.jsx` - User profile settings

### Modified Files:
1. `src/pages/dashboard/MyProjects.jsx` - Added edit/delete buttons
2. `src/components/layout/DashboardLayout.jsx` - Added navigation items
3. `src/pages/DashboardPage.jsx` - Added routes

### Routes Added:
- `/dashboard/edit-project/:id` - Edit specific project
- `/dashboard/investor-profile` - Manage investor profile
- `/dashboard/settings` - User profile settings

## Testing Checklist

- [ ] Submit a project as user
- [ ] Edit the project and save changes
- [ ] Verify changes appear on project detail page
- [ ] Delete a project and confirm it's removed
- [ ] Apply as investor and get approved
- [ ] Create/update investor profile
- [ ] Verify profile appears in Browse Investors
- [ ] Update profile settings
- [ ] Verify name/bio updates across platform
- [ ] Try to edit another user's project (should fail)
- [ ] Try to delete another user's project (should fail)

## Future Enhancements

1. **Version History**: Track project changes over time
2. **Soft Delete**: Archive instead of permanent delete
3. **Bulk Actions**: Edit/delete multiple projects
4. **Image Upload**: Add project images
5. **Document Upload**: Attach pitch decks, financials
6. **Change Notifications**: Alert followers of project updates
7. **Approval Re-review**: Re-submit edited projects for approval
8. **Profile Completeness**: Show % complete for profiles
9. **Auto-save**: Save drafts automatically
10. **Undo Delete**: Restore recently deleted projects
