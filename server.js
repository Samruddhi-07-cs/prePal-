const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Store API key securely (from environment or config)
const API_KEY = "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";

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI study assistant for students. Provide clear, encouraging, and practical advice about studying, time management, exams, and academic success. Keep responses conversational, supportive, and under 300 words."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI. Please try again.',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PrepPal Server running at http://localhost:${PORT}`);
  console.log(`✅ AI Chat API ready at POST http://localhost:${PORT}/api/chat`);
});
