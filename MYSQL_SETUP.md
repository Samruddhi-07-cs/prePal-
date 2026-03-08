# MySQL Alternative Setup 🗄️

If you prefer **MySQL** instead of **Firebase**, use this backend setup.

## Overview

**Frontend**: PrepPal (HTML/CSS/JS) ↔️ **Backend**: Node.js/Express ↔️ **Database**: MySQL

---

## Backend Setup (Node.js + Express)

### 1. Install Node.js
Download from: https://nodejs.org/ (LTS version)

### 2. Create Backend Folder

```powershell
mkdir prepal-backend
cd prepal-backend
npm init -y
```

### 3. Install Dependencies

```powershell
npm install express mysql2 cors dotenv
```

### 4. Create `.env` File

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=prepal
PORT=3001
```

### 5. Create Database

```sql
CREATE DATABASE prepal;

USE prepal;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  dueDate DATETIME NOT NULL,
  category VARCHAR(100),
  done BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 6. Create `server.js`

```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY dueDate ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add task
app.post('/api/tasks', async (req, res) => {
  const { title, dueDate, category } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, dueDate, category) VALUES (?, ?, ?)',
      [title, dueDate, category]
    );
    res.json({ id: result.insertId, ...req.body, done: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, dueDate, category, done } = req.body;
  try {
    await pool.query(
      'UPDATE tasks SET title = ?, dueDate = ?, category = ?, done = ? WHERE id = ?',
      [title, dueDate, category, done, id]
    );
    res.json({ id, title, dueDate, category, done });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 7. Run Server

```powershell
node server.js
```

You should see: `🚀 Server running on http://localhost:3001`

---

## Frontend Update for MySQL

Replace the Firebase section in `first.js` with MySQL API calls:

```javascript
// MySQL API Base URL
const API_URL = 'http://localhost:3001/api/tasks';

// Load tasks from MySQL
async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    tasks = await response.json();
    db_source = "mysql";
    showStatus("📡 Loaded from MySQL", "success");
  } catch (error) {
    console.error("Load error:", error);
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    db_source = "local";
  }
  displayTasks();
}

// Save task to MySQL
async function saveTaskToDatabase(task) {
  try {
    const method = task.id ? 'PUT' : 'POST';
    const url = task.id ? `${API_URL}/${task.id}` : API_URL;
    
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    
    if (response.ok) {
      showStatus("✅ Sync successful", "success");
    }
  } catch (error) {
    console.error("Save error:", error);
    saveToLocalStorage();
  }
}

// Delete task from MySQL
async function deleteTaskFromDatabase(task) {
  try {
    await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
  } catch (error) {
    console.error("Delete error:", error);
  }
}
```

---

## Docker Setup (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: prepal
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: .
    ports:
      - "3001:3001"
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: root
      DB_NAME: prepal

volumes:
  mysql_data:
```

Run with: `docker-compose up`

---

## Production Deployment

### Heroku
```powershell
heroku login
heroku create prepal-backend
git push heroku main
```

### Railway
1. Go to railway.app
2. Connect GitHub repo
3. Add MySQL service
4. Deploy automatically

---

## Comparison: Firebase vs MySQL

| Feature | Firebase | MySQL |
|---------|----------|-------|
| Setup Time | 5 mins | 20 mins |
| Cost | Free tier available | Free (self-hosted) |
| Scalability | Automatic | Manual |
| Real-time | Yes | Polling |
| Authentication | Built-in | Manual |
| Best For | Quick projects | Large apps |

---

## Troubleshooting

❌ **Connection refused?** → Check MySQL is running and port 3306 is open
❌ **CORS error?** → Verify backend has `cors` enabled
❌ **Sync not working?** → Check API_URL is correct
