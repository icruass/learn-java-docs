// 一键生成全部 section 的路由文件。
// 手动执行：node src/routes/scripts/index.mjs
//
// 实质是依次执行同目录下各 section 的入口脚本（导入即触发生成）。
// 新增 section 时，在此追加一行 import "./<section>.mjs" 即可。
import "./java.mjs";
import "./mysql.mjs";
import "./MyBatis.mjs";
import "./SpringBoot.mjs";

console.log("✓ 全部路由文件已生成。");
