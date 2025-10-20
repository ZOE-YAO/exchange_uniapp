# 汇率速算 - 多币种汇率计算器

一个基于 UniApp + Vue3 开发的轻量、流畅、离线可用的多币种汇率计算工具。

## 📱 项目特性

- ✅ **多币种支持**：支持 150+ 全球主流货币
- ✅ **实时汇率**：在线获取最新汇率数据
- ✅ **离线可用**：内置默认汇率，断网也能用
- ✅ **精确计算**：使用 big.js 避免浮点数精度问题
- ✅ **智能联动**：任意币种输入，其他自动换算
- ✅ **自定义键盘**：专为金额输入优化
- ✅ **多语言支持**：简体中文、English
- ✅ **主题切换**：浅色/深色/跟随系统
- ✅ **流畅体验**：优雅动画和交互

## 🏗️ 技术栈

- **框架**：UniApp + Vue 3
- **状态管理**：Pinia 2.3.1
- **精确计算**：big.js 6.2.2
- **日期处理**：dayjs 1.11.18
- **样式**：SCSS + CSS Variables

## 📁 项目结构

```
汇率速算/
├── components/              # 组件
│   ├── number-keyboard/    # 自定义数字键盘
│   ├── currency-input/     # 币种输入卡片
│   └── currency-item/      # 币种列表项
├── store/                  # Pinia 状态管理
│   ├── currency.js        # 币种状态
│   ├── rate.js            # 汇率数据
│   └── settings.js        # 设置状态
├── utils/                  # 工具函数
│   ├── calculate.js       # 汇率计算
│   ├── format.js          # 格式化
│   ├── storage.js         # 本地存储
│   └── i18n.js            # 多语言
├── api/                    # API 接口
│   ├── exchange.js        # 汇率 API
│   └── request.js         # 请求封装
├── data/                   # 静态数据
│   ├── currencies.js      # 150+ 币种信息
│   └── default-rates.js   # 默认汇率数据
├── locale/                 # 多语言
│   ├── zh-CN.js           # 简体中文
│   └── en-US.js           # 英文
├── theme/                  # 主题
│   ├── variables.scss     # CSS 变量
│   └── common.scss        # 公共样式
└── pages/                  # 页面
    ├── index/             # 汇率计算主页
    ├── currency-select/   # 币种选择页
    └── settings/          # 设置页
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 使用 HBuilderX 运行

1. 使用 HBuilderX 打开项目
2. 选择运行 → 运行到浏览器 / 运行到手机或模拟器
3. 选择目标平台（浏览器、iOS、Android）

### 3. 命令行编译（可选）

```bash
# 编译到 H5
npm run dev:h5

# 编译到 iOS
npm run dev:app-ios

# 编译到 Android
npm run dev:app-android

# 编译到微信小程序
npm run dev:mp-weixin

# 编译到支付宝小程序
npm run dev:mp-alipay
```

## 📖 核心功能说明

### 1. 汇率计算

- 支持同时显示 2-10 个币种
- 任意币种输入金额，其他币种自动换算
- 支持小数点输入，最多 8 位小数
- 使用 big.js 确保计算精度

### 2. 币种管理

- 150+ 全球主流货币
- 搜索功能（支持代码、中文、英文）
- 常用币种快速选择
- 自定义币种排序

### 3. 汇率数据

- **在线模式**：实时获取最新汇率
- **离线模式**：自动使用缓存数据
- **数据源**：https://open.er-api.com（免费无限制）
- **更新方式**：下拉刷新 / 点击刷新按钮

### 4. 设置功能

- **语言**：简体中文 / English
- **小数位**：2 / 4 / 6 / 8 位
- **千分位**：逗号 / 点 / 空格 / 无
- **主题**：浅色 / 深色 / 跟随系统
- **自动更新**：开启 / 关闭

## 🎨 UI/UX 特点

- **简洁现代**：卡片式设计，留白充足
- **流畅动画**：旋转、缩放、淡入淡出
- **即时反馈**：输入实时计算，无需确认
- **大号字体**：金额数字大而清晰
- **国旗图标**：使用 Emoji 国旗，无需额外资源

## 📊 数据流说明

```
用户输入
    ↓
数字键盘 (number-keyboard)
    ↓
更新当前币种金额 (updateAmount)
    ↓
计算其他币种 (calculateOtherCurrencies)
    ↓  使用 big.js
转换汇率 (convertCurrency)
    ↓  基于 USD 基准
格式化显示 (formatAmount)
    ↓
更新UI (currency-input)
```

## 🔌 API 说明

### 汇率 API

**主数据源**：https://open.er-api.com/v6/latest/USD

**响应格式**：
```json
{
  "result": "success",
  "base_code": "USD",
  "rates": {
    "CNY": 7.25,
    "EUR": 0.93,
    "JPY": 149.85,
    ...
  }
}
```

## 🎯 当前进度

### ✅ 已完成（阶段 1-3）

- [x] 项目基础架构搭建
- [x] 组件开发（数字键盘、币种卡片）
- [x] 状态管理（Pinia）
- [x] 工具函数（计算、格式化）
- [x] 主页界面和核心功能
- [x] 币种选择页面
- [x] 设置页面
- [x] 汇率 API 集成
- [x] 多语言支持
- [x] 主题切换

### 🚧 待完成（后续阶段）

- [ ] TabBar 图标设计
- [ ] 应用图标和启动页
- [ ] iOS 适配和优化
- [ ] 性能优化
- [ ] 单元测试
- [ ] 打包发布

## ⚠️ 注意事项

### TabBar 图标

当前 `pages.json` 中配置了 TabBar，但图标文件还未添加。需要准备以下图标：

```
static/tabbar/
├── home.png           (80x80px)
├── home-active.png    (80x80px)
├── settings.png       (80x80px)
└── settings-active.png (80x80px)
```

临时方案：可以先注释掉 `pages.json` 中的 `tabBar` 配置。

### 汇率数据

默认使用 USD 作为基准货币。如需修改：
1. 修改 `api/exchange.js` 中的 API 地址
2. 更新 `data/default-rates.js` 中的基准货币

### 精度问题

所有金额计算必须使用 `big.js`，示例：

```javascript
import Big from 'big.js'

// ✅ 正确
const result = new Big(amount1).plus(amount2)

// ❌ 错误
const result = amount1 + amount2
```

## 📝 开发建议

### 调试

1. 使用 HBuilderX 的控制台查看日志
2. 在关键函数添加 `console.log`
3. 使用浏览器开发者工具调试 H5 版本

### 添加新币种

编辑 `data/currencies.js`：

```javascript
{
  code: 'XXX',           // 币种代码
  symbol: '$',           // 货币符号
  name: '货币名称',       // 中文名称
  nameEn: 'Currency',    // 英文名称
  flag: '🏳️',           // 国旗 Emoji
  popular: false         // 是否常用
}
```

### 添加新语言

1. 创建 `locale/xx-XX.js` 语言包
2. 在 `utils/i18n.js` 中注册
3. 在设置页面添加选项

## 📄 许可证

MIT License

## 👨‍💻 作者

开发者：Your Name

---

**更新时间**：2025-10-20  
**版本**：1.0.0  
**状态**：开发中 🚧

