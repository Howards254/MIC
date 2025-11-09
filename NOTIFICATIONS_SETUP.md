# Notifications System Setup

## Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Run the notifications-schema.sql file
```

Or copy and paste the contents of `notifications-schema.sql` into the Supabase SQL Editor.

## Features

### For Users
- View notifications in the dashboard
- Mark notifications as read
- Delete notifications
- Get notified about:
  - Project approvals/rejections
  - Investor application status
  - System announcements
  - Important updates

### For Admins
- Send notifications to all users
- Send notifications to specific users
- Broadcast system-wide announcements
- Notify users about their project/application status

## Usage

### Admin Sending Notifications
1. Go to Admin Dashboard
2. Click "Send Notification" in sidebar
3. Choose recipient (all users or specific user)
4. Enter title and message
5. Click "Send Notification"

### Users Viewing Notifications
1. Click the bell icon in navbar
2. Or go to Dashboard > Notifications
3. Unread notifications are highlighted
4. Click "Mark as read" to mark as read
5. Click X to delete notification

## Notification Examples

**Project Approved:**
- Title: "Project Approved!"
- Message: "Congratulations! Your project '[Project Name]' has been approved and is now live on the platform."

**Investor Application Approved:**
- Title: "Investor Application Approved"
- Message: "Welcome! Your investor application has been approved. You can now invest in projects."

**System Announcement:**
- Title: "Platform Update"
- Message: "We've added new features to help you track your projects better. Check them out!"
