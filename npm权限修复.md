# 🔧 npm 权限问题修复

## 问题
```
npm error code EPERM
npm error Your cache folder contains root-owned files
```

## 解决方案（3选1）

### 方案1：修复 npm 缓存权限（推荐）✅

在终端执行：
```bash
sudo chown -R 501:20 "/Users/tongyao/.npm"
```

然后重新安装：
```bash
cd /Users/tongyao/Desktop/开发/app/汇率速算
npm install --legacy-peer-deps
```

---

### 方案2：清理 npm 缓存

```bash
# 清理缓存
npm cache clean --force

# 重新安装
cd /Users/tongyao/Desktop/开发/app/汇率速算
npm install --legacy-peer-deps
```

---

### 方案3：使用不同的缓存目录

```bash
# 临时使用不同的缓存
npm install --legacy-peer-deps --cache /tmp/npm-cache
```

---

## 推荐步骤（按顺序执行）

### 1. 修复权限
```bash
sudo chown -R 501:20 "/Users/tongyao/.npm"
```

### 2. 进入项目目录
```bash
cd /Users/tongyao/Desktop/开发/app/汇率速算
```

### 3. 安装依赖
```bash
npm install --legacy-peer-deps
```

### 4. 验证安装
```bash
npm list --depth=0
```

### 5. 清理构建缓存
```bash
rm -rf unpackage
```

---

## 完整安装脚本

复制以下命令到终端一次执行：

```bash
# 修复权限
sudo chown -R 501:20 "/Users/tongyao/.npm"

# 进入项目
cd /Users/tongyao/Desktop/开发/app/汇率速算

# 安装依赖
npm install --legacy-peer-deps

# 清理缓存
rm -rf unpackage

# 显示成功信息
echo "✅ 依赖安装完成！"
echo "📱 现在可以在 HBuilderX 中运行项目了"
```

---

## 预期结果

成功后会看到：
```
added XX packages in XXs
✅ 依赖安装完成！
📱 现在可以在 HBuilderX 中运行项目了
```

---

## 如果仍然失败

### 检查 npm 配置
```bash
npm config list
```

### 重置 npm
```bash
npm config delete cache
npm config delete prefix
```

### 使用 yarn 或 pnpm
```bash
# 使用 yarn
npm install -g yarn
yarn install

# 或使用 pnpm
npm install -g pnpm
pnpm install
```

---

## 🎯 下一步

安装成功后：

1. **验证依赖**
   ```bash
   npm list @dcloudio/vite-plugin-uni
   ```
   
   应该显示：`@dcloudio/vite-plugin-uni@3.0.0-4020420240930001`

2. **打开 HBuilderX**
   - 完全退出后重新打开
   - 打开项目

3. **运行项目**
   ```
   运行 → 运行到手机或模拟器 → iOS模拟器
   ```

---

**立即在终端执行修复命令！** 🚀

