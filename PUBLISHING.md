# 发布指南 - Git Commit Template Helper

本文档提供了如何生成 VSIX 文件并发布扩展的详细指南。

## 准备工作

在发布扩展前，请确保你已经安装了所需的工具：

```bash
npm install -g @vscode/vsce
```

## 生成 VSIX 文件

### 1. 更新版本号

在发布新版本前，需要在 `package.json` 文件中更新版本号：

```json
{
  "name": "git-commit-template-helper",
  "displayName": "Git Commit Template Helper",
  "version": "1.0.x",  // 更新这里的版本号
  ...
}
```

### 2. 编译代码

确保你的代码已经编译成功：

```bash
npm run compile
```

### 3. 生成 VSIX 文件

使用以下命令来生成 VSIX 文件：

```bash
vsce package
```

这将在当前目录下生成一个名为 `git-commit-template-helper-1.0.x.vsix` 的文件（其中 1.0.x 是你在 package.json 中设置的版本号）。

## 手动安装扩展

生成 VSIX 文件后，可以通过以下方式手动安装扩展：

1. 打开 VS Code
2. 进入扩展视图（Ctrl+Shift+X）
3. 点击右上角的 "..." 按钮，选择 "从 VSIX 安装..."
4. 选择上一步生成的 VSIX 文件

## 发布到 VS Code Marketplace

### 1. 创建发布者账号

如果你还没有 VS Code Marketplace 的发布者账号，需要先在 [Azure DevOps](https://dev.azure.com/) 创建一个账号。

### 2. 获取 Personal Access Token (PAT)

1. 登录 [Azure DevOps](https://dev.azure.com/)
2. 点击右上角的用户头像，选择 "Personal access tokens"
3. 点击 "New Token"
4. 填写名称，选择组织，将过期时间设置为你想要的时长
5. 在 "Scopes" 部分，选择 "Custom defined"，然后选择 "Marketplace > Manage"
6. 点击 "Create" 生成 token 并保存好它

#### PAT 过期处理

PAT 有有效期限，过期后需要重新生成。如果在发布时遇到以下错误：

```
ERROR  {"message":"Access Denied: The Personal Access Token used has expired.","typeKey":"AccessCheckException"}
You're using an expired Personal Access Token, please get a new PAT.
```

请按照以下步骤处理：

1. 登录 [Azure DevOps](https://dev.azure.com/)
2. 点击右上角的用户头像，选择 "Personal access tokens"
3. 查看现有 Token 的状态 - 过期的 Token 会标记为"Expired"
4. 点击 "New Token" 创建一个新的 PAT
5. 使用新的 PAT 进行发布（参考下面的发布命令）

> **提示**: 创建 PAT 时，可以设置较长的过期时间（最长可设置为 1 年）以减少更新频率

### 3. 登录并发布

```bash
# 登录到你的发布者账号
vsce login <你的发布者名称>

# 发布扩展
vsce publish
```

或者，你也可以直接使用 PAT 发布：

```bash
vsce publish -p <你的PAT>
```

### 4. 指定版本发布

你可以在发布时指定版本：

```bash
vsce publish [version]  # 例如: vsce publish 1.0.1
```

或使用语义化版本增量：

```bash
vsce publish patch  # 将 1.0.0 更新为 1.0.1
vsce publish minor  # 将 1.0.0 更新为 1.1.0
vsce publish major  # 将 1.0.0 更新为 2.0.0
```

## 版本管理最佳实践

1. **遵循语义化版本**

   - **主版本号 (major)**: 当你做了不兼容的 API 修改
   - **次版本号 (minor)**: 当你添加了向下兼容的新功能
   - **修订号 (patch)**: 当你做了向下兼容的问题修正

2. **保持更新日志**
   在每次发布前，更新 CHANGELOG.md 文件，记录此版本的变更内容。

3. **测试**
   确保在发布前全面测试你的扩展。

4. **备份**
   保留每个版本的 VSIX 文件作为备份，以便需要时可以回滚到之前的版本。

## 注意事项

1. VS Code 的 API 版本兼容性非常重要。确保你的扩展兼容目标用户使用的 VS Code 版本。

2. 尽量保持扩展的体积小，避免包含不必要的文件。可以在 `.vscodeignore` 文件中指定不需要包含在 VSIX 文件中的文件或目录。

3. 确保你的扩展符合 [VS Code 扩展准则](https://code.visualstudio.com/api/references/extension-guidelines)。
