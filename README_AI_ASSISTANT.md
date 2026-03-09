# 🤖 AI Study Assistant - PrepPal

A modern, ChatGPT-like AI Study Assistant built with Node.js, Express, and OpenAI's GPT-4o-mini model. Features real-time conversation, conversation history, and a beautiful responsive UI.

## ✨ Features

- **Real AI Conversations**: Powered by OpenAI GPT-4o-mini
- **Conversation History**: Maintains context throughout the chat
- **Modern UI**: Beautiful, responsive chat interface
- **Dark/Light Theme**: Toggle between themes
- **Typing Indicators**: Shows when AI is thinking
- **Message Counter**: Track conversation length
- **Auto-scroll**: Automatically scrolls to latest messages
- **Error Handling**: Graceful error handling with user feedback
- **Mobile Responsive**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd c:\Users\Admin\OneDrive\Desktop\prePal
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Set up your OpenAI API key:**
   - Open `server/.env` file
   - Replace `your_openai_api_key_here` with your actual OpenAI API key
   - Save the file

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
prePal/
├── server/                    # Backend server
│   ├── server.js             # Express server with OpenAI integration
│   ├── package.json          # Server dependencies
│   ├── .env                  # Environment variables (API key)
│   └── .gitignore           # Git ignore for server
├── public/                   # Frontend static files
│   ├── index.html           # Chat interface HTML
│   ├── style.css            # Modern chat styling
│   └── chat.js              # Frontend chat logic
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables (.env)
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=development
```

### OpenAI API Key Setup
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key and paste it in `server/.env`
4. **Important**: Never commit your `.env` file to version control!

## 🎯 Usage

### Starting the Server
```bash
cd server
npm start
```

### Development Mode (with auto-restart)
```bash
cd server
npm run dev
```

### API Endpoints

- **POST `/chat`** - Send a message and get AI response
  ```json
  {
    "message": "How can I improve my study habits?"
  }
  ```

- **GET `/health`** - Server health check
- **GET `/chat/history`** - Get conversation history

## 💬 Chat Features

### User Interface
- **Message Bubbles**: Clean, modern message design
- **Typing Animation**: Animated dots when AI is responding
- **Auto-scroll**: Automatically scrolls to new messages
- **Character Counter**: Shows message length (1000 char limit)
- **Send Button**: Disabled when input is empty or AI is typing

### Conversation Management
- **Reset Chat**: Start a new conversation anytime
- **Message History**: Maintains context for better responses
- **Error Recovery**: Handles network issues gracefully

### Themes
- **Light Theme**: Default clean look
- **Dark Theme**: Easy on the eyes
- **Persistent**: Remembers your theme preference

## 🛠️ Technical Details

### Backend (Node.js + Express)
- **Framework**: Express.js for REST API
- **AI Integration**: OpenAI Node.js SDK
- **CORS**: Enabled for cross-origin requests
- **Environment**: dotenv for configuration
- **Error Handling**: Comprehensive error management

### Frontend (Vanilla JavaScript)
- **No Frameworks**: Pure JavaScript for lightweight performance
- **Responsive Design**: CSS Grid and Flexbox
- **Modern CSS**: Custom properties, animations, gradients
- **Accessibility**: Keyboard navigation, screen reader friendly

### AI Model
- **Model**: GPT-4o-mini (fast and cost-effective)
- **Context**: Maintains conversation history
- **Personality**: Specialized for study assistance
- **Limits**: 500 tokens per response, 1000 char input limit

## 🔧 Troubleshooting

### "API key not configured"
- Check your `.env` file has the correct API key
- Make sure there are no extra spaces or quotes
- Restart the server after changing the key

### "Cannot connect to server"
- Ensure the server is running (`npm start`)
- Check that port 3000 is not blocked
- Try a different port in `.env` if needed

### "OpenAI API errors"
- Check your API key is valid and has credits
- Verify your OpenAI account has API access
- Check the OpenAI status page for outages

### Chat not working
- Open browser developer tools (F12)
- Check the Console tab for error messages
- Verify the server is running and accessible

## 📊 API Usage & Costs

- **Model**: GPT-4o-mini
- **Cost**: ~$0.0015 per 1K tokens
- **Typical chat**: 100-300 tokens per exchange
- **Monitoring**: Check your OpenAI dashboard for usage

## 🚀 Deployment

### For Production
1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2
3. Set up proper logging
4. Use environment variables instead of `.env` file
5. Consider rate limiting and authentication

### Environment Variables for Production
```bash
OPENAI_API_KEY=your_production_key
PORT=3000
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own study assistant!

## 🙏 Acknowledgments

- **OpenAI** for the amazing GPT models
- **Font Awesome** for the beautiful icons
- **Google Fonts** for typography

---

**Happy Studying! 📚✨**

Built with ❤️ for students worldwide