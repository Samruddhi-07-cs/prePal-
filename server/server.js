const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store conversation history (in production, use a database)
let conversationHistory = [];

// Chat endpoint with conversation history
app.post('/chat', async (req, res) => {
  try {
    const { message, reset } = req.body;

    // Reset conversation if requested
    if (reset) {
      conversationHistory = [];
      return res.json({
        response: "Hello! I'm your AI Study Assistant. I'm here to help you with any study-related questions. What would you like to know?",
        conversationId: Date.now()
      });
    }

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Add user message to conversation history
    conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    // Prepare messages for OpenAI API (include system prompt and recent history)
    const messages = [
      {
        role: 'system',
        content: `You are an expert AI Study Assistant designed to help students excel in their academic journey. You provide:

🎓 STUDY HELP: Clear explanations of complex topics, study techniques, and learning strategies
📚 SUBJECT ASSISTANCE: Help with homework, concepts, and problem-solving across all subjects
⏰ TIME MANAGEMENT: Study planning, productivity tips, and exam preparation strategies
🎯 MOTIVATION & MINDSET: Encouragement, goal-setting, and overcoming academic challenges
📝 EXAM PREP: Test-taking strategies, review techniques, and stress management
🧠 MEMORY & LEARNING: Effective memorization methods and retention techniques

Guidelines:
- Be encouraging, patient, and supportive
- Break down complex topics into simple, understandable steps
- Provide practical, actionable advice
- Ask clarifying questions when needed
- Keep responses conversational and engaging
- Use emojis occasionally to make responses more friendly
- If you don't know something specific, suggest reliable resources or study methods

Always maintain a positive, helpful tone that makes students feel supported in their learning journey.`
      },
      ...conversationHistory.slice(-10) // Keep last 10 messages for context
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Add AI response to conversation history
    conversationHistory.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    });

    // Keep conversation history manageable (max 50 messages)
    if (conversationHistory.length > 50) {
      conversationHistory = conversationHistory.slice(-50);
    }

    res.json({
      response: aiResponse,
      messageCount: conversationHistory.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);

    // Provide helpful error messages
    let errorMessage = 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.';

    if (error.code === 'insufficient_quota') {
      errorMessage = 'I\'ve reached my usage limit. Please try again later or contact support.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'There seems to be an issue with my configuration. Please contact support.';
    }

    res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get conversation history
app.get('/chat/history', (req, res) => {
  res.json({
    history: conversationHistory,
    messageCount: conversationHistory.length
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'AI Study Assistant Server is running',
    timestamp: new Date().toISOString(),
    conversationMessages: conversationHistory.length,
    openaiConfigured: !!process.env.OPENAI_API_KEY
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Study Assistant Server running on http://localhost:${PORT}`);
  console.log(`📚 Chat endpoint: POST http://localhost:${PORT}/chat`);
  console.log(`💚 Health check: GET http://localhost:${PORT}/health`);
  console.log(`📖 Frontend: http://localhost:${PORT}`);
});