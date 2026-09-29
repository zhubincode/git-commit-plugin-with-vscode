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
  /** 仓库根目录，用于匹配源代码管理入口。 */
  rootUri: vscode.Uri;
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

/** 模板命令接收的仓库或源代码管理上下文。 */
interface RepositoryContext {
  /** 直接传入的仓库根目录。 */
  rootUri?: vscode.Uri;
  /** 仓库对象携带的源代码管理入口。 */
  sourceControl?: {
    /** 源代码管理入口对应的仓库根目录。 */
    rootUri?: vscode.Uri;
  };
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

/** 优先匹配命令入口的仓库；多仓库且无上下文时由用户选择。 */
async function getTargetRepository(
  context?: RepositoryContext | vscode.Uri
): Promise<GitRepository | undefined> {
  const git = await getGitApi();
  if (!git) {
    vscode.window.showErrorMessage("未找到 Git API，请确认已启用内置 Git 扩展。");
    return;
  }

  const repositories = git.repositories;
  if (!repositories.length) {
    vscode.window.showErrorMessage("未找到Git仓库");
    return;
  }

  /** 从仓库、源代码管理对象或直接传入的 URI 中获取目标路径。 */
  const uri = context instanceof vscode.Uri
    ? context
    : context?.rootUri ?? context?.sourceControl?.rootUri;
  if (uri) {
    const repository = repositories.find(
      (item) => item.rootUri.toString() === uri.toString()
    );
    if (repository) {
      return repository;
    }
    vscode.window.showWarningMessage("未找到指定的 Git 仓库，请重新选择仓库。");
    return;
  }

  if (repositories.length === 1) {
    return repositories[0];
  }

  const selected = await vscode.window.showQuickPick(
    repositories.map((repository) => ({
      label: repository.rootUri.fsPath.replace(/[\\/]+$/, "").split(/[\\/]/).pop()
        || 
