# 🔧 Troubleshooting & FAQ

## Common Issues & Solutions

### 🟥 ISSUE: "Firebase is not defined"

**Symptom**: Console error when opening app
```
Uncaught ReferenceError: firebase is not defined
```

**Cause**: Firebase CDN not loading or firebaseConfig not set

**Solutions**:
1. ✅ Check internet connection
2. ✅ Verify Firebase CDN links in `index.html`
3. ✅ Replace firebaseConfig with YOUR project credentials
4. ✅ Wait 30 seconds for CDN to load
5. ✅ Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Alternative**: Works fine with local storage - just won't sync to cloud

---

### 🟥 ISSUE: "Notifications not working"

**Symptom**: Click 🔔 but no dialog appears

**Causes & Solutions**:
1. **Browser blocked notifications**
   - Settings → Privacy → Notifications → Allow
   - Clear site data and refresh

2. **Permission already denied**
   - Chrome: Settings → Privacy → Site Settings → Notifications
   - Find prePal → Change to "Allow"

3. **Notification API not supported**
   - Use Chrome, Firefox, Safari, or Edge
   - Internet Explorer doesn't support notifications

4. **Try this**:
   ```javascript
   // Open browser console (F12) and paste:
   if ("Notification" in window) {
     console.log("Supported: " + Notification.permission);
   } else {
     console.log("NOT supported");
   }
   ```

---

### 🟥 ISSUE: Tasks disappear after refresh

**Symptom**: Add task → Refresh → Task gone

**Cause**: No database configured (local storage is browser-only)

**Solutions**:
1. ✅ **Setup Firebase** (see SETUP_GUIDE.md)
2. ✅ **Or use MySQL** (see MYSQL_SETUP.md)
3. ✅ **Or clear browser cache** (LocalStorage was cleared)

**Note**: Local storage works WITHIN same browser. Adding tasks in Chrome doesn't show in Firefox.

---

### 🟥 ISSUE: "Export CSV not downloading"

**Symptom**: Click export → Nothing happens

**Causes**:
1. **Popup blocker enabled**
   - Check popup blocker settings
   - Allow popups for this site

2. **No tasks to export**
   - Add tasks first
   - Check filter - might be hiding all tasks

3. **Try this instead**:
   - Right-click → "Inspect"
   - Go to Console tab
   - Copy tasksList output manually
   - Paste into spreadsheet

---

### 🟥 ISSUE: Print looks bad

**Symptom**: Print preview is broken/incomplete

**Solutions**:
1. **Adjust print settings**:
   - Print background graphics: ON
   - Margins: 0.5 inch
   - Scale: 100%

2. **Check filter status**:
   - Print includes only currently filtered tasks
   - Click "All" to print everything

3. **Try PDF export**:
   - Print → "Save as PDF"
   - More reliable than printing

---

### 🟥 ISSUE: "Cannot POST /api/tasks"

**Symptom**: MySQL backend error (if using MySQL option)

**Causes**:
1. **Backend not running**
   ```powershell
   # Check if running:
   node server.js
   # Should see: "🚀 Server running on http://localhost:3001"
   ```

2. **Wrong API URL**
   ```javascript
   // Check in first.js:
   const API_URL = 'http://localhost:3001/api/tasks';
   ```

3. **MySQL not running**
   ```powershell
   # Windows:
   net start MySQL80  # or your MySQL version
   
   # Mac:
   brew services start mysql
   
   # Linux:
   sudo systemctl start mysql
   ```

---

### 🟥 ISSUE: Calendar shows no dates

**Symptom**: Calendar blank or not rendering

**Solutions**:
1. **Add some tasks first** - calendar shows dates with tasks
2. **Reset currentMonth**: Open console → 
   ```javascript
   currentMonth = new Date();
   renderCalendar();
   ```
3. **Check browser console for errors** (F12)

---

### 🟥 ISSUE: "CORS error" (MySQL setup)

**Symptom**: 
```
Access to XMLHttpRequest blocked by CORS policy
```

**Cause**: Frontend and backend on different origins

**Solution**: Add CORS to server.js:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',  // Your frontend URL
  credentials: true
}));
```

---

### 🟥 ISSUE: Button clicks not working

**Symptom**: Click button but nothing happens

**Causes**:
1. **JavaScript disabled** - Enable JavaScript
2. **Syntax error** - Check browser console (F12)
3. **Async function not complete** - Wait a moment before clicking
4. **Form validation fails** - Check input fields
   - Title: Not empty
   - Due Date: Must be set
   - Will show alert if missing

---

## ❓ Frequently Asked Questions

### Q: Does it work without internet?
**A**: Yes! Uses local storage as fallback. Without setup, data stays in browser. With Firebase, syncs to cloud.

### Q: Can I use on multiple devices?
**A**: Only with Firebase/MySQL setup. Local storage is device-specific.

### Q: How do I delete all tasks?
**A**: 
```javascript
// Open console (F12) and paste:
tasks = [];
localStorage.clear();
displayTasks();
alert("Cleared!");
```

### Q: Can I import tasks from Excel?
**A**: Not currently. Consider adding CSV import feature (enhancement).

### Q: Is my data secure?
**A**: 
- Local storage: No (browser-specific)
- Firebase: Yes (Google servers, HTTPS)
- MySQL: Depends on your server security

### Q: Can I modify task the date later?
**A**: Current version: Delete & recreate. Future: Add edit button.

### Q: Why are old tasks still showing?
**A**: Check if "All" filter is selected. They might be completed (grayed out).

### Q: How do I backup my tasks?
**A**: Click "Export CSV" regularly. Or setup Firebase (auto-backup).

### Q: Can I share with friends?
**A**: Currently no. Export CSV and share that. Future: Collaboration feature.

---

## 🔍 Debug Mode

Open browser console (F12 → Console tab) and paste these to debug:

### Check app state:
```javascript
console.log("Tasks:", tasks);
console.log("Current Filter:", currentFilter);
console.log("DB Source:", db_source);
console.log("Firebase Ready:", firebaseReady);
```

### Test notifications:
```javascript
if (Notification.permission === 'granted') {
  new Notification('Test Notification', {
    body: 'If you see this, notifications work!',
    icon: '📚'
  });
} else {
  console.log('Permission:', Notification.permission);
}
```

### Force save to localStorage:
```javascript
localStorage.setItem("tasks", JSON.stringify(tasks));
console.log("Saved to localStorage");
```

### Clear everything:
```javascript
localStorage.clear();
console.log("Cleared all local storage");
```

### Test Firebase connection:
```javascript
if (firebaseReady && db) {
  db.collection('tasks').getDocs().then(snap => {
    console.log(snap.size + " tasks in Firebase");
  });
} else {
  console.log("Firebase not configured");
}
```

---

## Performance Tips

### If app is slow:
1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Close browser tabs**: Frees up memory
3. **Check console for errors**: F12 → Console tab
4. **Reduce tasks**: Too many tasks = slower

### Optimize:
- Archive old tasks regularly
- Use/export old tasks to CSV
- Delete completed tasks after a month

---

## Browser-Specific Issues

### ✅ Chrome/Brave
- Full support
- If issues: Clear cache → restart

### ✅ Firefox  
- Full support
- Notifications might need permission prompt

### ✅ Safari (Mac/iOS)
- Full support except:
  - Notifications limited
  - localStorage sometimes cleared
  - Use Chrome if issues

### ✅ Edge
- Full support
- Same as Chrome (uses Chromium)

### ❌ Internet Explorer
- NOT supported
- Update to Edge/Chrome

---

## Performance Issues on Mobile

### If slow on phone:
1. **Close background apps**
2. **Use portrait mode** for calendar
3. **Disable auto-refresh** feature
4. **Clear browser cache**
5. **Use Chrome** instead of Safari (better JS performance)

---

## Still Having Issues?

### Step-by-step troubleshooting:

1. **Hard refresh**: Ctrl+Shift+R
2. **Check console**: Press F12 → Console tab
3. **Note the error message** exactly
4. **Try in different browser**
5. **Clear cache & cookies**
6. **Disable extensions** temporarily
7. **Close & reopen browser**
8. **Restart computer** (really helps sometimes)

### If nothing works:

1. **Delete index.html from recent**
2. **Re-download files**
3. **Start fresh setup**
4. **Check internet stability** (run speedtest.net)

---

## Getting Help

When asking for help, provide:
1. What you were doing?
2. What happened?
3. What should happen?
4. Browser & version?
5. Screenshot/console error?

Example:
> "I clicked Add Task, entered 'Study Math', set date to tomorrow, clicked Add. No task appeared. Firefox on Windows. Error in console: 'tasks is undefined'"

---

## 💡 Pro Debug Tip

Create a bookmarklet for quick debugging:
```javascript
javascript:(function(){console.log('Tasks:', tasks.length);console.log('DB:', db_source);console.log('Notif:', Notification.permission);console.log('Firebase:', firebaseReady);})();
```

Save as bookmark, click to see status instantly!

---

## Reporting Bugs

Found a real bug? Document:
- ✅ Steps to reproduce
- ✅ Expected result
- ✅ Actual result
- ✅ Browser/OS
- ✅ Console errors
- ✅ Screenshot/video

Would be helpful for improvements!

---

**Last Resort**: Reset everything
```javascript
// Nuclear option - clears EVERYTHING
localStorage.clear();
sessionStorage.clear();
window.location.reload();
// Then refresh browser
```

💪 You've got this!
