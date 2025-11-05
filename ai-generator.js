// AI Generator Module - OpenAI Integration
const AIGenerator = {
    // ⚠️ 安全提示：请在这里设置你的 OpenAI API Key
    // 注意：将 API Key 硬编码在客户端代码中存在安全风险
    // 建议：如果这是公开项目，请使用后端代理或环境变量
    apiKey: 'sk-Y6ga5dcc5acaa4dd42dbccda9ade8d175ea71afa0e8vdF5e', // 👈 在这里替换为你的实际 API Key
    conversationHistory: [],
    
    // Initialize the AI generator
    init() {
        // 如果 API Key 为空，尝试从 localStorage 加载
        if (!this.apiKey || this.apiKey.trim() === '') {
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
        if (!this.apiKey || this.apiKey.trim() === '') {
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
            // Call OpenAI API to generate image
            const response = await this.callOpenAI(message);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add AI response message to conversation
            this.addMessageToUI(response.message, 'ai');
            
            // Display generated image
            if (response.imageUrl) {
                this.displayGeneratedImage(response.imageUrl, response.prompt);
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
    
    // Generate image prompt from user description
    async generateImagePrompt(userMessage) {
        const systemPrompt = `你是一个图片提示词生成助手。用户会描述他们想要的小狗特征，你需要：
1. 理解用户的描述
2. 生成一个详细的英文图片提示词（prompt）
3. 以友好的中文回复用户

图片提示词要求：
- 必须是英文
- 描述要详细具体
- 风格：卡通风格、可爱、高质量
- 格式：cute cartoon dog character, [详细描述], high quality, digital art

示例：
用户："我想要一只戴着牛仔帽和太阳镜的酷狗"
提示词："cute cartoon dog character wearing a cowboy hat and sunglasses, cool style, happy expression, colorful background, high quality digital art, detailed illustration"

只返回JSON格式：
{
  "message": "中文回复",
  "prompt": "英文图片提示词"
}`;

        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        const response = await fetch('https://api.gptsapi.net/v1/chat/completions', {
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
        
        // Parse the JSON response
        try {
            const parsed = JSON.parse(aiResponse);
            
            // Add to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: aiResponse
            });
            
            return parsed;
        } catch (e) {
            console.error('Failed to parse AI response:', aiResponse);
            throw new Error('无法解析AI回复');
        }
    },
    
    // Call DALL-E API to generate image
    async generateImage(prompt) {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard',
                style: 'vivid'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || '图片生成失败');
        }

        const data = await response.json();
        return data.data[0].url; // 返回图片URL
    },
    
    // Call OpenAI API (main function)
    async callOpenAI(userMessage) {
        // Step 1: Generate image prompt from user description
        const promptResult = await this.generateImagePrompt(userMessage);
        
        // Step 2: Generate image using DALL-E
        const imageUrl = await this.generateImage(promptResult.prompt);
        
        // Return both message and image URL
        return {
            message: promptResult.message,
            imageUrl: imageUrl,
            prompt: promptResult.prompt
        };
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
    
    // Display generated image in conversation
    displayGeneratedImage(imageUrl, prompt) {
        const conversationArea = document.getElementById('conversation-area');
        if (!conversationArea) return;
        
        const imageDiv = document.createElement('div');
        imageDiv.className = 'ai-message';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble ai';
        
        // Create image element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'AI生成的小狗图片';
        img.className = 'generated-image';
        img.style.cssText = `
            max-width: 100%;
            border-radius: 8px;
            margin-top: 8px;
            display: block;
            cursor: pointer;
        `;
        
        // Add click to download
        img.addEventListener('click', () => {
            this.downloadImage(imageUrl);
        });
        
        // Add download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-image-btn';
        downloadBtn.textContent = '⬇ 下载图片';
        downloadBtn.style.cssText = `
            margin-top: 8px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 6px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
        `;
        downloadBtn.addEventListener('mouseenter', () => {
            downloadBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        downloadBtn.addEventListener('mouseleave', () => {
            downloadBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        downloadBtn.addEventListener('click', () => {
            this.downloadImage(imageUrl);
        });
        
        bubble.appendChild(img);
        bubble.appendChild(downloadBtn);
        imageDiv.appendChild(bubble);
        
        conversationArea.appendChild(imageDiv);
        
        // Scroll to bottom
        conversationArea.scrollTop = conversationArea.scrollHeight;
    },
    
    // Download image
    downloadImage(imageUrl) {
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ai-dog-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
                this.showSuccess('图片已下载！');
            })
            .catch(error => {
                console.error('下载失败:', error);
                this.showError('下载失败，请重试');
            });
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

