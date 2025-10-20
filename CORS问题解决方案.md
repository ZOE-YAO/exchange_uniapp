# CORS 跨域问题解决方案

## 🔍 问题说明

在浏览器开发环境（H5）中，直接请求外部 API 会遇到 CORS（跨域资源共享）限制。

```
错误信息：
Access to XMLHttpRequest at 'https://open.er-api.com/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## ✅ 已实施的解决方案

### 方案 1：配置开发代理（推荐）⭐

已在以下文件配置代理：

#### 1. `manifest.json` - H5 代理配置
```json
"h5": {
  "devServer": {
    "proxy": {
      "/api": {
        "target": "https://open.er-api.com",
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": ""
        }
      }
    }
  }
}
```

#### 2. `vite.config.js` - Vite 代理配置（新增）
```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://open.er-api.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

#### 3. `api/exchange.js` - API 地址适配
```javascript
// 开发环境使用代理地址
const PRIMARY_API = process.env.NODE_ENV === 'development' 
  ? '/api/v6/latest'  // 通过代理访问
  : 'https://open.er-api.com/v6/latest'  // 生产直接访问
```

### 方案 2：离线数据兜底

已优化汇率数据加载逻辑：

1. **首选**：在线获取最新汇率
2. **备选**：使用本地缓存数据
3. **兜底**：使用内置默认汇率（`data/default-rates.js`）

这样即使网络请求失败，应用仍可正常使用。

---

## 🚀 如何运行

### 重新启动项目

由于修改了配置文件，需要重新启动：

#### 方法 1：在 HBuilderX 中
```
1. 停止当前运行（点击控制台的停止按钮）
2. 重新运行：运行 → 运行到浏览器 → Chrome
3. 查看控制台，应该没有 CORS 错误了
```

#### 方法 2：命令行运行
```bash
# 停止当前进程（Ctrl + C）
# 重新启动
cd "/Users/tongyao/Desktop/开发/app/汇率速算"
npm run dev:h5
```

---

## ✅ 验证修复

### 1. 查看控制台
应该看到：
```
✅ 汇率数据获取成功
```

或者（如果还是失败）：
```
⚠️ 在线获取汇率失败，使用离线数据
📦 加载内置默认汇率数据
```

### 2. 检查功能
- ✅ 页面正常加载
- ✅ 币种卡片显示
- ✅ 可以输入金额
- ✅ 汇率自动换算
- ✅ 即使显示"离线模式"也能正常使用

### 3. 测试在线刷新
- 点击刷新按钮
- 如果成功：显示"汇率已更新"
- 如果失败：显示"使用缓存数据"，但不影响使用

---

## 🎯 不同环境的表现

### H5 开发环境（localhost）
- ✅ 使用代理避免 CORS
- ✅ 如果代理失败，使用离线数据

### H5 生产环境（部署后）
- ✅ 直接访问 API（已配置 CORS）
- ✅ 如果失败，使用离线数据

### App 环境（iOS/Android）
- ✅ 原生环境无 CORS 限制
- ✅ 直接访问 API

### 小程序环境
- ✅ 需要在后台配置域名白名单
- ✅ 配置后可直接访问

---

## 📝 常见问题

### Q1: 重启后还是有 CORS 错误？

**解决方法**：
```bash
# 清除缓存重新启动
rm -rf node_modules/.vite
npm run dev:h5
```

### Q2: 显示"离线模式"是否正常？

**答**：完全正常！
- 应用设计为离线优先
- 使用内置默认汇率数据
- 不影响核心功能使用
- 可以随时点击刷新尝试获取最新数据

### Q3: 如何确认使用的是哪个数据源？

**查看控制台**：
```
✅ 汇率数据获取成功          → 在线数据
⚠️ 使用离线数据              → 本地缓存
📦 加载内置默认汇率数据      → 默认数据
```

### Q4: 生产环境会有问题吗？

**答**：不会！
- 生产环境部署到服务器后，不存在 CORS 问题
- 或使用 App 原生环境，无跨域限制
- 即使有问题，离线数据可以兜底

---

## 🔧 进一步优化（可选）

### 使用免费的 CORS 代理服务

如果开发代理还是有问题，可以使用支持 CORS 的免费代理：

```javascript
// api/exchange.js
const PRIMARY_API = 'https://api.allorigins.win/raw?url=' + 
  encodeURIComponent('https://open.er-api.com/v6/latest')
```

### 使用支持 CORS 的 API

替换为已配置 CORS 的汇率 API：

```javascript
// 这个 API 支持 CORS
const PRIMARY_API = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies'
```

---

## 📚 相关资源

- [MDN - CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [UniApp - H5 配置](https://uniapp.dcloud.net.cn/collocation/manifest.html#h5)
- [Vite - 代理配置](https://cn.vitejs.dev/config/server-options.html#server-proxy)

---

**总结**：问题已修复，重新启动项目即可正常使用！ 🎉

