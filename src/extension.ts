import * as vscode from "vscode";
import { spawn } from 'child_process';

const GIT_EXTENSION_ID = 'vscode.git'
const GIT_EXTENSION_RETRY_TIMES = 5
const GIT_EXTENSION_RETRY_DELAY = 150
/**
 * 提交模板接口定义
 * @property label - 显示在选择列表中的文本
 * @property value - 选择后填充到提交信息输入框中的文本
 */
interface CommitTemplate {
  label: string;
  value: string;
}

/**
 * Git 仓库最小接口定义，只保留当前插件会访问的字段。
 */
interface GitRepository {
  inputBox: {
    value: string;
  };
  state: {
    HEAD?: {
      name?: string;
    };
  };
}

/**
 * Git API 最小接口定义，避免依赖宿主环境内部实现细节。
 */
interface GitApi {
  repositories: GitRepository[];
}

/**
 * Git 扩展导出接口定义。
 */
interface GitExtensionExports {
  getAPI(version: 1): GitApi;
}

function getWorkspaceRootPath(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? vscode.workspace.rootPath;
}

export function runGitCommand(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const cwd = getWorkspaceRootPath()
    if (!cwd) {
      reject('未找到工作区目录')
      return
    }

    const gitProcess = spawn('git', args, { cwd });
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function findGitExtension(): vscode.Extension<GitExtensionExports> | undefined {
  const extension = vscode.extensions.getExtension<GitExtensionExports>(GIT_EXTENSION_ID)
  if (extension) {
    return extension
  }

  return vscode.extensions.all.find(
    (item): item is vscode.Extension<GitExtensionExports> =>
      item.id === GIT_EXTENSION_ID
      || (item.packageJSON?.name === 'git' && item.packageJSON?.publisher === 'vscode')
  )
}

async function getGitApi(): Promise<GitApi | undefined> {
  let gitExtension: vscode.Extension<GitExtensionExports> | undefined

  for (let i = 0; i < GIT_EXTENSION_RETRY_TIMES; i++) {
    gitExtension = findGitExtension()
    if (gitExtension) {
      break
    }

    await sleep(GIT_EXTENSION_RETRY_DELAY)
  }

  if (!gitExtension) {
    return
  }

  if (!gitExtension.isActive) {
    await gitExtension.activate()
  }

  if (typeof gitExtension.exports?.getAPI !== 'function') {
    return
  }

  return gitExtension.exports.getAPI(1)
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
    if (!selected) {
      return
    }

    const value = await vscode.window.showInputBox()

    if (!value) {
      vscode.window.showInformationMessage('请输入message')
      return
    }
    // const status = await runGitCommand(['add', '.'])

    const git = await getGitApi()
    if (!git) {
      vscode.window.showErrorMessage("未找到 Git API，请确认已启用内置 Git 扩展。");
      return
    }
    // 获取Git仓库列表
    const repositories = git.repositories;


    if (!repositories.length) {
      vscode.window.showErrorMessage("未找到Git仓库");
      return;
    }
    const branch = repositories[0].state.HEAD?.name
    if (!branch) {
      vscode.window.showErrorMessage("未找到当前分支");
      return
    }

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

      // 获取Git API
      const git = await getGitApi()
      if (!git) {
        vscode.window.showErrorMessage("未找到 Git API，请确认已启用内置 Git 扩展。");
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
