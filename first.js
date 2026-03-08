// Firebase Configuration (Replace with your config from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDCQP5Z-xxxxxxxxxxxxxxxxxxx",
  authDomain: "prepal-xxxxx.firebaseapp.com",
  projectId: "prepal-xxxxx",
  storageBucket: "prepal-xxxxx.appspot.com",
  messagingSenderId: "xxxxxxxxxxxxx",
  appId: "1:xxxxxxxxxxxxx:web:xxxxxxxxxxxxx"
};

// Initialize Firebase
let db, firebaseReady = false;
try {
  const app = firebase.initializeApp(firebaseConfig);
  db = firebase.firestore(app);
  firebaseReady = true;
  console.log("✅ Firebase initialized");
} catch (e) {
  console.log("⚠️ Firebase setup needed - using localStorage as fallback");
  firebaseReady = false;
}

// State
let tasks = [];
let currentFilter = "all";
let currentMonth = new Date();
let db_source = "local"; // "firebase" or "local"

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  loadEvents();
  loadTimerStats();
  setupEventListeners();
  updateFilterButtons();
  renderCalendar();
  updateCalendarEvents();
  requestNotificationPermission();
});

// ============ FIREBASE FUNCTIONS ============
async function loadTasks() {
  try {
    if (firebaseReady && db) {
      const querySnapshot = await db.collection("tasks").orderBy("dueDate").get();
      tasks = [];
      querySnapshot.forEach(doc => {
        tasks.push({ ...doc.data(), firebaseId: doc.id });
      });
      db_source = "firebase";
      showStatus("📡 Loaded from Firebase", "success");
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      db_source = "local";
      showStatus("💾 Using Local Storage", "info");
    }
  } catch (error) {
    console.error("Load error:", error);
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    db_source = "local";
  }
  displayTasks();
}

async function saveTaskToDatabase(task) {
  try {
    if (firebaseReady && db) {
      if (task.firebaseId) {
        await db.collection("tasks").doc(task.firebaseId).update({
          title: task.title,
          dueDate: task.dueDate,
          category: task.category,
          done: task.done
        });
      } else {
        const docRef = await db.collection("tasks").add({
          title: task.title,
          dueDate: task.dueDate,
          category: task.category,
          done: task.done,
          createdAt: new Date()
        });
        task.firebaseId = docRef.id;
      }
      showStatus("✅ Sync successful", "success");
    } else {
      saveToLocalStorage();
    }
  } catch (error) {
    console.error("Save error:", error);
    saveToLocalStorage();
  }
}

async function deleteTaskFromDatabase(task) {
  try {
    if (firebaseReady && db && task.firebaseId) {
      await db.collection("tasks").doc(task.firebaseId).delete();
    }
    saveToLocalStorage();
  } catch (error) {
    console.error("Delete error:", error);
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ============ TASK MANAGEMENT ============
function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  let category = document.getElementById("category").value;
  const customCategory = document.getElementById("customCategory").value.trim();

  if (customCategory) {
    category = customCategory;
  }

  if (!title || !dueDate) {
    alert("⚠️ Please enter a title and due date!");
    return;
  }

  const task = {
    id: Date.now(),
    title,
    dueDate,
    category: category || "General",
    done: false
  };

  tasks.push(task);
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  saveTaskToDatabase(task);
  updateFilterButtons();
  displayTasks();
  updateCalendarEvents();
  setReminder(task);

  // Clear inputs
  document.getElementById("taskTitle").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("category").value = "";
  document.getElementById("customCategory").value = "";
}

function deleteTask(id) {
  const task = tasks.find(t => t.id === id);
  tasks = tasks.filter(t => t.id !== id);
  deleteTaskFromDatabase(task);
  saveToLocalStorage();
  displayTasks();
  updateCalendarEvents();
}

function toggleTaskDone(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTaskToDatabase(task);
    saveToLocalStorage();
    displayTasks();
    updateCalendarEvents();
  }
}

// ============ DISPLAY FUNCTIONS ============
function displayTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const filteredTasks = currentFilter === "all" 
    ? tasks 
    : tasks.filter(t => t.category === currentFilter);

  if (filteredTasks.length === 0) {
    list.innerHTML = "<li class='empty-state'>📭 No tasks yet</li>";
    updateDashboard();
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    const dueDate = new Date(task.dueDate);
    const isOverdue = dueDate < new Date() && !task.done;

    li.className = `task-item ${task.done ? "done" : ""} ${isOverdue ? "overdue" : ""}`;
    
    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTaskDone(${task.id})">
        <div class="task-details">
          <strong>${escapeHtml(task.title)}</strong>
          <div class="task-meta">
            📅 ${dueDate.toLocaleString()}
          </div>
          <span class="category-badge">${escapeHtml(task.category)}</span>
        </div>
      </div>
      <button class="delete-btn" onclick="deleteTask(${task.id})">
        <i class="fas fa-trash"></i>
      </button>
    `;

    list.appendChild(li);
  });
  
  updateDashboard();
}

function updateFilterButtons() {
  const container = document.getElementById("filterButtons");
  const categories = ["all", ...new Set(tasks.map(t => t.category))];

  container.innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === currentFilter ? "active" : ""}" 
            data-category="${cat}"
            onclick="filterByCategory('${cat}')">
      ${cat === "all" ? "All" : cat}
    </button>
  `).join("");
}

function filterByCategory(category) {
  currentFilter = category;
  updateFilterButtons();
  displayTasks();
}

// ============ CALENDAR VIEW ============
function renderCalendar() {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  document.getElementById("monthYear").textContent = 
    currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  let html = "<div class='weekdays'>";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach(day => {
    html += `<div class='weekday'>${day}</div>`;
  });
  html += "</div><div class='days'>";

  // Empty cells
  for (let i = 0; i < startingDayOfWeek; i++) {
    html += "<div class='day empty'></div>";
  }

  // Days with tasks
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
    const dayTasks = tasks.filter(t => t.dueDate.split("T")[0] === dateStr);
    
    html += `<div class='day ${dayTasks.length > 0 ? "has-tasks" : ""}' 
                  onclick="scrollToDate('${dateStr}')">
              <strong>${day}</strong>
              ${dayTasks.length > 0 ? `<span class='task-count'>${dayTasks.length}</span>` : ""}
            </div>`;
  }

  html += "</div>";
  document.getElementById("calendar").innerHTML = html;
}

function previousMonth() {
  currentMonth.setMonth(currentMonth.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentMonth.setMonth(currentMonth.getMonth() + 1);
  renderCalendar();
}

function scrollToDate(dateStr) {
  currentFilter = "all";
  updateFilterButtons();
  displayTasks();
  // In a real app, you'd scroll to the task
}

// ============ VIEW TOGGLE ============
function setupEventListeners() {
  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      
      const view = e.target.dataset.view;
      document.getElementById("dashboardView").style.display = view === "dashboard" ? "block" : "none";
      document.getElementById("listView").style.display = view === "list" ? "block" : "none";
      document.getElementById("calendarView").style.display = view === "calendar" ? "block" : "none";
      document.getElementById("timerView").style.display = view === "timer" ? "block" : "none";
      
      if (view === "dashboard") updateDashboard();
      if (view === "calendar") {
        updateCalendarEvents();
        updateUpcomingEvents();
      }
      if (view === "timer") updateTimerDisplay();
    });
  });

  document.getElementById("syncBtn").addEventListener("click", () => {
    loadTasks();
  });

  document.getElementById("notifBtn").addEventListener("click", () => {
    requestNotificationPermission();
  });
}

// ============ REMINDERS & NOTIFICATIONS ============
function setReminder(task) {
  const now = new Date();
  const due = new Date(task.dueDate);
  const diff = due - now;

  if (diff > 0) {
    setTimeout(() => {
      sendNotification(task);
    }, diff);
  }
}

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Browser doesn't support notifications");
    return;
  }

  if (Notification.permission === "granted") {
    showStatus("🔔 Notifications enabled", "success");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        showStatus("🔔 Notifications enabled", "success");
        sendNotification({ title: "PrepPal", body: "You're all set! 📚" });
      }
    });
  }
}

function sendNotification(task) {
  if (Notification.permission === "granted") {
    new Notification("📌 PrepPal Reminder", {
      body: `Task due: ${task.title}`,
      icon: "📚",
      tag: "task-reminder"
    });
  }
}

// ============ EXPORT & PRINT ============
function exportTasks() {
  const filteredTasks = currentFilter === "all" 
    ? tasks 
    : tasks.filter(t => t.category === currentFilter);

  if (filteredTasks.length === 0) {
    alert("No tasks to export!");
    return;
  }

  let csv = "Title,Due Date,Category,Status\n";
  filteredTasks.forEach(task => {
    const status = task.done ? "Completed" : "Pending";
    const date = new Date(task.dueDate).toLocaleString();
    csv += `"${task.title}","${date}","${task.category}","${status}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `prepal-tasks-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  showStatus("✅ Tasks exported as CSV", "success");
}

function printTasks() {
  const filteredTasks = currentFilter === "all" 
    ? tasks 
    : tasks.filter(t => t.category === currentFilter);

  let printContent = "<h2>📚 PrepPal - Task Schedule</h2>";
  printContent += `<p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>`;
  printContent += "<table border='1' cellpadding='10'>";
  printContent += "<tr><th>Task</th><th>Due Date</th><th>Category</th><th>Status</th></tr>";

  filteredTasks.forEach(task => {
    const status = task.done ? "✅ Completed" : "⏳ Pending";
    const date = new Date(task.dueDate).toLocaleString();
    printContent += `<tr><td>${escapeHtml(task.title)}</td><td>${date}</td><td>${escapeHtml(task.category)}</td><td>${status}</td></tr>`;
  });

  printContent += "</table>";

  const printWindow = window.open("", "", "width=900,height=600");
  printWindow.document.write(`
    <html><head><title>PrepPal - Print Schedule</title>
    <style>
      body { font-family: Arial; margin: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #4CAF50; color: white; }
      td { padding: 12px; border: 1px solid #ddd; }
      tr:nth-child(even) { background: #f5f5f5; }
    </style>
    </head><body>${printContent}</body></html>
  `);
  printWindow.document.close();
  printWindow.print();
  showStatus("🖨️ Opening print dialog", "info");
}

// ============ UTILITY FUNCTIONS ============
function showStatus(message, type = "info") {
  const statusEl = document.getElementById("statusMessage");
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
  
  setTimeout(() => {
    statusEl.textContent = "";
    statusEl.className = "status-message";
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============ DASHBOARD FUNCTIONS ============
const motivationalQuotes = [
  "🎯 Focus on progress, not perfection!",
  "💪 Every task completed brings you closer to your goals!",
  "🌟 You're doing an amazing job! Keep it up!",
  "📚 Learning is a journey, not a destination!",
  "✨ Consistency is the key to success!",
  "🚀 Push yourself, because no one else will!",
  "🏆 Success is the sum of small efforts!",
  "💡 The best time to start is now!",
  "🎓 Education is the most powerful weapon!",
  "⭐ You are capable of achieving great things!",
  "🔥 Your effort will never go unnoticed!",
  "🌈 Every day is a new opportunity!",
  "💯 Aim for progress, not perfection!",
  "🎪 You've got this! Keep moving forward!",
  "🌺 Your dedication is inspiring!"
];

function updateDashboard() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.done).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Update stat cards
  document.getElementById("totalTasks").textContent = totalTasks;
  document.getElementById("completedTasks").textContent = completedTasks;
  document.getElementById("pendingTasks").textContent = pendingTasks;
  document.getElementById("completionRate").textContent = completionRate + "%";

  // Update progress bar
  const progressFill = document.getElementById("progressFill");
  progressFill.style.width = completionRate + "%";
  
  const progressText = document.getElementById("progressText");
  progressText.textContent = `${completedTasks} / ${totalTasks} tasks completed`;

  // Update upcoming deadlines
  updateUpcomingDeadlines();

  // Show motivational quote if tasks are completed
  if (completedTasks > 0) {
    getRandomQuote();
  }
}

function updateUpcomingDeadlines() {
  const now = new Date();
  const upcomingContainer = document.getElementById("upcomingDeadlines");
  
  // Get incomplete tasks sorted by due date
  const pendingTasks = tasks.filter(t => !t.done)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5); // Show top 5 upcoming deadlines

  if (pendingTasks.length === 0) {
    upcomingContainer.innerHTML = "<p class='empty-message'>✅ No pending tasks - Great job!</p>";
    return;
  }

  upcomingContainer.innerHTML = pendingTasks.map(task => {
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let timeText = "";
    let className = "deadline-item";
    
    if (diffDays < 0) {
      timeText = "⚠️ OVERDUE";
      className += " today";
    } else if (diffDays === 0) {
      timeText = "🔴 Due Today";
      className += " today";
    } else if (diffDays === 1) {
      timeText = "🟠 Due Tomorrow";
      className += " today";
    } else if (diffDays <= 3) {
      timeText = `⏰ Due in ${diffDays} days`;
      className += " today";
    } else {
      timeText = `📅 ${dueDate.toLocaleDateString()}`;
      className += " upcoming";
    }

    return `
      <div class="${className}">
        <div class="deadline-title">${escapeHtml(task.title)}</div>
        <div class="deadline-time">${timeText}</div>
        <span class="deadline-category">${escapeHtml(task.category)}</span>
      </div>
    `;
  }).join("");
}

function getRandomQuote() {
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  document.getElementById("motivationalQuote").textContent = randomQuote;
}

// ============ IMPORTANT DATES / EVENTS ============
let events = [];
let currentEditingEventId = null;

function loadEvents() {
  events = JSON.parse(localStorage.getItem("importantDates")) || [];
  updateCalendarEvents();
  updateUpcomingEvents();
}

function saveEvents() {
  localStorage.setItem("importantDates", JSON.stringify(events));
  updateCalendarEvents();
  updateUpcomingEvents();
}

function openEventModal(dateStr) {
  const modal = document.getElementById("eventModal");
  const form = document.getElementById("eventForm");
  const modalTitle = document.getElementById("modalTitle");
  const deleteBtn = document.getElementById("deleteEventBtn");
  const eventDateInput = document.getElementById("eventDate");
  
  form.reset();
  currentEditingEventId = null;
  deleteBtn.style.display = "none";
  modalTitle.textContent = "Add Important Date";

  const date = new Date(dateStr);
  const formattedDate = date.toISOString().split("T")[0];
  eventDateInput.value = formattedDate;

  // Check if there's already an event on this date
  const existingEvent = events.find(e => e.date === formattedDate);
  if (existingEvent) {
    document.getElementById("eventTitle").value = existingEvent.title;
    document.getElementById("eventType").value = existingEvent.type;
    document.getElementById("eventDescription").value = existingEvent.description || "";
    currentEditingEventId = existingEvent.id;
    modalTitle.textContent = "Edit Important Date";
    deleteBtn.style.display = "block";
  }

  modal.classList.add("active");
}

function closeEventModal() {
  const modal = document.getElementById("eventModal");
  modal.classList.remove("active");
  currentEditingEventId = null;
  document.getElementById("eventForm").reset();
}

function saveEvent(e) {
  e.preventDefault();
  
  const title = document.getElementById("eventTitle").value.trim();
  const type = document.getElementById("eventType").value;
  const description = document.getElementById("eventDescription").value.trim();
  const dateStr = document.getElementById("eventDate").value;

  if (!title || !type || !dateStr) {
    alert("⚠️ Please fill in all required fields");
    return;
  }

  if (currentEditingEventId) {
    // Update existing event
    const event = events.find(e => e.id === currentEditingEventId);
    if (event) {
      event.title = title;
      event.type = type;
      event.description = description;
      event.date = dateStr;
    }
    showStatus("✏️ Event updated successfully", "success");
  } else {
    // Create new event
    const newEvent = {
      id: Date.now().toString(),
      title,
      type,
      description,
      date: dateStr
    };
    events.push(newEvent);
    showStatus("✅ Event added successfully", "success");
  }

  saveEvents();
  closeEventModal();
}

function deleteEvent() {
  if (!currentEditingEventId) return;
  
  if (confirm("⚠️ Are you sure you want to delete this event?")) {
    events = events.filter(e => e.id !== currentEditingEventId);
    saveEvents();
    closeEventModal();
    showStatus("🗑️ Event deleted", "success");
  }
}

function updateCalendarEvents() {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  document.getElementById("monthYear").textContent = 
    currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  let html = "<div class='weekdays'>";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach(day => {
    html += `<div class='weekday'>${day}</div>`;
  });
  html += "</div><div class='days'>";

  // Empty cells
  for (let i = 0; i < startingDayOfWeek; i++) {
    html += "<div class='day empty'></div>";
  }

  // Days with events and tasks
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
    
    // Get tasks for this day
    const dayTasks = tasks.filter(t => t.dueDate.split("T")[0] === dateStr);
    
    // Get events for this day
    const dayEvents = events.filter(e => e.date === dateStr);
    
    // Check if today
    const isToday = dateStr === todayStr;
    
    let dayClass = `day ${isToday ? "today" : ""}`;
    if (dayTasks.length > 0 || dayEvents.length > 0) {
      dayClass += " has-tasks";
    }

    let eventIndicators = "";
    if (dayEvents.length > 0) {
      eventIndicators = "<div class='event-indicator'>";
      dayEvents.forEach(evt => {
        eventIndicators += `<span class='event-dot ${evt.type.toLowerCase()}'></span>`;
      });
      eventIndicators += "</div>";
    }

    const taskIndicator = dayTasks.length > 0 ? `<span class='task-count'>${dayTasks.length}</span>` : "";
    
    html += `<div class='${dayClass}' onclick="openEventModal('${dateStr}')">
              <span class='day-number'>${day}</span>
              ${taskIndicator}
              ${eventIndicators}
            </div>`;
  }

  html += "</div>";
  document.getElementById("calendar").innerHTML = html;
}

function updateUpcomingEvents() {
  const now = new Date();
  const upcomingContainer = document.getElementById("upcomingEvents");
  
  // Get upcoming events sorted by date
  const upcomingList = events
    .map(e => ({
      ...e,
      dateObj: new Date(e.date)
    }))
    .filter(e => e.dateObj >= now)
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, 5);

  if (upcomingList.length === 0) {
    upcomingContainer.innerHTML = "<p class='empty-message'>📭 No upcoming events</p>";
    return;
  }

  upcomingContainer.innerHTML = upcomingList.map(evt => {
    const daysUntil = Math.ceil((evt.dateObj - now) / (1000 * 60 * 60 * 24));
    let dateDisplay = "";
    if (daysUntil === 0) {
      dateDisplay = "🔴 Today";
    } else if (daysUntil === 1) {
      dateDisplay = "🟠 Tomorrow";
    } else if (daysUntil <= 7) {
      dateDisplay = `⏰ ${daysUntil} days`;
    } else {
      dateDisplay = evt.dateObj.toLocaleDateString();
    }

    return `
      <div class='upcoming-event-item type-${evt.type.toLowerCase()}' onclick="openEventModalWithEvent('${evt.date}')">
        <span class='event-item-title'>${escapeHtml(evt.title)}</span>
        <span class='event-item-date'>${dateDisplay}</span>
        <span class='event-item-type'>${evt.type}</span>
      </div>
    `;
  }).join("");
}

function openEventModalWithEvent(dateStr) {
  openEventModal(dateStr);
}

// ============ STUDY TIMER (POMODORO) ============
let timerInterval = null;
let timerRunning = false;
let timeRemaining = 25 * 60; // 25 minutes in seconds
let isBreakTime = false;
let todayStudyTime = 0; // in minutes
let sessionsCompleted = 0;
let studyDuration = 25; // in minutes
let breakDuration = 5; // in minutes

function loadTimerStats() {
  const today = new Date().toISOString().split("T")[0];
  const timerData = JSON.parse(localStorage.getItem("timerData")) || {};
  
  if (timerData.lastDate === today) {
    todayStudyTime = timerData.studyTime || 0;
    sessionsCompleted = timerData.sessions || 0;
  } else {
    todayStudyTime = 0;
    sessionsCompleted = 0;
  }
  
  // Load timer durations
  const timerSettings = JSON.parse(localStorage.getItem("timerSettings")) || {};
  studyDuration = timerSettings.studyDuration || 25;
  breakDuration = timerSettings.breakDuration || 5;
  
  // Set input values
  document.getElementById("studyDurationInput").value = studyDuration;
  document.getElementById("breakDurationInput").value = breakDuration;
  document.getElementById("studyDurationInputFull").value = studyDuration;
  document.getElementById("breakDurationInputFull").value = breakDuration;
  
  timeRemaining = studyDuration * 60;
  updateTimerStats();
  updateTimerDisplay();
}

function saveTimerStats() {
  const today = new Date().toISOString().split("T")[0];
  const timerData = {
    lastDate: today,
    studyTime: todayStudyTime,
    sessions: sessionsCompleted
  };
  localStorage.setItem("timerData", JSON.stringify(timerData));
}

function updateTimerSettings() {
  // Get values from both widget and fullscreen inputs
  const widgetStudy = document.getElementById("studyDurationInput").value;
  const widgetBreak = document.getElementById("breakDurationInput").value;
  const fullStudy = document.getElementById("studyDurationInputFull");
  const fullBreak = document.getElementById("breakDurationInputFull");
  
  // Use widget values as primary source
  studyDuration = parseInt(widgetStudy) || 25;
  breakDuration = parseInt(widgetBreak) || 5;
  
  // Sync values to both inputs
  document.getElementById("studyDurationInput").value = studyDuration;
  document.getElementById("breakDurationInput").value = breakDuration;
  if (fullStudy) fullStudy.value = studyDuration;
  if (fullBreak) fullBreak.value = breakDuration;
  
  // Save to localStorage
  const timerSettings = {
    studyDuration: studyDuration,
    breakDuration: breakDuration
  };
  localStorage.setItem("timerSettings", JSON.stringify(timerSettings));
  
  // Reset timer with new duration
  resetTimer();
  showStatus(`⏰ Timer updated: ${studyDuration}min study, ${breakDuration}min break`, "success");
}

function startTimer() {
  if (timerRunning) return;
  
  timerRunning = true;
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("pauseBtn").style.display = "inline-block";
  document.getElementById("startBtnLarge").style.display = "none";
  document.getElementById("pauseBtnLarge").style.display = "inline-block";
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    
    if (timeRemaining <= 0) {
      completePhase();
    }
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  document.getElementById("startBtn").style.display = "inline-block";
  document.getElementById("pauseBtn").style.display = "none";
  document.getElementById("startBtnLarge").style.display = "inline-block";
  document.getElementById("pauseBtnLarge").style.display = "none";
}

function resetTimer() {
  pauseTimer();
  isBreakTime = false;
  timeRemaining = studyDuration * 60;
  updateTimerDisplay();
}

function completePhase() {
  clearInterval(timerInterval);
  timerRunning = false;
  
  if (!isBreakTime) {
    // Study session completed
    todayStudyTime += studyDuration;
    sessionsCompleted++;
    saveTimerStats();
    
    showStatus("✅ Great session! Time for a break.", "success");
    sendNotification({ 
      title: "📌 Study Session Complete! 🎉",
      body: `Great work! Take a ${breakDuration}-minute break.`
    });
    
    // Start break
    isBreakTime = true;
    timeRemaining = breakDuration * 60;
  } else {
    // Break completed
    showStatus("⏰ Break over! Ready for another session?", "info");
    sendNotification({ 
      title: "📌 Break Time Over! 💪",
      body: `Ready for your next ${studyDuration}-minute study session?`
    });
    
    isBreakTime = false;
    timeRemaining = studyDuration * 60;
  }
  
  updateTimerDisplay();
  document.getElementById("startBtn").style.display = "inline-block";
  document.getElementById("pauseBtn").style.display = "none";
  document.getElementById("startBtnLarge").style.display = "inline-block";
  document.getElementById("pauseBtnLarge").style.display = "none";
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const displayTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  
  // Update all timer displays
  document.getElementById("timerDisplay").textContent = displayTime;
  document.getElementById("timerLargeDisplay").textContent = displayTime;
  
  // Update status
  let status = "";
  let phase = "";
  if (isBreakTime) {
    status = "Break Time ☕";
    phase = `Break Phase: ${breakDuration} minutes`;
  } else {
    status = timerRunning ? "Focus Mode 🎯" : "Ready to study";
    phase = `Study Phase: ${studyDuration} minutes`;
  }
  
  document.getElementById("timerStatus").textContent = status;
  document.getElementById("timerLargeStatus").textContent = status;
  document.getElementById("timerPhase").textContent = phase;
}

function updateTimerStats() {
  const hours = Math.floor(todayStudyTime / 60);
  const mins = todayStudyTime % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  
  document.getElementById("studyHours").textContent = timeDisplay;
  document.getElementById("sessionCount").textContent = sessionsCompleted;
}