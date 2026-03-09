// AI Study Assistant Chat Interface
class StudyAssistantChat {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.resetBtn = document.getElementById('resetBtn');
        this.themeBtn = document.getElementById('themeBtn');
        this.charCount = document.getElementById('charCount');
        this.messageCount = document.getElementById('messageCount');
        this.statusToast = document.getElementById('statusToast');
        this.statusMessage = document.getElementById('statusMessage');

        this.messageCounter = 0;
        this.isTyping = false;

        this.init();
    }

    init() {
        // Event listeners
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
        this.messageInput.addEventListener('input', () => this.updateCharCount());
        this.resetBtn.addEventListener('click', () => this.resetConversation());
        this.themeBtn.addEventListener('click', () => this.toggleTheme());

        // Load theme preference
        this.loadTheme();

        // Update initial state
        this.updateSendButton();
        this.updateMessageCount();

        // Focus on input
        this.messageInput.focus();

        console.log('🤖 AI Study Assistant initialized');
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message to chat
        this.addMessage(message, 'user');

        // Clear input
        this.messageInput.value = '';
        this.updateCharCount();
        this.updateSendButton();

        // Show typing indicator
        this.showTyping();

        try {
            // Send message to server
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            // Hide typing indicator
            this.hideTyping();

            // Add AI response
            this.addMessage(data.response, 'assistant');

            // Update message count
            this.updateMessageCount();

        } catch (error) {
            console.error('Chat error:', error);
            this.hideTyping();
            this.addMessage('Sorry, I\'m having trouble connecting right now. Please check your internet connection and try again.', 'assistant');
            this.showStatus('Connection error. Please try again.', 'error');
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = sender === 'user'
            ? '<i class="fas fa-user"></i>'
            : '<i class="fas fa-robot"></i>';

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${this.formatMessage(content)}</p>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        if (sender === 'user' || sender === 'assistant') {
            this.messageCounter++;
        }
    }

    formatMessage(text) {
        // Basic markdown-like formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/`(.*?)`/g, '<code>$1</code>') // Code
            .replace(/\n/g, '</p><p>') // Line breaks
            .replace(/•/g, '•'); // Bullet points
    }

    showTyping() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
        this.sendBtn.disabled = true;
    }

    hideTyping() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
        this.sendBtn.disabled = false;
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = `${count}/1000`;

        // Change color when approaching limit
        if (count > 900) {
            this.charCount.style.color = '#f56565';
        } else if (count > 800) {
            this.charCount.style.color = '#ed8936';
        } else {
            this.charCount.style.color = 'var(--text-secondary)';
        }
    }

    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isTyping;

        // Change icon based on state
        const icon = this.sendBtn.querySelector('i');
        if (this.isTyping) {
            icon.className = 'fas fa-spinner fa-spin';
        } else {
            icon.className = 'fas fa-paper-plane';
        }
    }

    updateMessageCount() {
        this.messageCount.textContent = `${this.messageCounter} message${this.messageCounter !== 1 ? 's' : ''}`;
    }

    async resetConversation() {
        if (!confirm('Are you sure you want to start a new conversation? This will clear all messages.')) {
            return;
        }

        try {
            // Reset conversation on server
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reset: true })
            });

            if (response.ok) {
                // Clear chat messages (keep welcome message)
                const messages = this.chatMessages.querySelectorAll('.message');
                messages.forEach(msg => msg.remove());

                this.messageCounter = 0;
                this.updateMessageCount();
                this.showStatus('Conversation reset successfully!', 'success');
            } else {
                throw new Error('Failed to reset conversation');
            }
        } catch (error) {
            console.error('Reset error:', error);
            this.showStatus('Failed to reset conversation. Please refresh the page.', 'error');
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update theme button icon
        const icon = this.themeBtn.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const icon = this.themeBtn.querySelector('i');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    showStatus(message, type = 'info') {
        this.statusMessage.textContent = message;
        this.statusToast.className = `status-toast ${type}`;
        this.statusToast.style.display = 'flex';

        // Auto-hide after 4 seconds
        setTimeout(() => {
            this.statusToast.style.display = 'none';
        }, 4000);
    }
}

// Auto-resize textarea
function autoResizeTextarea() {
    const textarea = document.getElementById('messageInput');
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize chat
    const chat = new StudyAssistantChat();

    // Auto-resize textarea
    const textarea = document.getElementById('messageInput');
    textarea.addEventListener('input', autoResizeTextarea);

    // Update send button state
    textarea.addEventListener('input', () => chat.updateSendButton());

    console.log('🎓 AI Study Assistant Chat Interface Loaded');
});

// Handle page visibility changes (for typing indicator)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any ongoing operations if needed
        console.log('Page hidden - chat operations paused');
    } else {
        // Page is visible again
        console.log('Page visible - chat operations resumed');
    }
});