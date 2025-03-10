# Git Commit Plugin with VSCode

一个简单易用的 VSCode 扩展，帮助您在 Git 提交时使用标准化的提交信息模板。

## 功能特点

- 在源代码管理视图中添加一个按钮，点击后显示提交模板列表
- 支持自定义提交模板，包括 emoji 和提交类型
- 选择模板后自动填充到提交信息输入框中
- 默认提供常用的提交类型模板（feat, fix, docs 等）

## 安装

1. 打开 VSCode
2. 按下`Ctrl+Shift+X`（Windows/Linux）或`Cmd+Shift+X`（macOS）打开扩展视图
3. 搜索"git-commit-plugin with vscode"
4. 点击"安装"按钮

## 使用方法

1. 在 VSCode 中打开一个 Git 仓库
2. 进行代码修改后，切换到源代码管理视图（Git 图标）
3. 在提交信息输入框旁边，点击"+"图标
4. 从弹出的列表中选择一个提交模板
5. 选择后，模板会自动填充到提交信息输入框中
6. 补充具体的提交信息，然后提交

## 配置选项

您可以通过 VSCode 设置自定义提交模板：

1. 打开 VSCode 设置（文件 > 首选项 > 设置）
2. 搜索"git-commit-plugin"
3. 编辑"Git 提交插件: Commit Templates"设置

默认提供的模板包括：

- ✨ feat: 新功能
- 🐛 fix: 修复 bug
- 📚 docs: 文档更新
- 💄 style: 代码风格修改（不影响代码运行的变动）
- ♻️ refactor: 代码重构（既不是新增功能，也不是修改 bug 的代码变动）
- ✅ test: 测试相关
- 🚀 chore: 构建过程或辅助工具的变动
- ⏪️ revert: 回退之前的提交

您可以根据自己的需求添加、修改或删除这些模板。每个模板包含两个属性：

- `label`: 显示在选择列表中的文本
- `value`: 选择后填充到提交信息输入框中的文本

配置示例：

```json
"git-commit-plugin.commitTemplates": [
  {
    "label": "✨ feat",
    "value": "✨ feat: "
  },
  {
    "label": "🐛 fix",
    "value": "🐛 fix: "
  },
  // 添加您自己的自定义模板
  {
    "label": "🔒 security",
    "value": "🔒 security: "
  }
]
```

## 开发指南

如果您想要修改或扩展此插件，可以按照以下步骤进行：

1. 克隆仓库

   ```bash
   git clone https://github.com/yourusername/git-commit-plugin.git
   cd git-commit-plugin
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 打开 VSCode

   ```bash
   code .
   ```

4. 按 F5 启动调试

5. 在新打开的 VSCode 窗口中测试插件

## 贡献

欢迎提交问题和功能请求！如果您想贡献代码，请随时提交 Pull Request。

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件。
