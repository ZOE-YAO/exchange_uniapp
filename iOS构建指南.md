# 📱 iOS App 构建指南

## 问题修复

### 原问题
```
Invalid value "iife" for option "output.format" - UMD and IIFE output formats are not supported for code-splitting builds.
```

### 原因分析
- UniApp在构建App平台时，默认会尝试使用`iife`格式输出
- 但Vite的代码分割功能与`iife`格式不兼容
- 需要在`vite.config.js`中配置正确的构建选项

### 解决方案 ✅

已更新 `vite.config.js`：

```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: undefined,  // 禁用手动分块
    }
  },
  minify: 'terser',            // 使用terser压缩
  cssCodeSplit: false,         // 禁用CSS代码分割
}
```

---

## 📋 iOS App 构建步骤

### 方式一：使用 HBuilderX（推荐）

1. **打开项目**
   - 启动 HBuilderX
   - 文件 → 打开目录 → 选择项目文件夹

2. **配置 App 信息**
   - 打开 `manifest.json`
   - 配置 App 基础信息：
     - App名称
     - App ID
     - 版本号
     - 图标和启动图

3. **配置 iOS 信息**
   ```json
   "app-plus": {
     "distribute": {
       "ios": {
         "dSYMs": false,
         "privacyDescription": {
           "NSPhotoLibraryUsageDescription": "用于保存汇率图片",
           "NSPhotoLibraryAddUsageDescription": "用于保存汇率图片"
         }
       }
     }
   }
   ```

4. **云打包**
   - 运行 → 发行 → 原生App-云打包
   - 选择 iOS
   - 填写证书信息
   - 等待打包完成

5. **本地打包（需要Mac）**
   - 运行 → 发行 → 原生App-本地打包
   - 选择 iOS
   - 等待生成 Xcode 项目
   - 使用 Xcode 打开项目
   - 配置签名和证书
   - 构建并运行

---

### 方式二：命令行构建

#### 1. 安装依赖
```bash
npm install
```

#### 2. 构建 App 资源
```bash
# 构建生产环境
npm run build:app-plus

# 或构建开发环境
npm run dev:app-plus
```

#### 3. 使用 HBuilderX 打开生成的项目
- 打开 HBuilderX
- 导入 `unpackage/dist/dev/app-plus` 或 `unpackage/dist/build/app-plus`
- 按照方式一的步骤进行打包

---

## 📝 manifest.json 配置清单

### 必填项

```json
{
  "name": "汇率速算",
  "appid": "__UNI__XXXXXX",  // 需要在DCloud注册获取
  "description": "多币种汇率实时换算工具",
  "versionName": "1.0.0",
  "versionCode": "100",
  
  "app-plus": {
    "usingComponents": true,
    "nvueStyleCompiler": "uni-app",
    "compilerVersion": 3,
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "waiting": true,
      "autoclose": true,
      "delay": 0
    },
    "modules": {},
    "distribute": {
      "android": {
        "permissions": [
          "<uses-permission android:name=\"android.permission.INTERNET\"/>"
        ]
      },
      "ios": {
        "dSYMs": false
      },
      "sdkConfigs": {}
    }
  }
}
```

---

## 🔧 常见问题

### 1. App ID 未配置

**错误**：`应用标识 appid 不能为空`

**解决**：
- 访问 https://dev.dcloud.net.cn/
- 注册/登录账号
- 创建应用获取 appid
- 在 `manifest.json` 中填入

---

### 2. 构建失败：模块未找到

**错误**：`Cannot find module 'xxx'`

**解决**：
```bash
# 清除缓存
rm -rf node_modules
rm package-lock.json

# 重新安装
npm install

# 重新构建
npm run build:app-plus
```

---

### 3. iOS 打包需要证书

**解决**：
- **开发证书**：用于真机测试
  - 需要 Apple Developer 账号
  - 在 Xcode 中配置开发证书
  
- **发布证书**：用于上架 App Store
  - 需要付费的 Apple Developer 账号
  - 创建发布证书和描述文件

---

### 4. 第三方库兼容性问题

**某些库可能不支持App平台**：

- `big.js` ✅ 支持
- `dayjs` ✅ 支持
- `pinia` ✅ 支持
- DOM操作相关的库 ❌ 不支持

**如遇到不兼容**：
- 使用条件编译 `#ifdef APP-PLUS`
- 提供平台特定的实现

---

## 🎯 构建检查清单

构建前请确认：

- [ ] `vite.config.js` 已正确配置
- [ ] `manifest.json` 中的 appid 已填写
- [ ] App名称、版本号已设置
- [ ] 图标和启动图已准备（可选）
- [ ] 已安装所有依赖 `npm install`
- [ ] 代码中无H5特定API（或已用条件编译处理）
- [ ] 已测试核心功能在App端可用

---

## 📱 测试步骤

### 1. 真机调试（需要Mac）

```bash
# HBuilderX 中
运行 → 运行到手机或模拟器 → iOS设备
```

### 2. 模拟器测试

- 使用 HBuilderX 内置的iOS模拟器
- 或使用 Xcode 的 iOS Simulator

### 3. 功能测试

- [ ] 启动正常
- [ ] 汇率数据能正常获取
- [ ] 货币换算功能正常
- [ ] 键盘输入正常
- [ ] 下拉刷新正常
- [ ] 基准货币切换正常
- [ ] 数据持久化正常

---

## 🚀 发布到 App Store

### 准备工作

1. **Apple Developer 账号**
   - 个人/公司账号：$99/年
   - 注册地址：https://developer.apple.com/

2. **应用信息**
   - App名称
   - 描述
   - 关键词
   - 截图（多种尺寸）
   - 隐私政策链接

3. **构建和上传**
   - 使用 Xcode Archive
   - 验证并上传到 App Store Connect
   - 提交审核

---

## 📞 获取帮助

- **UniApp官方文档**：https://uniapp.dcloud.net.cn/
- **HBuilderX下载**：https://www.dcloud.io/hbuilderx.html
- **iOS开发文档**：https://developer.apple.com/documentation/

---

## 🎉 下一步

修复完成后：

1. **重新构建**
   ```bash
   npm run build:app-plus
   ```

2. **使用 HBuilderX 打包**
   - 打开 HBuilderX
   - 导入项目
   - 发行 → 原生App云打包 → iOS

3. **等待构建完成**
   - 下载 ipa 文件
   - 使用 Xcode 或 Transporter 上传

---

**祝你构建成功！** 🎉

