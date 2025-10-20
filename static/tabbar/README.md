# TabBar 图标说明

此文件夹用于存放底部导航栏图标。

## 需要的图标

请准备以下图标文件（建议尺寸 80x80px）：

### 1. 汇率页图标
- `home.png` - 未选中状态
- `home-active.png` - 选中状态

### 2. 设置页图标
- `settings.png` - 未选中状态
- `settings-active.png` - 选中状态

## 设计规范

- **尺寸**：80x80px（@1x）、160x160px（@2x）、240x240px（@3x）
- **格式**：PNG（支持透明背景）
- **颜色**：
  - 未选中：#999999（灰色）
  - 选中：#007AFF（主题蓝）
- **风格**：简洁、线性、现代

## 临时方案

如果暂时没有图标，可以：

1. 在 `pages.json` 中注释掉 `tabBar` 配置
2. 或使用在线图标生成工具创建临时图标

## 推荐工具

- [IconFont](https://www.iconfont.cn/) - 阿里图标库
- [Figma](https://www.figma.com/) - 设计工具
- [Canva](https://www.canva.com/) - 在线设计

