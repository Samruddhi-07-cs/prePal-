# 📚 PrepPal - Student Planner Pro

A modern, feature-rich student task & exam planner with cloud database sync, calendar view, and smart notifications.

![PrepPal Features](https://img.shields.io/badge/Features-5%2B-brightgreen) ![Database](https://img.shields.io/badge/Database-Firebase%2FMySQL-blue) ![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📥 **Real Database** | Firebase Firestore or MySQL backend |
| 📅 **Calendar View** | Visual monthly calendar with task counts |
| 🔔 **Push Notifications** | Browser alerts for task reminders |
| 🎯 **Category Filters** | Filter tasks by Project, Exam, Assignment, etc. |
| 💾 **Export & Print** | Download as CSV or print formatted schedule |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 🔄 **Auto Sync** | Cloud sync with local storage fallback |
| ⚡ **Offline Support** | Works without internet using local storage |

---

## 🚀 Quick Start

### Option 1: Firebase (Easiest - Recommended)

1. Open `SETUP_GUIDE.md` and follow Firebase setup
2. Add your Firebase config to `first.js`
3. Open `index.html` in browser
4. Done! ✅

### Option 2: MySQL (Advanced)

1. Follow instructions in `MYSQL_SETUP.md`
2. Run Node.js backend server
3. Update API endpoint in `first.js`
4. Open `index.html` in browser

### Option 3: Local Only (No Setup)

1. Just open `index.html` - works immediately!
2. Tasks save to browser (local storage)
3. No cloud sync, but works offline

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| [**SETUP_GUIDE.md**](SETUP_GUIDE.md) | Firebase setup instructions |
| [**MYSQL_SETUP.md**](MYSQL_SETUP.md) | MySQL backend setup guide |
| [**FEATURES.md**](FEATURES.md) | Complete feature reference |
| [**README.md**](README.md) | This file |

---

## 🎯 Usage Guide

### Adding a Task
1. Enter task title (e.g., "Prepare for Math Exam")
2. Select due date & time
3. Choose or create category
4. Click "➕ Add Task"

### Managing Tasks
- ✅ **Check** box to mark complete
- 🔍 **Filter** by category buttons
- 🗑️ **Delete** with trash button
- 📅 **Switch** between list and calendar views

### Exporting & Printing
- 📥 **"Export CSV"** → Download spreadsheet file
- 🖨️ **"Print"** → Create formatted print document

### Syncing with Cloud
- ☁️ **"Sync"** → Push changes to Firebase/MySQL
- Automatic fallback to local storage if offline
- Check status messages for sync status

---

## 🏗️ Project Structure

```
prePal/
├── 📄 index.html           # Main HTML interface
├── 📄 first.js             # JavaScript logic & databases
├── 📄 style.css            # Modern styling & layout
├── 📄 SETUP_GUIDE.md       # Firebase setup instructions
├── 📄 MYSQL_SETUP.md       # MySQL backend option
├── 📄 FEATURES.md          # Complete feature reference
└── 📄 README.md            # This file
```

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5 / CSS3 / Vanilla JavaScript
- Font Awesome icons
- Responsive Grid/Flexbox layout

**Backend Options:**
- **Firebase** 🔥 (Recommended)
  - Firestore Database
  - Real-time sync
  - Free tier available
  
- **MySQL** 🗄️ (Advanced)
  - Node.js + Express
  - REST API
  - Full control

**Storage:**
- Browser LocalStorage (fallback)
- Cloud Database (primary)

---

## 🎨 Features Breakdown

### 1️⃣ List View
- Chronological task order
- One-click completion
- Category badges
- Overdue highlighting

### 2️⃣ Calendar View
- Monthly grid layout
- Task count per day
- Click to filter by date
- Month navigation

### 3️⃣ Category Filtering
- Pre-built: Project, Exam, Assignment, Class, Meeting
- Create custom categories
- One-click filtering
- "All" to reset filter

### 4️⃣ Notifications
- Browser push alerts
- Task-specific reminders
- One-time setup
- Dismissible notifications

### 5️⃣ Export/Print
- CSV for Excel/Sheets
- Print-friendly HTML table
- Timestamps included
- All filtered tasks included

---

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| IE 11 | ⚠️ Partial |

---

## ⚙️ Configuration

### Firebase (first.js)
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

### MySQL (first.js)
```javascript
const API_URL = 'http://localhost:3001/api/tasks';
```

---

## 🔐 Security

✅ Input validation & HTML escaping
✅ Local storage privacy (browser-only data)
✅ Firebase security rules available
✅ HTTPS recommended for production
✅ No sensitive data in frontend

---

## 🤝 Contributing

Have ideas for improvements? Consider:
- Dark mode theme
- Recurring tasks
- Task sharing/collaboration
- Mobile app version
- Task templates
- Advanced filters
- Statistics dashboard

---

## 📊 Usage Examples

### Student Scenario - Exam Week Planning
```
Monday:    "Study Ch. 5" (Exam) | "Finish PS#4" (Assignment)
Tuesday:   "Review Calculus" (Exam) | "Project Meeting" (Meeting)
Wednesday: "Practice Problems" (Exam)
Thursday:  "Final Review" (Exam) | "Project Presentation" (Project)
```

Export → Share with study group
Print → Post on dorm wall
Calendar → Visual stress relief 😅

### Project Manager Use Case
```
"Requirement Design" (Project - Week 1)
"Development Sprint 1" (Project - Week 2-3)
"Testing Phase" (Project - Week 4)
"Deployment" (Project - Week 5)
"Documentation" (Project - Week 5)
```

Print → Wall chart for team
Export → Email to stakeholders

---

## 🐛 Troubleshooting

**Tasks not syncing?**
→ Check Firebase config in first.js  
→ Verify Firestore is enabled

**Notifications not working?**
→ Allow notifications in browser  
→ Refresh page and click 🔔 button

**Export button not working?**
→ Disable popup blockers  
→ Try different browser

**Tasks disappear on new browser?**
→ Need Firebase setup for cloud sync  
→ Local storage is browser-specific

---

## 📞 Support & Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **MDN Web Notifications**: https://developer.mozilla.org/docs/Web/API/notification
- **Express.js Guide**: https://expressjs.com/
- **MySQL Documentation**: https://dev.mysql.com/doc/

---

## 📄 License

MIT License - Use freely for personal and commercial projects

---

## 🎯 Roadmap

- [ ] User authentication & accounts
- [ ] Data privacy settings
- [ ] Dark mode theme
- [ ] Recurring tasks
- [ ] Task collaboration/sharing
- [ ] Advanced statistics
- [ ] Mobile app (React Native)
- [ ] API documentation
- [ ] Rate limiting & quotas

---

## ⭐ Features You Requested

✅ Save tasks to Firebase/MySQL  
✅ Calendar & timetable view  
✅ Push browser notifications  
✅ Categories & filters  
✅ Export / print schedules  

**All implemented and ready to use!** 🎉

---

**Start planning your semester today!** 📚👨‍🎓

Open `index.html` → Add a task → Get organized! 🚀
