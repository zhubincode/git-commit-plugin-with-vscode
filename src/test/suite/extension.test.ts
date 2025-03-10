import * as assert from "assert";
import * as vscode from "vscode";

/**
 * 扩展测试套件
 */
suite("扩展测试套件", () => {
  // 在所有测试之前执行
  suiteSetup(async () => {
    // 等待扩展激活
    await vscode.extensions.getExtension("user.git-commit-plugin")?.activate();
  });

  // 测试扩展是否已安装
  test("扩展应该已安装", () => {
    const extension = vscode.extensions.getExtension("user.git-commit-plugin");
    assert.ok(extension, "扩展未安装");
  });

  // 测试命令是否已注册
  test("命令应该已注册", async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(
      commands.includes("git-commit-plugin.showCommitTemplates"),
      "命令未注册"
    );
  });
});
