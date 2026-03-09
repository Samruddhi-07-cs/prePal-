# 🚀 PrepPal Backend Server Setup

## Quick Start - AI Chat Functionality

The AI Study Assistant now uses a secure backend server to handle OpenAI API calls.

### Prerequisites
- Node.js installed (download from https://nodejs.org/)
- Your OpenAI API key already configured in `server.js`

### 📌 How to Start the Server

**Option 1: Using Command Prompt**
```bash
cd c:\Users\Admin\OneDrive\Desktop\prePal
npm install
npm start
```

**Option 2: Using PowerShell**
```powershell
cd c:\Users\Admin\OneDrive\Desktop\prePal
npm install
npm start
```

The server will start on `http://localhost:3000`

### ✅ Verify Server is Running
- Open your browser and go to: `http://localhost:3000/api/health`
- You should see: `{"status":"Server is running"...}`

### 🤖 Now Test the AI Assistant
1. Open `index.html` in your browser
2. Click on the "🤖 AI Assistant" tab
3. Ask a study question like:
   - "How can I study more effectively?"
   - "Any tips for managing my time better?"
   - "How do I prepare for exams?"

### 🔒 Security Features
- ✅ API key is **never exposed** to the browser
- ✅ CORS errors **automatically fixed**
- ✅ Rate limiting friendly (processes requests serverside)
- ✅ Fallback to static responses if server is down

### 🛠️ Troubleshooting

**"Sorry, I'm having trouble connecting..."**
- Make sure the server is running (see Quick Start above)
- Check that `http://localhost:3000/api/health` works

**Server won't start**
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` folder and try: `npm install && npm start`

**Still having issues?**
- Check that Port 3000 is not in use
- Try restarting your terminal/PowerShell

---

## 📚 Project Structure
```
prePal/
├── index.html          (Main website)
├── style.css           (Styling)
├── first.js            (Frontend logic)
├── server.js           (Backend API server) ✨ NEW
├── package.json        (Node.js dependencies) ✨ NEW
└── README.md           (This file)
```

## 🎯 What's Changed
- **Before**: API key exposed in browser, CORS errors, security risk
- **After**: Secure backend server, no errors, super private! 🔐

Enjoy real conversations with your AI Study Assistant! 🎉
