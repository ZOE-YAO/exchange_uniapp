# Copilot Instructions - 汇率速算应用

## 项目概述
这是一个基于 UniApp + Vue3 + Pinia 的跨平台汇率计算器，支持 H5、App、小程序等多端部署。核心特点是实时汇率换算、离线可用、精确计算。

## 架构理解

### 核心数据流
```
用户输入 → number-keyboard → Pinia Store → big.js 计算 → 实时更新其他币种
```

### 关键设计决策
- **计算精度**: 所有金额计算必须使用 `big.js`，避免浮点数精度问题
- **状态管理**: 使用 Pinia 管理币种选择(`currency.js`)、汇率数据(`rate.js`)、设置(`settings.js`)
- **数据持久化**: 通过 `uni.setStorageSync` 自动保存用户选择和设置
- **离线优先**: 内置默认汇率(`data/default-rates.js`)，API 失败时自动降级

### 汇率数据机制
- **基准货币**: 以 USD 为基准，所有汇率转换通过 USD 中转
- **API 策略**: 主数据源(open.er-api.com) → 备用数据源 → 离线数据
- **CORS 处理**: H5 环境通过 `manifest.json` 代理配置解决跨域

## 开发指南

### 关键文件结构
```
store/currency.js      # 币种选择和金额状态
utils/calculate.js     # 核心计算逻辑(big.js)
data/currencies.js     # 150+ 币种静态数据
api/exchange.js        # 汇率API封装
components/number-keyboard/  # 自定义数字键盘
```

### 计算模式示例
```javascript
// ✅ 正确: 使用 big.js
import Big from 'big.js'
const result = new Big(amount).div(fromRate).times(toRate)

// ❌ 错误: 直接运算会有精度问题
const result = amount * (toRate / fromRate)
```

### 币种数据模式
```javascript
// data/currencies.js 结构
{
  code: 'USD',           // 必须: 币种代码
  symbol: '$',           // 必须: 货币符号
  name: '美元',          // 必须: 中文名称
  nameEn: 'US Dollar',   // 必须: 英文名称
  flag: '🇺🇸',          // 必须: 国旗 Emoji
  popular: true          // 必须: 是否为常用币种
}
```

### 状态管理模式
- 币种选择存储在 `selectedCurrencies` 数组中，按用户添加顺序
- 金额存储在 `amounts` 对象中，键为币种代码
- 自动保存到本地存储，重启后恢复状态

### 环境适配
- H5: 通过代理解决 CORS，使用相对路径 `/api/v6/latest`
- App/小程序: 直接使用完整 URL `https://open.er-api.com/v6/latest`
- 条件编译: `#ifdef H5` / `#ifndef H5`

### 主题系统
- 使用 CSS 变量定义主题 (`theme/variables.scss`)
- 通过 `[theme="dark"]` 选择器切换深色模式
- 所有颜色、间距、圆角都通过变量统一管理

## 调试流程

### 本地开发
```bash
npm install                    # 安装依赖
npm run dev:h5                # H5 开发
npm run dev:app               # App 开发
```

### 常见问题排查
1. **汇率获取失败**: 检查网络连接和 API 响应格式
2. **计算精度异常**: 确认所有计算使用 `big.js`
3. **CORS 错误**: 检查 `manifest.json` 代理配置
4. **存储失败**: 检查 `uni.setStorageSync` 权限

### 测试验证
- 验证离线模式: 断网后检查是否使用默认汇率
- 验证计算精度: 输入长小数位数测试
- 验证多币种联动: 修改一个币种，其他应同步更新

## 扩展指南

### 添加新币种
1. 在 `data/currencies.js` 添加币种信息
2. 确保 API 支持该币种（可在汇率响应中查找）
3. 测试汇率换算功能

### 添加新语言
1. 创建 `locale/xx-XX.js` 语言包
2. 在 `utils/i18n.js` 注册新语言
3. 在设置页面添加语言选项

### 修改汇率数据源
1. 更新 `api/exchange.js` 中的 API 地址
2. 适配响应数据格式
3. 更新 `manifest.json` 代理配置（H5）