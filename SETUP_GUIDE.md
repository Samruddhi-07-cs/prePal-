# PrepPal - Setup Guide 📚

## Features Implemented ✨

✅ **Firebase Database Integration** - Real-time cloud storage for tasks
✅ **Calendar/Timetable View** - Visual overview of scheduled tasks
✅ **Push Notifications** - Browser notifications for task reminders
✅ **Categories & Filters** - Organize and filter tasks by category
✅ **Export/Print Schedules** - Export as CSV or print formatted schedule

---

## Quick Start

### 1. **Firebase Setup** (Cloud Database)

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "PrepPal" → Disable Google Analytics → Create

#### Step 2: Enable Firestore
1. In Firebase Console → Click "Firestore Database"
2. Click "Create Database"
3. Select "Start in test mode" → Continue
4. Choose a location → Create

#### Step 3: Get Configuration
1. Go to Project Settings (⚙️ icon)
2. Scroll to "Your apps" section
3. Click "Web" (</> icon)
4. Copy the config object

#### Step 4: Update first.js
Replace the `firebaseConfig` object in `first.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

### 2. **Browser Notifications**
- Click the 🔔 button or reload the page
- Allow notifications when prompted
- Tasks will show browser notifications at their due time

---

### 3. **Features Guide**

#### 📋 **List View**
- See all tasks in a chronological list
- Click checkbox to mark complete
- Click category badge to filter
- Overdue tasks highlighted in red

#### 📅 **Calendar View**
- Visual month calendar
- Tasks count shown on calendar days
- Click date to view tasks
- Navigate months with arrow buttons

#### 🎯 **Filter Tasks**
- Click category buttons to filter
- "All" shows all tasks
- Custom categories supported

#### 📥 **Export Tasks**
- **CSV Export**: Saves tasks as spreadsheet file
- **Print Schedule**: Creates formatted print document

#### 🔄 **Sync with Firebase**
- Click "Sync" button to sync with cloud
- Automatic fallback to local storage if offline
- Shows sync status messages

---

### 4. **Firestore Security Rules** (Production)

Replace default rules in Firestore with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Usage Tips

💡 **Add Custom Categories**: Type in "Or create new category" field
💡 **Keyboard Shortcut**: Enter in date field to add task quickly
💡 **Mobile Friends**: Responsive design works on phones & tablets
💡 **Offline Mode**: Works without internet using local storage

---

## Troubleshooting

❌ **Firebase not connecting?**
- Check config is correct in first.js
- Ensure Firestore is enabled
- Check browser console for errors

❌ **Notifications not working?**
- Allow notifications in browser settings
- Refresh page to re-request permission
- Check browser console for permission status

❌ **Tasks not saving?**
- App falls back to local storage automatically
- Check browser DevTools → Application → LocalStorage

---

## File Structure

```
prePal/
├── index.html      # Main UI
├── first.js        # Logic & Firebase
├── style.css       # Styling
└── SETUP_GUIDE.md  # This file
```

---

## Next Steps (Optional Enhancements)

🚀 Add user authentication (sign-in)
🚀 Tag/hashtag support
🚀 Recurring tasks
🚀 Collaborative sharing
🚀 Mobile app (React Native)

---

## Support

For Firebase docs: https://firebase.google.com/docs
For Web Notifications API: https://developer.mozilla.org/en-US/docs/Web/API/notification
