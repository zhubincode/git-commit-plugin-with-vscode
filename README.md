# Git Commit Template Helper

一个简单易用的 VSCode 扩展，帮助您在 Git 提交时使用标准化的提交信息模板。

## 功能特点

- 在源代码管理视图中添加一个按钮，点击后显示提交模板列表
- 支持自定义提交模板，包括 emoji 和提交类型
- 选择模板后自动填充到提交信息输入框中
- 默认提供常用的提交类型模板

## 安装

1. 打开 VSCode
2. 按下`Ctrl+Shift+X`（Windows/Linux）或`Cmd+Shift+X`（macOS）打开扩展视图
3. 搜索"Git Commit Template Helper"
4. 点击"安装"按钮

## 使用方法

1. 在 VSCode 中打开一个 Git 仓库
2. 进行代码修改后，切换到源代码管理视图（Git 图标）
3. 在提交信息输入框旁边，点击"+"图标
4. 从弹出的列表中选择一个提交模板
5. 选择后，模板会自动填充到提交信息输入框中
6. 补充具体的提交信息，然后提交

## 配置选项

### 方式一：通过 VSCode 设置界面

1. 打开 VSCode 设置（文件 > 首选项 > 设置）
2. 搜索"git-commit-template-helper"
3. 编辑"Git 提交模板助手: Commit Templates"设置

### 方式二：直接编辑 settings.json

1. 打开 VSCode 设置（文件 > 首选项 > 设置）
2. 点击右上角的"打开设置(json)"图标
3. 添加或修改以下配置：

```json
{
  "git-commit-template-helper.commitTemplates": [
    {
      "label": "feat: 新增功能",
      "value": "✨feat: "
    },
    {
      "label": "fix: 修复Bug",
      "value": "🐛fix: "
    }
    // 添加更多自定义模板...
  ]
}
```

### 配置项说明

每个提交模板包含两个属性：

- `label`: 显示在选择列表中的文本（不包含 emoji）
- `value`: 选择后填充到提交信息输入框中的文本（包含 emoji）

### 默认提交类型

如果您没有自定义配置，插件将使用以下默认模板：

| 显示文本            | 实际提交格式 | 说明                   |
| ------------------- | ------------ | ---------------------- |
| feat: 新增功能      | ✨feat:      | 新功能开发             |
| fix: 修复 Bug       | 🐛fix:       | Bug 修复               |
| chore: 非功能性更改 | 🚀chore:     | 非功能性更改           |
| docs: 文档更新      | 📚docs:      | 文档更新               |
| style: 样式修改     | 💄style:     | 代码格式调整           |
| refactor: 代码重构  | ♻️refactor:  | 代码重构               |
| test: 添加测试      | ✅test:      | 测试用例               |
| ui: 界面样式调整    | 🎨ui:        | UI 相关更改            |
| build: 构建相关     | 🔧build:     | 构建系统或外部依赖更改 |
| ci: CI 配置更改     | 🔨ci:        | CI 配置更改            |
| perf: 性能优化      | ⚡️perf:     | 性能优化               |
| revert: 回退更改    | ⏪️revert:   | 回退之前的提交         |

### 自定义配置示例

以下是一个自定义配置的完整示例：

```json
{
  "git-commit-template-helper.commitTemplates": [
    {
      "label": "feat: 新增功能",
      "value": "✨feat: "
    },
    {
      "label": "fix: 修复Bug",
      "value": "🐛fix: "
    },
    {
      "label": "docs: 文档更新",
      "value": "📚docs: "
    },
    {
      "label": "style: 样式修改",
      "value": "💄style: "
    },
    {
      "label": "refactor: 代码重构",
      "value": "♻️refactor: "
    },
    {
      "label": "test: 添加测试",
      "value": "✅test: "
    },
    {
      "label": "chore: 其他更改",
      "value": "🚀chore: "
    }
  ]
}
```

## 开发指南

如果您想要修改或扩展此插件，可以按照以下步骤进行：

1. 克隆仓库

   ```bash
   git clone https://github.com/yourusername/git-commit-template-helper.git
   cd git-commit-template-helper
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
