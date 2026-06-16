// 扫描所有 src/pages/<大类>/练习题/ 下的 NN-*.ts 分类文件，为每个大类生成 index.generated.ts。
// 手动执行：node src/routes/scripts/exercises.mjs
//
// 每个大类（java、mysql…）在自己的 练习题/ 目录下生成一份 index.generated.ts（导出 categories），
// 供「专门练习页」与「章节底部内嵌」引用。新增分类文件或新增大类后重跑本脚本即可。
// 若某大类的 练习题/ 目录缺少 types.ts，会自动补一个指向 @/components/exercise/types 的垫片。
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGES = resolve(__dirname, "../../pages"); // src/pages

// 找出所有含「练习题」子目录的大类（java、mysql…）
const techs = readdirSync(PAGES, { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(PAGES, e.name, "练习题")))
  .map((e) => e.name)
  .sort();

let totalCats = 0;
for (const tech of techs) {
  const dir = join(PAGES, tech, "练习题");

  // 缺 types.ts 时自动补垫片，保证各分类文件的 "./types" 引用可用
  const typesPath = join(dir, "types.ts");
  if (!existsSync(typesPath)) {
    writeFileSync(
      typesPath,
      `// 兼容垫片：练习题数据模型见 @/components/exercise/types。\nexport * from "@/components/exercise/types";\n`,
      "utf8",
    );
  }

  const files = readdirSync(dir)
    .filter((f) => /^\d+-.+\.ts$/.test(f))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  const importLines = files
    .map((f, i) => `import c${i} from "./${f.replace(/\.ts$/, "")}";`)
    .join("\n");
  const arrItems = files.map((_, i) => `c${i}`).join(", ");

  const out =
    `// ⚠️ 此文件由脚本自动生成，请勿手动修改。\n` +
    `// 数据源：src/pages/${tech}/练习题/ 下的 NN-*.ts 分类文件\n` +
    `// 重新生成：node src/routes/scripts/exercises.mjs\n\n` +
    `import type { ExerciseCategory } from "./types";\n` +
    `${importLines}\n\n` +
    `export const categories: ExerciseCategory[] = [${arrItems}];\n`;

  writeFileSync(join(dir, "index.generated.ts"), out, "utf8");
  totalCats += files.length;
  console.log(`✓ ${tech}/练习题/index.generated.ts —— ${files.length} 个分类`);
}

console.log(`✓ 练习题清单生成完成：${techs.length} 个大类、${totalCats} 个分类。`);
