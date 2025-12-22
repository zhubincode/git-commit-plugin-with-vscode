# 网站

https://marketplace.visualstudio.com/manage/publishers/zhubin?spm=2b75ac3d.2ef5001f.0.0.7f51c921zE4kiq

# 更新个人访问令牌 (PAT) 指南

本文档详细说明了如何更新 VS Code 扩展发布所需的个人访问令牌(PAT)。

## 什么是 PAT？

Personal Access Token (PAT) 是用于身份验证的安全令牌，它允许你在不使用密码的情况下发布扩展到 VS Code Marketplace。

## 何时需要更新 PAT？

当你看到以下错误信息时，表明你的 PAT 已经过期：

```
ERROR  {"message":"Access Denied: The Personal Access Token used has expired.","typeKey":"AccessCheckException"}
You're using an expired Personal Access Token, please get a new PAT.
```

## 更新 PAT 的详细步骤

### 1. 访问 Azure DevOps

打开浏览器，访问 [Azure DevOps](https://dev.azure.com/)

### 2. 登录你的账号

使用关联到你的 VS Code 发布者账户的 Microsoft 账号登录。

### 3. 进入个人访问令牌页面

1. 点击右上角的用户头像图标
2. 在下拉菜单中选择 **Personal access tokens**

### 4. 查看现有 Token 状态

在此页面，你可以看到所有之前创建的 PAT，过期的 PAT 会有明确标识。

### 5. 创建新的 PAT

1. 点击页面顶部的 **+ New Token** 按钮
2. 填写以下信息：

   - **Name**: 为你的 PAT 起一个描述性的名称，如 "VS Code Extension Publishing 2024"
   - **Organization**: 选择 "All accessible organizations" 或特定组织
   - **Expiration**: 选择过期时间（建议设置为 1 年以减少更新频率）
   - **Scopes**: 选择 "Custom defined"，然后展开 **Marketplace** 部分，勾选 **Manage**

3. 点击页面底部的 **Create** 按钮

### 6. 保存你的新 PAT

创建后，系统会显示你的 PAT 一次（之后就无法再查看）。立即复制并安全地保存这个令牌。

## 使用新 PAT 发布扩展

### 方法 1: 使用 PAT 登录

```bash
vsce login <你的发布者名称> -p <你的新PAT>
vsce publish
```

### 方法 2: 直接使用 PAT 发布

```bash
vsce publish -p <你的新PAT>
```

或指定版本发布：

```bash
vsce publish [version] -p <你的新PAT>
```

## 安全提示

1. **不要在公共场合分享你的 PAT**，它等同于你的密码
2. 不使用时及时撤销旧的 PAT
3. 为 PAT 设置合理的过期时间
4. 考虑使用密码管理器安全地存储你的 PAT
