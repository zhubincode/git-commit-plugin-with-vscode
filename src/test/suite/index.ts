import * as path from "path";
import Mocha from "mocha";
import glob from "glob";

/**
 * 运行测试套件的函数
 * 查找并运行所有测试文件
 */
export function run(): Promise<void> {
  // 创建Mocha测试实例
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
  });

  // 测试文件所在目录
  const testsRoot = path.resolve(__dirname, "..");

  return new Promise((resolve, reject) => {
    // 查找所有测试文件
    glob(
      "**/**.test.js",
      { cwd: testsRoot },
      (err: Error | null, files: string[]) => {
        if (err) {
          return reject(err);
        }

        // 将所有测试文件添加到Mocha实例中
        files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

        try {
          // 运行测试
          mocha.run((failures: number) => {
            if (failures > 0) {
              reject(new Error(`${failures} 个测试失败`));
            } else {
              resolve();
            }
          });
        } catch (err) {
          console.error(err);
          reject(err);
        }
      }
    );
  });
}
