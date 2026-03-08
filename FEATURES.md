# PrepPal - Feature Reference 🎓

## ✨ All Features at a Glance

### 1. 📥 **Add Tasks**
```
Title: "Prepare for Exam"
Due Date: March 15, 2026 2:00 PM
Category: Exam (or custom)
→ Click "Add Task"
```

### 2. 💾 **Save to Database**
- **Firebase** (Recommended): Cloud sync, no server needed
- **MySQL** (Advanced): Self-hosted, full control
- **Local Storage**: Works offline, browser only

Click **Sync** button to push changes to cloud.

---

### 3. 📋 **List View** (Default)
Shows all tasks in chronological order:
- ✅ **Checkbox**: Mark as complete
- 📅 **Due Date**: When task is due
- 🏷️ **Category**: Task type/group
- 🗑️ **Delete**: Remove task

**Visual Indicators:**
- 🟢 Green = Completed
- 🔴 Red = Overdue
- 🟦 Blue = Normal

---

### 4. 📅 **Calendar View**
Click "📅 Calendar View" tab:
- Visual month grid
- Shows task count per day
- Click day with tasks to view
- Navigate months: ← Previous | Next →

```
         March 2026
Sun Mon Tue Wed Thu Fri Sat
                        1  2
 3   4   5   6   7   8   9
10   11  12  13  14  15  16  (15 has 3 tasks 📍)
17   18  19  20  21  22  23
24   25  26  27  28  29  30
31
```

---

### 5. 🎯 **Filter by Category**
In filter section, click category buttons:
- **All**: Show everything
- **Project**: Only projects
- **Exam**: Only exams
- **Assignment**: Only assignments
- **Class**: Only classes
- **Meeting**: Only meetings
- **Custom**: Your custom categories

Click a button to filter, click "All" to reset.

---

### 6. 📥 **Export Tasks**

#### CSV Export
- Click "📥 Export CSV"
- Downloads: `prepal-tasks-2026-03-03.csv`
- Open in Excel/Google Sheets
- Contains: Title, Due Date, Category, Status

#### Print Schedule
- Click "🖨️ Print"
- Opens print dialog
- Formatted table view
- Perfect for printing/sharing

Example output:
```
Task               | Due Date              | Category  | Status
Prepare for Exam   | 3/15/2026 2:00 PM    | Exam      | Pending
Submit Project     | 3/20/2026 5:00 PM    | Project   | Completed
...
```

---

### 7. 🔔 **Push Notifications**
1. Click 🔔 button or reload page
2. Allow notifications when prompted
3. Get browser alert when task is due

**Example notification:**
```
┌─ PrepPal Reminder
├ Task due: Prepare for Exam
└─ [Close]
```

---

### 8. 🔄 **Sync with Cloud**
- Click "☁️ Sync" button
- Connects to Firebase/MySQL
- Saves all changes to database
- Shows status message

Status indicators:
- ✅ "Sync successful" (Green)
- ⚠️ "Using Local Storage" (Blue)
- 📡 "Loaded from Firebase" (Green)

---

## 🎮 Quick Actions

| Action | How To |
|--------|--------|
| Complete Task | Click checkbox next to task |
| Delete Task | Click 🗑️ button |
| Filter Tasks | Click category button |
| Switch Views | Click List/Calendar tabs |
| Push Sync | Click Sync button |
| Export Data | Click Export CSV button |
| Print Schedule | Click Print button |
| Create Category | Type in custom field |

---

## ⌨️ Keyboard Shortcuts

(Future enhancement opportunity)

| Shortcut | Action |
|----------|--------|
| Enter | Add task (focus on date field) |
| C | Toggle calendar |
| L | Toggle list |
| H | Show help |
| E | Export |
| P | Print |

---

## 🎨 Visual Design

### Color Scheme
- **Primary Purple**: #667eea (Actions, headers)
- **Success Green**: #4CAF50 (Complete, add)
- **Warning Orange**: #FF9800 (Export)
- **Info Blue**: #2196F3 (Print)
- **Error Red**: #f44336 (Delete, overdue)

### Responsive Breakpoints
- **Desktop**: Full layout
- **Tablet**: 768px - Adjusted grid
- **Mobile**: <768px - Single column

---

## 📊 Example Workflows

### Workflow 1: Add & Export Week's Tasks
1. Click "Add Task" five times for weekly assignments
2. Set different categories: Project, Exam, Class
3. Click "📥 Export CSV"
4. Open in Excel
5. Share with study group

### Workflow 2: Track Exam Prep
1. Add "Practice Problems" - Exam category
2. Add "Review Notes" - Study category
3. Click "Exam" filter button
4. See only exam-related tasks
5. Check off as complete

### Workflow 3: Print Schedule for Week
1. Navigate calendar to current week
2. Click "🖨️ Print"
3. Opens formatted table
4. Use browser print → "Save as PDF"
5. Print or share PDF

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Task not saving? | Check sync status - falls back to local storage |
| Calendar not showing? | Refresh browser, add tasks first |
| Export not working? | Check popup blocker settings |
| Notifications not appearing? | Allow in browser settings, click 🔔 button |
| Different tasks on different devices? | Need Firebase setup or login system |

---

## 🚀 Pro Tips

💡 Use consistent categories for better filtering
💡 Export weekly for backup archive
💡 Enable notifications for important tasks
💡 Use calendar to visualize workload
💡 Print before major exam week
💡 Custom categories for specific projects:
   - "Capstone-Final"
   - "DS-Assignment"
   - "Presentation-Oct"

---

## 📱 Mobile Usage

App is fully responsive:
- Touch-friendly buttons
- Single-column layout
- Readable on small screens
- Calendar works on portrait mode
- Export/Print works on mobile browsers

---

## 🔐 Data Security

- **Local Storage**: Private to your browser
- **Firebase**: Encrypted in transit, Cloud Firestore
- **MySQL**: Depends on server security
- Always use HTTPS for web
- Enable Firebase Security Rules

---

## 📞 Feature Requests

Consider adding:
- 📌 Pin important tasks
- 🔁 Recurring tasks (daily, weekly)
- 👥 Share tasks with friends
- 🎵 Custom notification sounds
- 🌙 Dark mode theme
- ⏰ Time-based reminders (15 min before)
- 💬 Quick notes on tasks
- 📊 Progress statistics
