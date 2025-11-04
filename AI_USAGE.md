# AI 小狗生成器使用说明

## 功能介绍

这个项目现在集成了 OpenAI API，允许用户通过自然语言描述来生成个性化的小狗形象！

## 主要特性

- 🤖 **AI 对话界面**：通过自然语言描述你想要的小狗
- 🎨 **自动配件选择**：AI 会根据你的描述自动选择合适的配件组合
- 💾 **API Key 本地保存**：你的 API Key 安全保存在浏览器本地存储中
- 💬 **对话历史**：保持对话上下文，可以持续调整

## 如何使用

### 1. 获取 OpenAI API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 登录或注册账户
3. 前往 API Keys 页面创建新的 API Key
4. 复制你的 API Key

### 2. 在项目中使用

1. 打开网页后，点击 **"🤖 AI生成"** 按钮
2. 在弹出的对话框中，将你的 OpenAI API Key 粘贴到输入框
3. 在下方的文本框中描述你想要的小狗特征

### 3. 示例提示语

你可以这样描述：

- **酷炫风格**：
  ```
  我想要一只酷酷的小狗，戴着牛仔帽和太阳镜，有锋利的鲨鱼牙齿
  ```

- **可爱风格**：
  ```
  帮我创建一只可爱的小狗，戴着蝴蝶结，背景是星空
  ```

- **科技风格**：
  ```
  生成一只未来科技风格的小狗，戴着头戴式耳机，有激光眼睛
  ```

- **优雅风格**：
  ```
  我想要一只优雅的小狗，戴着皇冠和项链，穿着外套
  ```

- **随性描述**：
  ```
  给我一只看起来很开心的小狗
  ```

## 可用的配件选项

AI 会从以下配件中选择最适合你描述的组合：

### 背景 (Background)
- `none` - 无
- `flower` - 花朵
- `fireworks` - 烟花
- `meadow` - 草地
- `starry` - 星空

### 身体 (Body)
- `none` - 无
- `tshirt` - T恤
- `dress` - 连衣裙
- `coat` - 外套
- `workaholic` - 条纹衫

### 眼睛配饰 (Eyes)
- `none` - 无
- `sunglasses` - 太阳镜
- `glasses` - 眼镜
- `monocle` - 单片眼镜
- `monad-flaming` - 火焰眼
- `eye5` - 酷眼睛
- `eye6` - 星星眼
- `eye7` - 激光眼

### 头饰 (Head)
- `none` - 无
- `cap` - 棒球帽
- `wizard` - 巫师帽
- `crown` - 皇冠
- `cowboy-beepbop` - 牛仔帽
- `visor-headphone` - 头戴式耳机
- `plug` - 插头
- `tap7` - 特殊帽子

### 颈部配饰 (Shirt)
- `none` - 无
- `collar` - 项圈
- `bowtie` - 蝴蝶结
- `medal` - 奖章
- `workaholic` - 工作徽章

### 手持物品 (Handle)
- `none` - 无
- `balloon` - 气球
- `flower` - 花朵
- `gift` - 礼物
- `gold-coin` - 金币

### 嘴部 (Mouth)
- `none` - 无
- `shark-teeth` - 鲨鱼牙齿
- `smile` - 微笑
- `tongue` - 吐舌头
- `mouth4` - 开心嘴
- `mouth5` - 酷嘴
- `mouth6` - 吹口哨
- `mouth7` - 金牙

## 技术细节

### 使用的模型
- 模型：`gpt-4o-mini`
- 温度：`0.8`（适度创意）
- 响应格式：JSON

### API 调用
每次发送消息都会调用一次 OpenAI API，费用根据 OpenAI 的定价计算。

### 安全性
- API Key 保存在浏览器的 `localStorage` 中
- 不会发送到除 OpenAI 之外的任何服务器
- 所有处理都在客户端完成

## 注意事项

1. **API Key 安全**：不要在公共场合分享你的 API Key
2. **成本控制**：每次对话都会消耗 API 额度，建议监控使用情况
3. **网络要求**：需要能够访问 OpenAI API（可能需要代理）

## 故障排除

### 问题：无法连接到 OpenAI API
- 检查你的网络连接
- 确认 API Key 是否正确
- 检查是否需要使用代理

### 问题：AI 响应很慢
- OpenAI API 响应时间取决于服务器负载
- 正常响应时间在 2-10 秒之间

### 问题：配置没有应用到小狗
- 刷新页面重试
- 检查浏览器控制台是否有错误信息

## 联系方式

如有问题或建议，请联系开发者：
- ayun: [@ayun24335167](https://twitter.com/ayun24335167)
- huahua: [@erqjk93969379](https://twitter.com/erqjk93969379)
- Artist: [@0xteddyo](https://twitter.com/0xteddyo)

## 更新日志

### v1.0.0 (2024-11)
- ✨ 新增 AI 对话生成功能
- 🎨 集成 OpenAI GPT-4 模型
- 💬 实现智能配件选择
- 🔐 本地安全存储 API Key

