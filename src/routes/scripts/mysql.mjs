// 生成 src/routes/mysql.ts（完全覆盖）。
// 手动执行：node src/routes/scripts/mysql.mjs
import { generateSection } from "./gen-routes.mjs";

generateSection({ dir: "mysql", name: "MySQL", icon: "🐬" });
