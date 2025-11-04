// AI Generator Module - OpenAI Integration
const AIGenerator = {
    // ⚠️ 安全提示：请在这里设置你的 OpenAI API Key
    // 注意：将 API Key 硬编码在客户端代码中存在安全风险
    // 建议：如果这是公开项目，请使用后端代理或环境变量
    apiKey: '', // 👈 在这里替换为你的实际 API Key
    conversationHistory: [],
    
    // Initialize the AI generator
    init() {
        // 如果已经设置了有效的 API Key，就不需要从 localStorage 加载
        if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
            this.loadApiKey();
        }
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners() {
        // AI button click
        const aiBtn = document.getElementById('ai-btn');
        if (aiBtn) {
            aiBtn.addEventListener('click', () => this.openDialog());
        }
        
        // Close dialog button
        const closeBtn = document.getElementById('close-dialog-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeDialog());
        }
        
        // Close on overlay click
        const overlay = document.getElementById('ai-dialog-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeDialog();
                }
            });
        }
        
        // Send button click
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        
        // Enter key to send
        const userInput = document.getElementById('user-input');
        if (userInput) {
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    },
    
    // Open dialog
    openDialog() {
        const overlay = document.getElementById('ai-dialog-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    },
    
    // Close dialog
    closeDialog() {
        const overlay = document.getElementById('ai-dialog-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    },
    
    // Load API key from localStorage
    loadApiKey() {
        const savedKey = localStorage.getItem('openai_api_key');
        if (savedKey) {
            this.apiKey = savedKey;
            const input = document.getElementById('api-key-input');
            if (input) {
                input.value = savedKey;
            }
        }
    },
    
    // Save API key to localStorage
    saveApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('openai_api_key', key);
    },
    
    // Send message to OpenAI
    async sendMessage() {
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (!userInput || !userInput.value.trim()) return;
        
        const message = userInput.value.trim();
        userInput.value = '';
        
        // Check API key
        if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
            this.showError('请先在 ai-generator.js 文件中设置 API Key');
            return;
        }
        
        // Add user message to conversation
        this.addMessageToUI(message, 'user');
        
        // Disable send button
        if (sendBtn) {
            sendBtn.disabled = true;
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Call OpenAI API
            const response = await this.callOpenAI(message);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add AI response to conversation
            this.addMessageToUI(response.message, 'ai');
            
            // Apply the configuration if provided
            if (response.configuration) {
                this.applyConfiguration(response.configuration);
                this.showSuccess('已应用配置到小狗！');
            }
            
        } catch (error) {
            console.error('Error calling OpenAI:', error);
            this.removeTypingIndicator();
            this.showError('抱歉，生成失败：' + error.message);
        } finally {
            // Re-enable send button
            if (sendBtn) {
                sendBtn.disabled = false;
            }
        }
    },
    
    // Call OpenAI API
    async callOpenAI(userMessage) {
        const systemPrompt = `你是一个小狗角色定制助手。用户会描述他们想要的小狗特征，你需要：
1. 理解用户的描述
2. 选择合适的配件组合
3. 以友好的方式回复用户
4. 返回配件配置的JSON

可用的配件类别和选项：
- background: none, flower, fireworks, meadow, starry
- body: none, tshirt, dress, coat, workaholic
- eyes: none, sunglasses, glasses, monocle, monad-flaming, eye5, eye6, eye7
- head: none, cap, wizard, crown, cowboy-beepbop, visor-headphone, plug, tap7
- shirt: none, collar, bowtie, medal, workaholic
- handle: none, balloon, flower, gift, gold-coin
- mouth: none, shark-teeth, smile, tongue, mouth4, mouth5, mouth6, mouth7

你的回复必须包含两部分：
1. message: 给用户的友好回复（中文）
2. configuration: 配件配置的JSON对象

回复格式示例：
{
  "message": "太棒了！我为你创建了一只酷酷的牛仔小狗，戴着牛仔帽和太阳镜，还有锋利的鲨鱼牙齿！",
  "configuration": {
    "background": "starry",
    "body": "workaholic",
    "eyes": "sunglasses",
    "head": "cowboy-beepbop",
    "shirt": "collar",
    "handle": "none",
    "mouth": "shark-teeth"
  }
}`;

        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...this.conversationHistory
                ],
                temperature: 0.8,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || '请求失败');
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        // Add AI response to conversation history
        this.conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });

        // Parse the JSON response
        try {
            const parsed = JSON.parse(aiResponse);
            return parsed;
        } catch (e) {
            console.error('Failed to parse AI response:', aiResponse);
            return {
                message: aiResponse,
                configuration: null
            };
        }
    },
    
    // Add message to UI
    addMessageToUI(message, type) {
        const conversationArea = document.getElementById('conversation-area');
        if (!conversationArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'user' ? 'user-message' : 'ai-message';
        
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${type}`;
        
        // Handle message formatting
        if (typeof message === 'string') {
            bubble.innerHTML = this.formatMessage(message);
        } else {
            bubble.textContent = JSON.stringify(message);
        }
        
        messageDiv.appendChild(bubble);
        conversationArea.appendChild(messageDiv);
        
        // Scroll to bottom
        conversationArea.scrollTop = conversationArea.scrollHeight;
    },
    
    // Format message with basic markdown support
    formatMessage(message) {
        // Convert newlines to <br>
        message = message.replace(/\n/g, '<br>');
        
        // Convert **bold** to <strong>
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert *italic* to <em>
        message = message.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return message;
    },
    
    // Show typing indicator
    showTypingIndicator() {
        const conversationArea = document.getElementById('conversation-area');
        if (!conversationArea) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message';
        typingDiv.id = 'typing-indicator';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble ai typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            bubble.appendChild(dot);
        }
        
        typingDiv.appendChild(bubble);
        conversationArea.appendChild(typingDiv);
        
        // Scroll to bottom
        conversationArea.scrollTop = conversationArea.scrollHeight;
    },
    
    // Remove typing indicator
    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    },
    
    // Apply configuration to character
    applyConfiguration(config) {
        if (!config) return;
        
        // Check if CharacterBuilder exists
        if (typeof CharacterBuilder === 'undefined') {
            console.error('CharacterBuilder not found');
            return;
        }
        
        // Apply each item
        Object.keys(config).forEach(category => {
            const itemId = config[category];
            if (itemId && CharacterBuilder.currentItems.hasOwnProperty(category)) {
                CharacterBuilder.updateItem(category, itemId);
            }
        });
        
        // Update UI if App exists
        if (typeof App !== 'undefined') {
            App.updateSelectionDisplay();
        }
    },
    
    // Show error message
    showError(message) {
        const conversationArea = document.getElementById('conversation-area');
        if (!conversationArea) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        conversationArea.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
        
        // Scroll to bottom
        conversationArea.scrollTop = conversationArea.scrollHeight;
    },
    
    // Show success message
    showSuccess(message) {
        const conversationArea = document.getElementById('conversation-area');
        if (!conversationArea) return;
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        conversationArea.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
        
        // Scroll to bottom
        conversationArea.scrollTop = conversationArea.scrollHeight;
    },
    
    // Clear conversation
    clearConversation() {
        this.conversationHistory = [];
        const conversationArea = document.getElementById('conversation-area');
        if (conversationArea) {
            // Keep only the initial AI message
            const firstMessage = conversationArea.querySelector('.ai-message');
            conversationArea.innerHTML = '';
            if (firstMessage) {
                conversationArea.appendChild(firstMessage);
            }
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AIGenerator.init();
    });
} else {
    AIGenerator.init();
}

// Export for debugging
window.AIGenerator = AIGenerator;

