import * as path from "path";
import * as cp from "child_process";
import { runTests } from "vscode-test";

/**
 * 测试入口函数
 * 用于启动VSCode实例并运行扩展测试
 */
async function main() {
  try {
    // 扩展根目录
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // 测试文件所在目录
    const extensionTestsPath = path.resolve(__dirname, "./suite/index");

    // 启动VSCode并运行测试
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
    });
  } catch (err) {
    // 输出错误信息
    console.error("测试运行失败:", err);
    process.exit(1);
  }
}

// 执行测试
main();
