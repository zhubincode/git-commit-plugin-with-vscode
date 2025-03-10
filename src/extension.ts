import * as vscode from "vscode";
import { spawn } from 'child_process';
/**
 * 提交模板接口定义
 * @property label - 显示在选择列表中的文本
 * @property value - 选择后填充到提交信息输入框中的文本
 */
interface CommitTemplate {
  label: string;
  value: string;
}
export function runGitCommand(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const gitProcess = spawn('git', args, { cwd: vscode.workspace.rootPath });
    let output = '';
    gitProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    gitProcess.stderr.on('data', (data) => {
      output += data.toString();

    });

    gitProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(`Git 进程退出，代码: ${code},${output}`);
      }
    });
  });
}
/**
 * 扩展激活时调用的函数
 * @param context - 扩展上下文，用于注册命令和事件
 */
export function activate(context: vscode.ExtensionContext) {
  // 在控制台输出扩展激活信息
  console.log("Git Commit Template Helper is now active!");
  let disposable2 = vscode.commands.registerCommand('git-commit-template-helper.gitPush', async (arg1, arg2) => {

    const config = vscode.workspace.getConfiguration(
      "git-commit-template-helper"
    );
    const commitTemplates: CommitTemplate[] =
      config.get("commitTemplates") || [];
    if (commitTemplates.length === 0) {
      vscode.window.showWarningMessage("没有配置提交模板。");
      return;
    }

    // 显示快速选择菜单，列出所有提交模板

    const selected = await vscode.window.showQuickPick(
      commitTemplates.map((template) => ({
        label: template.label,
        description: template.value,
        template,
      })),
      {
        placeHolder: "选择一个提交模板",
      }
    );
    const value = await vscode.window.showInputBox()

    if (!value) {
      vscode.window.showInformationMessage('请输入message')
    }
    // const status = await runGitCommand(['add', '.'])

    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (!gitExtension) {
      vscode.window.showErrorMessage("未找到Git扩展");
      return;
    }

    // 如果Git扩展未激活，则激活它
    if (!gitExtension.isActive) {

      await gitExtension.activate();
    }
    const git = gitExtension.exports.getAPI(1);
    if (!git) {
      vscode.window.showErrorMessage("未找到Git API");
      return;
    }
    // 获取Git仓库列表
    const repositories = git.repositories;


    if (!repositories.length) {
      vscode.window.showErrorMessage("未找到Git仓库");
      return;
    }
    const branch = repositories[0].state.HEAD?.name
    try {
      await runGitCommand(['add', '.'])
      await runGitCommand(['commit', '-m', `${selected?.template.value || ''}${value}`])
      await runGitCommand(['push', 'origin', branch])
      vscode.window.showInformationMessage(`push success:\n`)
    } catch (error) {
      vscode.window.showInformationMessage(`run git error:\n${error}`)
    }


  });

  // context.subscriptions.push(disposable);
  // 注册显示提交模板的命令
  const disposable = vscode.commands.registerCommand(
    "git-commit-template-helper.showCommitTemplates",
    async () => {
      // 从配置中获取提交模板
      const config = vscode.workspace.getConfiguration(
        "git-commit-template-helper"
      );
      const commitTemplates: CommitTemplate[] =
        config.get("commitTemplates") || [];

      // 如果没有配置提交模板，显示警告信息并返回
      if (commitTemplates.length === 0) {
        vscode.window.showWarningMessage("没有配置提交模板。");
        return;
      }

      // 显示快速选择菜单，列出所有提交模板
      const selected = await vscode.window.showQuickPick(
        commitTemplates.map((template) => ({
          label: template.label,
          description: template.value,
          template,
        })),
        {
          placeHolder: "选择一个提交模板",
        }
      );

      // 如果用户没有选择任何模板，直接返回
      if (!selected) {
        return;
      }

      // 获取Git扩展
      const gitExtension = vscode.extensions.getExtension("vscode.git");
      if (!gitExtension) {
        vscode.window.showErrorMessage("未找到Git扩展");
        return;
      }

      // 如果Git扩展未激活，则激活它
      if (!gitExtension.isActive) {

        await gitExtension.activate();
      }

      // 获取Git API
      const git = gitExtension.exports.getAPI(1);
      if (!git) {
        vscode.window.showErrorMessage("未找到Git API");
        return;
      }
      // 获取Git仓库列表
      const repositories = git.repositories;
      if (!repositories.length) {
        vscode.window.showErrorMessage("未找到Git仓库");
        return;
      }

      // 使用第一个仓库（最常见的情况）
      const repository = repositories[0];

      // 将选择的模板填充到提交信息输入框中
      repository.inputBox.value = selected.template.value;
    }
  );

  // 将命令添加到扩展上下文的订阅中，以便在扩展停用时自动释放资源
  context.subscriptions.push(disposable);
  context.subscriptions.push(disposable2)
}

/**
 * 扩展停用时调用的函数
 * 目前没有需要清理的资源，所以函数体为空
 */
export function deactivate() { }
