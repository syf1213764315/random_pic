# 🐕 AI 小狗生成器

一个有趣的小狗角色定制工具，现在集成了 OpenAI AI 功能！通过自然语言描述，让 AI 帮你生成个性化的小狗形象。

<img width="477" height="843" alt="image" src="https://github.com/user-attachments/assets/c9b04fd5-7ec7-41d6-97e7-c714a768da3c" />

## ✨ 特性

- 🎨 **可视化定制**：手动选择背景、身体、眼睛、头饰等配件
- 🤖 **AI 图片生成**：使用 DALL-E 3 直接生成个性化小狗图片
- 💬 **对话式交互**：持续对话来生成不同风格的小狗
- 💾 **保存分享**：保存图片、复制到剪贴板、分享到 Twitter/X
- 🎭 **丰富配件**：40+ 种不同的配件可供选择
- 🖼️ **高质量图片**：1024x1024 像素，生动风格

## 🚀 快速开始

### 1️⃣ 设置 API Key（仅需一次）

打开 `ai-generator.js`，在第 6 行设置你的 OpenAI API Key：

```javascript
apiKey: 'sk-proj-你的API_Key',
```

> 📖 详细设置指南：查看 [`API_KEY_SETUP.md`](./API_KEY_SETUP.md)

### 2️⃣ 打开网页

在浏览器中打开 `index.html`

### 3️⃣ 开始创作

**方式一：手动选择**
- 点击左侧面板的分类
- 在右侧选择你喜欢的配件

**方式二：AI 图片生成**（推荐）
- 点击 "🤖 AI生成" 按钮
- 描述你想要的小狗，AI 会直接生成图片，例如：
  ```
  我想要一只戴着牛仔帽和太阳镜的酷狗，站在西部沙漠中
  ```
- 生成后可以点击图片下载保存

## 📚 文档

- **[使用说明.txt](./使用说明.txt)** - 简明使用指南
- **[QUICK_START.md](./QUICK_START.md)** - 快速开始指南
- **[API_KEY_SETUP.md](./API_KEY_SETUP.md)** - API Key 设置详细说明
- **[AI_IMAGE_GENERATION.md](./AI_IMAGE_GENERATION.md)** - AI 图片生成详细说明 ⭐
- **[DEMO_EXAMPLES.md](./DEMO_EXAMPLES.md)** - 8个实际对话示例
- **[AI_USAGE.md](./AI_USAGE.md)** - 完整功能说明
- **[AI_FEATURE_SUMMARY.md](./AI_FEATURE_SUMMARY.md)** - 技术架构说明

## 💡 示例提示语

```
🤠 "创建一只西部牛仔风格的小狗"
👑 "我想要一只优雅的小狗，戴着皇冠"
🚀 "生成一只未来科技风的小狗，戴着头戴式耳机"
🎉 "给我一只派对达人风格的小狗，拿着气球"
```

## ⚙️ 技术栈

- **前端**：原生 HTML/CSS/JavaScript
- **AI 模型**：
  - GPT-4o-mini（生成图片提示词）
  - DALL-E 3（生成图片）
- **渲染**：Canvas API（手动定制） + DALL-E 3（AI 生成）
- **存储**：LocalStorage

## 💰 费用

- 每次 AI 图片生成：约 $0.04（DALL-E 3 标准质量）
- 建议设置 OpenAI 账户使用限额和月度预算

## ⚠️ 注意事项

- API Key 内置在代码中，适合个人使用
- 不建议将代码发布到公开网站（存在 API Key 泄露风险）
- 需要网络连接来访问 OpenAI API

## 🤝 贡献者

- **开发者 ayun**: [@ayun24335167](https://twitter.com/ayun24335167)
- **开发者 huahua**: [@erqjk93969379](https://twitter.com/erqjk93969379)
- **艺术家 Teddy**: [@0xteddyo](https://twitter.com/0xteddyo)

## 🌟 支持

- **Sentient AGI**: [@SentientAGI](https://x.com/SentientAGI)
- **Open AGI**: 为 80 亿人构建对齐的 AI 模型

## 📞 联系方式

Discord: syf1213764315

---

**享受创作的乐趣！** 🎨✨
