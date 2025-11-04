# 🔑 API Key 设置指南

## 快速设置

### 步骤 1：获取 OpenAI API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 登录或注册账户
3. 前往 [API Keys 页面](https://platform.openai.com/api-keys)
4. 点击 "Create new secret key"
5. 复制生成的 API Key（格式类似：`sk-proj-...`）

### 步骤 2：设置 API Key 到项目

打开 `ai-generator.js` 文件，找到第 6 行：

```javascript
apiKey: 'YOUR_OPENAI_API_KEY_HERE', // 👈 在这里替换为你的实际 API Key
```

替换为你的实际 API Key：

```javascript
apiKey: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx', // 👈 替换为你的 API Key
```

### 步骤 3：保存并测试

1. 保存 `ai-generator.js` 文件
2. 刷新浏览器页面
3. 点击 "🤖 AI生成" 按钮
4. 输入描述，例如："我想要一只戴牛仔帽的酷狗"
5. 查看 AI 生成结果！

## ⚠️ 安全警告

### 重要提示

将 API Key 硬编码在客户端 JavaScript 文件中**存在安全风险**：

1. ⚠️ **客户端暴露**：任何访问网页的人都可以在浏览器开发者工具中看到你的 API Key
2. 💰 **费用风险**：他人可能盗用你的 API Key 产生费用
3. 🔒 **账户安全**：API Key 可能被滥用

### 适用场景

这种方式适合：
- ✅ 个人使用（不公开部署）
- ✅ 本地开发测试
- ✅ 受信任的小范围用户群

### 不适用场景

这种方式**不适合**：
- ❌ 公开网站
- ❌ 大量用户访问
- ❌ 商业项目

## 🛡️ 安全建议

### 方案 1：使用后端代理（推荐）

创建一个后端服务器来处理 OpenAI API 调用：

```javascript
// 前端调用你的后端 API
const response = await fetch('https://your-backend.com/api/generate', {
    method: 'POST',
    body: JSON.stringify({ message: userMessage })
});
```

```javascript
// 后端代码（Node.js 示例）
app.post('/api/generate', async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY; // 从环境变量读取
    // 调用 OpenAI API...
});
```

### 方案 2：使用环境变量（开发环境）

如果使用构建工具（如 Vite、Webpack）：

```javascript
// .env 文件
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxx

// 代码中使用
apiKey: import.meta.env.VITE_OPENAI_API_KEY
```

### 方案 3：限制 API Key 权限

在 OpenAI Platform 中：
1. 设置每月使用限额
2. 限制 API Key 的权限范围
3. 定期轮换 API Key

## 💰 费用控制

### 设置使用限额

1. 前往 [OpenAI Platform - Limits](https://platform.openai.com/account/limits)
2. 设置月度预算上限
3. 启用邮件通知

### 费用估算

使用 GPT-4o-mini 模型：
- 每次对话：约 $0.001 - $0.003
- 100 次对话：约 $0.10 - $0.30
- 1000 次对话：约 $1 - $3

### 监控使用情况

定期检查 [Usage 页面](https://platform.openai.com/usage) 查看 API 使用情况。

## 🔍 故障排除

### 问题：显示 "请先在 ai-generator.js 文件中设置 API Key"

**解决方案：**
1. 确认已将 `YOUR_OPENAI_API_KEY_HERE` 替换为实际的 API Key
2. 确认 API Key 格式正确（以 `sk-` 开头）
3. 保存文件后刷新浏览器

### 问题：显示 "Incorrect API key provided"

**解决方案：**
1. 检查 API Key 是否完整复制
2. 确认 API Key 未过期或被撤销
3. 在 OpenAI Platform 重新生成新的 API Key

### 问题：显示 "Rate limit exceeded"

**解决方案：**
1. 等待一段时间后重试
2. 检查你的 OpenAI 账户是否有足够的额度
3. 考虑升级 OpenAI 订阅计划

### 问题：网络错误或无法连接

**解决方案：**
1. 检查网络连接
2. 某些地区可能需要使用代理访问 OpenAI API
3. 检查浏览器控制台是否有 CORS 错误

## 📝 代码示例

### 完整的 API Key 设置示例

```javascript
// ai-generator.js (第 1-10 行)
const AIGenerator = {
    // ⚠️ 将下面的 'sk-proj-xxx...' 替换为你的实际 API Key
    apiKey: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    conversationHistory: [],
    
    init() {
        if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
            this.loadApiKey();
        }
        this.setupEventListeners();
    },
    // ... 其他代码
};
```

### 验证 API Key 格式

```javascript
// 在浏览器控制台中测试
console.log(AIGenerator.apiKey); // 应显示你的 API Key
console.log(AIGenerator.apiKey.startsWith('sk-')); // 应返回 true
```

## 🎯 最佳实践

### 开发阶段
1. 使用测试用的 API Key
2. 设置较低的使用限额
3. 定期检查使用情况

### 部署阶段
1. ⭐ **强烈建议使用后端代理**
2. 不要将包含 API Key 的代码提交到 GitHub
3. 使用 `.gitignore` 忽略敏感文件

### 长期维护
1. 定期轮换 API Key
2. 监控异常使用
3. 保持代码更新

## 📚 相关资源

- [OpenAI API 文档](https://platform.openai.com/docs)
- [OpenAI API Keys 管理](https://platform.openai.com/api-keys)
- [OpenAI 使用情况](https://platform.openai.com/usage)
- [OpenAI 定价](https://openai.com/api/pricing/)

## 🤝 需要帮助？

如果遇到问题，请：
1. 查看浏览器控制台的错误信息
2. 检查 OpenAI Platform 的状态页面
3. 联系项目开发者

---

**记住**：保护好你的 API Key，就像保护密码一样！🔐

