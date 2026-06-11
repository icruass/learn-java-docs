// 路由生成引擎：遍历 src/pages/<section> 目录，按目录结构生成 src/routes/<section>.ts。
// 由同目录下的 java.mjs / mysql.mjs 调用（每个 section 一个入口脚本），或由 index.mjs 一键生成全部。
//
// 生成规则（与 src/pages 目录结构保持一致）：
//   一级节点：{ path: "/<section>", name, icon?, routes }
//   分组节点：{ path: "/<section>/NN", name, icon?, routes }       —— 二级目录
//   页面节点：{ path: "/<section>/NN/MM", name, icon?, component } —— 二级目录下的 .tsx
//
//   默认（机械）推导：
//     path      = 取目录/文件名的两位数字前缀拼接
//     name      = 去掉 "NN-" 前缀、把下划线换成空格
//     component = "@/pages/<section>/<原目录名>/<原文件名去掉 .tsx>"
//     icon      = 无（一级节点可由入口脚本传入默认 icon）
//
//   自定义覆盖（可选）：每个节点都能导出一个 `route` 对象来覆盖上述默认值——
//     · 文件（页面）：读取该 .tsx 文件自身的 `export const route = {...}`
//     · 文件夹（section / 分组）：读取其内部 index.(tsx|ts|jsx|js) 的 `export const route = {...}`
//     route 里的字段（path / name / icon / … 均可选）优先生效；缺省则用默认值。
//     注意：path 覆盖是按节点独立生效的，不会向子节点级联。
import { readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGES_ROOT = resolve(__dirname, "../../pages"); // src/pages
const ROUTES_ROOT = resolve(__dirname, ".."); // src/routes

/** 取 "NN-xxx" 开头的数字序号；不符合规则返回 null（即被忽略） */
const prefixOf = (raw) => {
  const m = /^(\d+)-/.exec(raw);
  return m ? m[1] : null;
};

/** 由原始 目录名/文件名 推导显示名：去掉 "NN-" 前缀，下划线换空格 */
const toName = (raw) => raw.replace(/^\d+-/, "").replace(/_/g, " ");

/**
 * 从源码文本里静态提取 `export const route = { ... }` 字面量并求值。
 * 无此导出或无法静态求值（如引用了变量）时，返回 {} 退回默认。
 * 因为 .mjs 无法直接 import 含 JSX 的 .tsx，这里走文本解析而非动态导入。
 */
function extractRouteFromFile(filePath) {
  let text;
  try {
    text = readFileSync(filePath, "utf8");
  } catch {
    return {};
  }
  const m = /export\s+(?:const|let|var)\s+route\b\s*(?::[^=]+)?=\s*/.exec(text);
  if (!m || text[m.index + m[0].length] !== "{") return {};

  // 从 "{" 起做平衡花括号扫描，跳过字符串内部，定位完整对象字面量
  let i = m.index + m[0].length;
  const start = i;
  let depth = 0;
  let str = null; // 当前所在字符串的引号类型（' " `），不在字符串时为 null
  for (; i < text.length; i++) {
    const c = text[i];
    if (str) {
      if (c === "\\") i++; // 跳过转义字符
      else if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") str = c;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) {
      i++;
      break;
    }
  }

  try {
    const obj = Function(`"use strict"; return (${text.slice(start, i)});`)();
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

const INDEX_FILES = ["index.tsx", "index.ts", "index.jsx", "index.js"];

/** 文件夹的 route：读取其内部 index.* 文件里的 `export const route` */
function extractRouteFromFolder(folderPath) {
  for (const name of INDEX_FILES) {
    const p = join(folderPath, name);
    if (existsSync(p)) return extractRouteFromFile(p);
  }
  return {};
}

/** 按 order 字段顺序组装节点：override 覆盖 derived，order 外的自定义字段追加在后 */
function assemble(order, derived, override) {
  const merged = { ...derived, ...override };
  const out = {};
  for (const k of order) if (merged[k] !== undefined) out[k] = merged[k];
  for (const k of Object.keys(override))
    if (!order.includes(k) && override[k] !== undefined) out[k] = override[k];
  return out;
}

const LEAF_ORDER = ["path", "name", "icon", "component"];
const BRANCH_ORDER = ["path", "name", "icon", "routes"];

/** 序列化为 TS 对象字面量字符串（双引号、2 空格缩进、尾随逗号；中文原样保留） */
const serialize = (value, indent = 0) => {
  const pad = "  ".repeat(indent);
  const padIn = "  ".repeat(indent + 1);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => padIn + serialize(v, indent + 1));
    return `[\n${items.join(",\n")},\n${pad}]`;
  }
  if (value && typeof value === "object") {
    const items = Object.entries(value).map(
      ([k, v]) => `${padIn}${k}: ${serialize(v, indent + 1)}`,
    );
    return `{\n${items.join(",\n")},\n${pad}}`;
  }
  return JSON.stringify(value);
};

/**
 * 生成单个 section 的路由文件（完全覆盖）。
 * @param {{ dir: string, name: string, icon?: string }} opts
 *   dir  —— src/pages 下的目录名，同时是一级路由路径（"java" → "/java"）
 *   name —— 一级节点默认显示名（可被 section 目录下 index.* 的 route.name 覆盖）
 *   icon —— 一级节点默认图标（可选，可被 route.icon 覆盖）
 */
export function generateSection({ dir, name, icon }) {
  const sectionDir = join(PAGES_ROOT, dir);

  const groupDirs = readdirSync(sectionDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && prefixOf(e.name))
    .map((e) => e.name)
    .sort((a, b) => Number(prefixOf(a)) - Number(prefixOf(b)));

  let pageCount = 0;

  const groups = groupDirs.map((group) => {
    const groupDir = join(sectionDir, group);
    const gp = prefixOf(group);

    const files = readdirSync(groupDir, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".tsx") && prefixOf(e.name))
      .map((e) => e.name)
      .sort((a, b) => Number(prefixOf(a)) - Number(prefixOf(b)));

    const pages = files.map((file) => {
      const base = file.replace(/\.tsx$/, "");
      pageCount += 1;
      const derived = {
        path: `/${dir}/${gp}/${prefixOf(file)}`,
        name: toName(base),
        component: `@/pages/${dir}/${group}/${base}`,
      };
      // 文件节点：读取文件自身的 export const route
      return assemble(
        LEAF_ORDER,
        derived,
        extractRouteFromFile(join(groupDir, file)),
      );
    });

    const derived = { path: `/${dir}/${gp}`, name: toName(group), routes: pages };
    // 分组节点（文件夹）：读取其 index.* 的 export const route
    return assemble(BRANCH_ORDER, derived, extractRouteFromFolder(groupDir));
  });

  const sectionDerived = { path: `/${dir}`, name, routes: groups };
  if (icon) sectionDerived.icon = icon;
  // 一级节点（文件夹）：读取 section 目录下 index.* 的 export const route（可覆盖入口脚本传入的 name/icon）
  const root = assemble(
    BRANCH_ORDER,
    sectionDerived,
    extractRouteFromFolder(sectionDir),
  );

  const header =
    `// ⚠️ 此文件由脚本自动生成，请勿手动修改。\n` +
    `// 数据源：src/pages/${dir}/ 目录结构（可由各页面/文件夹的 export const route 覆盖）\n` +
    `// 重新生成：node src/routes/scripts/${dir}.mjs（或 node src/routes/scripts/index.mjs 一键生成全部）\n\n`;

  const outPath = join(ROUTES_ROOT, `${dir}.ts`);
  writeFileSync(outPath, `${header}export default ${serialize([root])};\n`, "utf8");

  console.log(
    `✓ 已生成 src/routes/${dir}.ts —— ${groups.length} 个分组，${pageCount} 个页面`,
  );
}
