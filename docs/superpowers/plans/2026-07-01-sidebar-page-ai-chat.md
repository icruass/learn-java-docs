# 侧边栏页面级 AI 问答 + 每日限流 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在侧边栏顶部新增一个「AI 问答」入口，打开一个全屏抽屉，针对当前文档页（标题+大纲）问答；同时给共享的 DeepSeek Key 加上每日 1000 token 的客户端软限流，并提供一个固定口令用于永久解除限流。

**Architecture:** 扩展现有 `AiChatDialog` 组件支持 `scope: 'snippet' | 'page'` 两种模式，而不是另起一个组件；限流账本与解锁口令放进新文件 `src/utils/aiUsage.ts`，被 `aiChat.ts`（拦截 + 记账）和 `AiChatDialog`（UI 禁用态 + 口令分支）共同依赖。

**Tech Stack:** React 18 + TypeScript + Umi 4（约定式路由）+ CSS Modules（`.less`）+ 原生 `fetch`/`ReadableStream` 调 DeepSeek 的 OpenAI 兼容流式接口。

## Global Constraints

- 本仓库**没有任何测试框架**（无 jest/vitest，无 `.test`/`.spec` 文件，`package.json` 里也没有 test script）。不要新增测试框架——这超出本次需求范围。每个任务用 `npx tsc --noEmit` 做编译期校验；涉及 localStorage / 流式网络 / DOM 交互的行为验证，统一放到最后的浏览器手动验证任务（Task 6），用 DevTools console 直接注入 localStorage 来模拟「额度已用尽」等状态，尽量不消耗真实 API token。
- 共享的 DeepSeek API Key 额度有限（见 `src/config/ai.ts` 顶部注释）。除 Task 6 明确标注「需要真实调用」的步骤外，其它任务的验证都不应触发真实网络请求。
- 所有新增/修改的用户可见文案用简体中文，风格与现有代码一致（见 `src/components/AiChatDialog/index.tsx` 现有文案）。
- 涉及的完整设计背景见 `docs/superpowers/specs/2026-07-01-sidebar-page-ai-chat-design.md`，本计划的任务顺序与该文档的章节一一对应（Task 1/2 ↔ 第 5/6 节的底层逻辑；Task 3 ↔ 第 1/2/4 节；Task 4 ↔ 第 5/6 节的 UI 部分；Task 5 ↔ 第 3 节）。

---

### Task 1: 新建 `aiUsage.ts`（每日用量记账 + 解锁口令）+ 限额常量

**Files:**
- Create: `src/utils/aiUsage.ts`
- Modify: `src/config/ai.ts`

**Interfaces:**
- Consumes: `DAILY_TOKEN_LIMIT`（本任务在 `src/config/ai.ts` 里新增的常量）
- Produces（后续任务会用到，函数签名务必保持一致）：
  - `hasQuota(): boolean`
  - `addUsage(tokens: number): void`
  - `estimateTokens(charCount: number): number`
  - `unlockQuota(): void`
  - `UNLOCK_PASSPHRASE: string`（值为 `"我的限流key是jiangjie"`）
  - `QUOTA_EXCEEDED_MESSAGE: string`（值为 `"今日 AI 问答额度已用完，请明天再来"`）

- [ ] **Step 1: 在 `src/config/ai.ts` 末尾（`AI_CONFIG` 定义之后）新增每日限额常量**

打开 `src/config/ai.ts`，找到：

```ts
export const AI_CONFIG = {
  /** OpenAI 兼容接口地址（注意下游会再拼 /chat/completions） */
  baseURL: "https://api.deepseek.com",
  /** 主模型 */
  model: "deepseek-chat",
  /** 备用模型：主模型过载重试仍失败时自动降级到它 */
  fallbackModel: "deepseek-chat",
} as const;
```

改成：

```ts
export const AI_CONFIG = {
  /** OpenAI 兼容接口地址（注意下游会再拼 /chat/completions） */
  baseURL: "https://api.deepseek.com",
  /** 主模型 */
  model: "deepseek-chat",
  /** 备用模型：主模型过载重试仍失败时自动降级到它 */
  fallbackModel: "deepseek-chat",
} as const;

/**
 * 每日 token 限额（客户端本地计数，见 src/utils/aiUsage.ts）。
 * 只是防止误用透支下面这个共享 Key 的软限流，不是精确计费 / 安全防刷。
 */
export const DAILY_TOKEN_LIMIT = 1000;
```

- [ ] **Step 2: 新建 `src/utils/aiUsage.ts`**

完整文件内容：

```ts
/**
 * AI 问答的「每日 token 用量」记账，以及限流解除口令。
 *
 * 纯客户端 localStorage 计数，跨天自动归零；只用于防止误用透支共享的
 * DeepSeek API Key 额度，不是安全防刷措施（前端源码可见，可被绕过）。
 */
import { DAILY_TOKEN_LIMIT } from "@/config/ai";

const USAGE_KEY = "ai-daily-usage";
const UNLOCK_KEY = "ai-quota-unlocked";

/** 固定解锁口令：命中后永久解除限流（写死在前端，只防误用，不是访问控制）。 */
export const UNLOCK_PASSPHRASE = "我的限流key是jiangjie";

/** 额度用尽时展示给用户的提示文案（aiChat.ts 抛错、AiChatDialog 常驻提示条共用同一份文案）。 */
export const QUOTA_EXCEEDED_MESSAGE = "今日 AI 问答额度已用完，请明天再来";

/** 字符数 → token 数的经验换算系数（拿不到 API 真实用量时的估算兜底）。 */
const CHARS_PER_TOKEN = 1.7;

interface UsageRecord {
  date: string;
  tokens: number;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function readUsage(): UsageRecord {
  try {
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem(USAGE_KEY) : null;
    const parsed = raw ? JSON.parse(raw) : null;
    if (
      parsed &&
      typeof parsed.date === "string" &&
      typeof parsed.tokens === "number"
    ) {
      return parsed as UsageRecord;
    }
  } catch {
    /* 忽略解析失败，视为无记录 */
  }
  return { date: todayKey(), tokens: 0 };
}

function writeUsage(record: UsageRecord): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(USAGE_KEY, JSON.stringify(record));
    }
  } catch {
    /* localStorage 不可用时静默降级 */
  }
}

function isUnlocked(): boolean {
  try {
    return (
      typeof localStorage !== "undefined" &&
      localStorage.getItem(UNLOCK_KEY) === "1"
    );
  } catch {
    return false;
  }
}

/** 今日已用 token 数（跨天自动归零）。 */
function getTodayUsage(): number {
  const record = readUsage();
  return record.date === todayKey() ? record.tokens : 0;
}

/** 永久解除限流：命中口令后调用，写入解锁标记。 */
export function unlockQuota(): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(UNLOCK_KEY, "1");
    }
  } catch {
    /* 忽略 */
  }
}

/** 是否还有额度可用（已解锁则永远有）。 */
export function hasQuota(): boolean {
  return isUnlocked() || getTodayUsage() < DAILY_TOKEN_LIMIT;
}

/** 记录本次消耗的 token 数（跨天时先归零再累加）。 */
export function addUsage(tokens: number): void {
  if (!tokens || tokens <= 0) return;
  const today = todayKey();
  const record = readUsage();
  const base = record.date === today ? record.tokens : 0;
  writeUsage({ date: today, tokens: base + Math.round(tokens) });
}

/** 按字符数估算 token（拿不到 API 真实用量时的兜底）。 */
export function estimateTokens(charCount: number): number {
  return Math.ceil(Math.max(0, charCount) / CHARS_PER_TOKEN);
}
```

- [ ] **Step 3: 编译校验**

Run: `npx tsc --noEmit`
Expected: 不应出现任何提到 `aiUsage.ts` 或 `config/ai.ts` 的新错误（其余文件已知存在的历史类型告警不用管，不属于本次改动范围）。

- [ ] **Step 4: Commit**

```bash
git add src/utils/aiUsage.ts src/config/ai.ts
git commit -m "feat: add daily AI token quota tracking and unlock passphrase"
```

---

### Task 2: `aiChat.ts` 接入限流拦截 + 用量记账

**Files:**
- Modify: `src/utils/aiChat.ts`

**Interfaces:**
- Consumes: Task 1 的 `hasQuota()`、`addUsage(tokens)`、`estimateTokens(charCount)`、`QUOTA_EXCEEDED_MESSAGE`
- Produces: `streamChat()` 的对外行为变化——额度用尽时同步抛出 `Error(QUOTA_EXCEEDED_MESSAGE)`（不发网络请求）；成功建立连接后无论如何结束都会调用一次 `addUsage`。函数签名 `streamChat(messages, onDelta, signal): Promise<void>` 不变，后续任务（AiChatDialog）无需改调用方式。

- [ ] **Step 1: 加上 aiUsage 的 import**

在 `src/utils/aiChat.ts` 顶部找到：

```ts
import { AI_CONFIG, getApiKey } from "@/config/ai";
```

改成：

```ts
import { AI_CONFIG, getApiKey } from "@/config/ai";
import {
  hasQuota,
  addUsage,
  estimateTokens,
  QUOTA_EXCEEDED_MESSAGE,
} from "@/utils/aiUsage";
```

- [ ] **Step 2: 请求体加 `stream_options.include_usage`，优先拿真实用量**

找到 `openStream` 函数里的：

```ts
    body: JSON.stringify({ model, messages, stream: true }),
```

改成：

```ts
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      stream_options: { include_usage: true },
    }),
```

- [ ] **Step 3: `streamChat` 开头加限流拦截**

找到：

```ts
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("尚未配置 DeepSeek API Key");
  }

  // 重试计划：主模型先试 2 次，仍失败则降级到备用模型再试 2 次。
```

改成：

```ts
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("尚未配置 DeepSeek API Key");
  }
  if (!hasQuota()) {
    throw new Error(QUOTA_EXCEEDED_MESSAGE);
  }

  const promptChars = messages.reduce((sum, m) => sum + m.content.length, 0);

  // 重试计划：主模型先试 2 次，仍失败则降级到备用模型再试 2 次。
```

- [ ] **Step 4: 读取流的循环包进 try/finally，记账**

找到从「已建立连接」注释到函数结尾的整段：

```ts
  // 已建立连接，开始流式读取（此后不再重试，避免重复内容）
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // 按行切分，最后一段可能不完整，留到下一轮
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const delta: string | undefined = json?.choices?.[0]?.delta?.content;
        if (delta) onDelta(delta);
      } catch {
        /* 不完整的 JSON 分片，忽略 */
      }
    }
  }
}
```

整段替换为：

```ts
  // 已建立连接：无论正常结束 / 用户中断 / 读取报错，都要按实际消耗记账，
  // 所以整段读取放进 try/finally，此后不再重试（避免重复内容）。
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completionChars = 0;
  let usageTokens: number | null = null;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // 按行切分，最后一段可能不完整，留到下一轮
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") return;
        try {
          const json = JSON.parse(data);
          const delta: string | undefined = json?.choices?.[0]?.delta?.content;
          if (delta) {
            completionChars += delta.length;
            onDelta(delta);
          }
          const total = json?.usage?.total_tokens;
          if (typeof total === "number") usageTokens = total;
        } catch {
          /* 不完整的 JSON 分片，忽略 */
        }
      }
    }
  } finally {
    addUsage(usageTokens ?? estimateTokens(promptChars + completionChars));
  }
}
```

- [ ] **Step 5: 编译校验**

Run: `npx tsc --noEmit`
Expected: 无新增错误（不涉及 `aiChat.ts` 的历史错误无需处理）。

- [ ] **Step 6: 记录风险，供 Task 6 验证时参考**

`stream_options: { include_usage: true }` 是否被 DeepSeek 接受未经真实验证。如果 Task 6 里真实调用一次时收到 400 类错误、提示未知参数，回到本任务，把 Step 2 加的 `stream_options` 那行删掉（只留 `stream: true`），`usageTokens` 会一直是 `null`，自动落到字符数估算兜底，无需再改别处。

- [ ] **Step 7: Commit**

```bash
git add src/utils/aiChat.ts
git commit -m "feat: enforce daily AI quota and record real/estimated token usage"
```

---

### Task 3: `AiChatDialog` 支持双模式（scope）+ 切页自动清空 + 滚动跟随修复

**Files:**
- Modify: `src/components/AiChatDialog/index.tsx`（整体重写，见下方完整文件）
- Modify: `src/components/AiChatDialog/index.less`

**Interfaces:**
- Consumes: `streamChat`/`ChatMessage`（已有，未变）
- Produces: `AiChatDialogProps` 新增 `scope?: 'snippet' | 'page'`（默认 `'snippet'`），`code`/`language` 改为可选。`CodeBlock.tsx` 不需要改动（不传 `scope` 时默认走原行为）。本任务尚不引入限流/口令逻辑，那是 Task 4。

- [ ] **Step 1: 整体重写 `src/components/AiChatDialog/index.tsx`**

完整文件内容：

```tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useLocation } from "umi";
import { marked } from "marked";
import { streamChat, type ChatMessage } from "@/utils/aiChat";
import styles from "./index.less";

marked.setOptions({ breaks: true, gfm: true });

export interface AiChatDialogProps {
  open: boolean;
  onClose: () => void;
  /** 'snippet'（默认）= 针对一段代码；'page' = 针对当前整篇文档页 */
  scope?: "snippet" | "page";
  /** 触发问答的代码片段（scope='snippet' 时必填） */
  code?: string;
  /** 代码语言（scope='snippet' 时必填） */
  language?: string;
}

/** 抽屉关闭动画时长，需与 index.less 中的 transition 时长一致 */
const ANIM_MS = 320;

/** 收集当前页面上下文：主标题 + 各级小标题大纲，供模型聚焦本页知识点。 */
function collectPageContext(): { title: string; outline: string } {
  if (typeof document === "undefined") return { title: "", outline: "" };
  const root = document.querySelector("main") ?? document.body;
  const h1 = root.querySelector("h1");
  const title = (h1?.textContent ?? document.title ?? "").trim();
  const heads = Array.from(root.querySelectorAll("h2, h3"))
    .map((el) => {
      const level = el.tagName === "H2" ? "## " : "### ";
      return level + (el.textContent ?? "").trim();
    })
    .filter((s) => s.length > 3)
    .slice(0, 40);
  return { title, outline: heads.join("\n") };
}

/** 代码问答模式的内置快捷提问标签（常驻） */
const SNIPPET_SUGGESTIONS = [
  "解释这段代码",
  "这段代码考察哪些知识点？",
  "可能有哪些坑或注意点？",
];

/** 页面问答模式的内置快捷提问标签（常驻） */
const PAGE_SUGGESTIONS = [
  "这页讲了什么？",
  "举例说明本页的知识点",
  "这页最容易混淆/出错的地方？",
];

/** 从模型返回的文本里解析出问题列表：优先 JSON 数组，失败则按行兜底。 */
function parseQuestions(text: string): string[] {
  const t = text.trim();
  const start = t.indexOf("[");
  const end = t.lastIndexOf("]");
  if (start !== -1 && end > start) {
    try {
      const arr = JSON.parse(t.slice(start, end + 1));
      if (Array.isArray(arr)) {
        return arr
          .map((x) => String(x).trim())
          .filter(Boolean)
          .slice(0, 8);
      }
    } catch {
      /* 落到按行兜底 */
    }
  }
  return t
    .split("\n")
    .map((l) => l.replace(/^[\s\-*\d.、)）"`]+/, "").replace(/["`]+$/, "").trim())
    .filter((s) => s.length > 4 && !s.startsWith("```"))
    .slice(0, 8);
}

interface UiMessage {
  role: "user" | "assistant";
  content: string;
}

const AiChatDialog: React.FC<AiChatDialogProps> = ({
  open,
  onClose,
  scope = "snippet",
  code,
  language,
}) => {
  const { pathname } = useLocation();

  // 控制实际挂载：open=false 时延迟卸载，留出退场动画
  const [mounted, setMounted] = useState(open);
  // 控制进场态：决定抽屉 translateY 是否归零
  const [entered, setEntered] = useState(false);

  const defaultSuggestions =
    scope === "page" ? PAGE_SUGGESTIONS : SNIPPET_SUGGESTIONS;

  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 标签条里的问题标签（内置 + 「发现问题」生成的，均可删除）；动作标签固定在末尾
  const [chips, setChips] = useState<string[]>(defaultSuggestions);
  const [discovering, setDiscovering] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // 是否「跟随到底部」：流式生成时新增内容要不要自动滚下去，由用户手动滚动位置决定
  const stickToBottomRef = useRef(true);
  const prevPathnameRef = useRef(pathname);

  // 进场 / 退场动画编排
  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(id);
    }
    setEntered(false);
    const t = window.setTimeout(() => setMounted(false), ANIM_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  // 打开时：锁背景滚动、ESC 关闭、聚焦输入、重置滚动跟随状态
  useEffect(() => {
    if (!open) return;
    stickToBottomRef.current = true;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusT = window.setTimeout(() => inputRef.current?.focus(), ANIM_MS);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusT);
    };
  }, [open, onClose]);

  // 关闭时中断进行中的请求
  useEffect(() => {
    if (!open) abortRef.current?.abort();
  }, [open]);

  // 切页（pathname 变化）时，若弹窗还开着：自动关闭并清空对话，避免带着上一页的上下文继续问
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;
    if (!open) return;
    onClose();
    setMessages([]);
    setChips(defaultSuggestions);
    setError(null);
    setInput("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 监听消息区滚动：用户主动上滚超过阈值则停止自动跟随，滚回底部附近再恢复
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const STICK_THRESHOLD = 48;
    const onScroll = () => {
      const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      stickToBottomRef.current = distanceToBottom <= STICK_THRESHOLD;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // 新内容到达时，仅在「跟随到底部」状态下才自动滚动，不打断用户查看历史
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const pageContext = useMemo(() => collectPageContext(), [scope, pathname]);

  const systemPrompt = useMemo(() => {
    const { title, outline } = pageContext;
    if (scope === "page") {
      return [
        "你是一位资深 Java / 后端开发讲师，正在帮助学习者理解一个技术文档页面的内容。",
        "请用简体中文回答，讲解清晰、循序渐进，可使用 Markdown（代码块、列表、加粗）排版。",
        "只回答当前页面标题与大纲覆盖的知识范围；问题明显与本页无关时，礼貌说明并引导用户提出与本页相关的问题。",
        title ? `\n【当前页面】${title}` : "",
        outline ? `\n【页面大纲】\n${outline}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }
    return [
      "你是一位资深 Java / 后端开发讲师，正在帮助学习者理解一个技术文档页面里的代码。",
      "请用简体中文回答，讲解清晰、循序渐进，可使用 Markdown（代码块、列表、加粗）排版。",
      "优先结合「当前页面」的主题与下面这段代码作答；与本页无关的问题可礼貌引导回到主题。",
      title ? `\n【当前页面】${title}` : "",
      outline ? `\n【页面大纲】\n${outline}` : "",
      `\n【相关代码（${language ?? "text"}）】\n\`\`\`${language ?? "text"}\n${code ?? ""}\n\`\`\``,
    ]
      .filter(Boolean)
      .join("\n");
  }, [scope, code, language, pageContext]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;
      setError(null);
      setInput("");
      stickToBottomRef.current = true;

      const history = messages;
      const nextUi: UiMessage[] = [
        ...history,
        { role: "user", content },
        { role: "assistant", content: "" },
      ];
      setMessages(nextUi);
      setLoading(true);

      const payload: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content },
      ];

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamChat(
          payload,
          (delta) => {
            setMessages((prev) => {
              const copy = prev.slice();
              const last = copy[copy.length - 1];
              if (last && last.role === "assistant") {
                copy[copy.length - 1] = {
                  ...last,
                  content: last.content + delta,
                };
              }
              return copy;
            });
          },
          controller.signal
        );
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError(e?.message ?? "请求出错");
          setMessages((prev) => {
            const copy = prev.slice();
            const last = copy[copy.length - 1];
            if (last && last.role === "assistant" && !last.content) copy.pop();
            return copy;
          });
        }
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [loading, messages, systemPrompt]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      send(input);
    },
    [input, send]
  );

  // 「发现问题」：让模型基于本页 / 代码知识点生成若干问题，解析成标签追加进 chips。
  // 不写入对话区（这是元操作），只把结果变成可点击的标签。
  const discoverQuestions = useCallback(async () => {
    if (discovering || loading) return;
    setError(null);
    setDiscovering(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let buf = "";
    try {
      await streamChat(
        [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content:
              scope === "page"
                ? '请基于"当前页面"的知识点，提出最多 3 个有助于由浅入深理解的问题。只返回一个 JSON 字符串数组（形如 ["问题1","问题2"]），数组长度不超过 3，不要代码块、不要任何多余文字。'
                : '请基于"当前页面"的知识点与上面这段代码，提出最多 3 个有助于由浅入深理解的问题。只返回一个 JSON 字符串数组（形如 ["问题1","问题2"]），数组长度不超过 3，不要代码块、不要任何多余文字。',
          },
        ],
        (d) => {
          buf += d;
        },
        controller.signal
      );
      const qs = parseQuestions(buf).slice(0, 3);
      if (qs.length) {
        setChips((prev) => {
          const seen = new Set<string>(prev);
          const merged = prev.slice();
          for (const q of qs) {
            if (!seen.has(q)) {
              seen.add(q);
              merged.push(q);
            }
          }
          return merged;
        });
      } else {
        setError("没能解析出问题，请再点一次试试");
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message ?? "请求出错");
    } finally {
      setDiscovering(false);
      abortRef.current = null;
    }
  }, [discovering, loading, scope, systemPrompt]);

  const removeChip = useCallback((label: string) => {
    setChips((prev) => prev.filter((c) => c !== label));
  }, []);

  if (!mounted) return null;

  const overlay = (
    <div
      className={`${styles.root} ${entered ? styles.entered : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="AI 问答"
    >
      <div className={styles.mask} onClick={onClose} aria-hidden="true" />
      <div
        className={`${styles.drawer} ${
          scope === "page" ? styles.fullscreen : ""
        }`}
      >
        <header className={styles.header}>
          <span className={styles.title}>
            <span className={styles.badge}>AI</span> 知识点问答
          </span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>
        </header>

        <div ref={scrollRef} className={styles.body}>
          {messages.length === 0 ? (
            <div className={styles.welcome}>
              <p className={styles.welcomeText}>
                {scope === "page"
                  ? `针对《${pageContext.title || "本页"}》这篇文档，问我任何问题 👇`
                  : `针对这段 ${language ?? ""} 代码，问我任何问题 👇`}
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.msg} ${
                  m.role === "user" ? styles.msgUser : styles.msgAi
                }`}
              >
                {m.role === "user" ? (
                  <div className={styles.bubbleUser}>{m.content}</div>
                ) : (
                  <div
                    className={styles.bubbleAi}
                    dangerouslySetInnerHTML={{
                      __html:
                        marked.parse(m.content || "") +
                        (loading && i === messages.length - 1
                          ? '<span class="ai-caret">▍</span>'
                          : ""),
                    }}
                  />
                )}
              </div>
            ))
          )}
          {error && <div className={styles.error}>⚠️ {error}</div>}
        </div>

        <div className={styles.suggestionsBar}>
          {chips.map((s) => (
            <span key={s} className={styles.chip}>
              <button
                type="button"
                className={styles.chipMain}
                disabled={loading || discovering}
                onClick={() => send(s)}
              >
                {s}
              </button>
              <button
                type="button"
                className={styles.chipDel}
                aria-label="删除标签"
                title="删除"
                onClick={() => removeChip(s)}
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            className={styles.chipAction}
            disabled={loading || discovering}
            onClick={discoverQuestions}
          >
            {discovering ? "分析中…" : "✨ 发现问题"}
          </button>
        </div>

        <form className={styles.composer} onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className={styles.textarea}
              placeholder="输入问题，Enter 发送 / Shift+Enter 换行"
              rows={1}
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            {loading ? (
              <button
                type="button"
                className={styles.stopBtn}
                onClick={() => abortRef.current?.abort()}
              >
                停止
              </button>
            ) : (
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={!input.trim()}
              >
                发送
              </button>
            )}
        </form>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

export default AiChatDialog;
```

- [ ] **Step 2: 在 `src/components/AiChatDialog/index.less` 加全屏变体样式**

找到：

```less
.entered .drawer {
  transform: translateY(0);
}
```

在它后面（`@media (prefers-reduced-motion: reduce)` 之前）插入：

```less
/* 页面级问答（scope='page'）：全屏展示，而不是 80% 高度的抽屉 */
.fullscreen {
  height: 100%;
  border-radius: 0;
  border-top: none;
}
```

- [ ] **Step 3: 编译校验**

Run: `npx tsc --noEmit`
Expected: 无新增错误。

- [ ] **Step 4: 浏览器快速检查（不需要真实调用 AI，只看 UI 结构）**

```bash
npm run dev
```

打开任意一篇带代码块的文档页，点代码块工具栏上的「AI 🤖」，确认：
- 抽屉从底部滑入，高度约 80%（不是全屏），四角有圆角。
- 欢迎语仍是「针对这段 xxx 代码，问我任何问题 👇」。

关闭它。这一步只验证 Task 3 没有破坏现有的代码问答外观，暂不需要给 Sidebar 接入入口（那是 Task 5），也不用点发送。

- [ ] **Step 5: Commit**

```bash
git add src/components/AiChatDialog/index.tsx src/components/AiChatDialog/index.less
git commit -m "feat: support page-scoped AI chat mode alongside snippet mode"
```

---

### Task 4: `AiChatDialog` 接入每日限流 UI + 解除口令

**Files:**
- Modify: `src/components/AiChatDialog/index.tsx`
- Modify: `src/components/AiChatDialog/index.less`

**Interfaces:**
- Consumes: Task 1 的 `hasQuota()`、`unlockQuota()`、`UNLOCK_PASSPHRASE`、`QUOTA_EXCEEDED_MESSAGE`
- Produces: 无新增对外 props；内部新增 `role: "system"` 的消息类型，仅影响渲染，不影响 `AiChatDialogProps`。

- [ ] **Step 1: 加 aiUsage 的 import**

找到：

```tsx
import { streamChat, type ChatMessage } from "@/utils/aiChat";
import styles from "./index.less";
```

改成：

```tsx
import { streamChat, type ChatMessage } from "@/utils/aiChat";
import {
  hasQuota,
  unlockQuota,
  UNLOCK_PASSPHRASE,
  QUOTA_EXCEEDED_MESSAGE,
} from "@/utils/aiUsage";
import styles from "./index.less";
```

- [ ] **Step 2: `UiMessage` 加 `system` 角色**

找到：

```tsx
interface UiMessage {
  role: "user" | "assistant";
  content: string;
}
```

改成：

```tsx
interface UiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
```

- [ ] **Step 3: 新增 `quotaExceeded` state**

找到：

```tsx
  const [discovering, setDiscovering] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
```

改成：

```tsx
  const [discovering, setDiscovering] = useState(false);
  // 今日 token 额度是否已用尽（打开时 / 每次请求结束后重新检查）
  const [quotaExceeded, setQuotaExceeded] = useState(() => !hasQuota());

  const abortRef = useRef<AbortController | null>(null);
```

- [ ] **Step 4: 打开弹窗时重新检查额度**

找到：

```tsx
  useEffect(() => {
    if (!open) return;
    stickToBottomRef.current = true;
    const onKey = (e: KeyboardEvent) => {
```

改成：

```tsx
  useEffect(() => {
    if (!open) return;
    stickToBottomRef.current = true;
    setQuotaExceeded(!hasQuota());
    const onKey = (e: KeyboardEvent) => {
```

- [ ] **Step 5: `send()` 开头加解锁口令分支 + 限流拦截**

找到：

```tsx
  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;
      setError(null);
      setInput("");
      stickToBottomRef.current = true;

      const history = messages;
      const nextUi: UiMessage[] = [
        ...history,
        { role: "user", content },
        { role: "assistant", content: "" },
      ];
      setMessages(nextUi);
      setLoading(true);

      const payload: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content },
      ];
```

改成：

```tsx
  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;

      // 限流解除口令：不经过 AI，不受限流 / 页面知识边界约束
      if (content === UNLOCK_PASSPHRASE) {
        unlockQuota();
        setQuotaExceeded(false);
        setInput("");
        setMessages((prev) => [
          ...prev,
          { role: "system", content: "✅ 限流已解除" },
        ]);
        return;
      }

      if (!hasQuota()) {
        setQuotaExceeded(true);
        return;
      }

      setError(null);
      setInput("");
      stickToBottomRef.current = true;

      const history = messages;
      const nextUi: UiMessage[] = [
        ...history,
        { role: "user", content },
        { role: "assistant", content: "" },
      ];
      setMessages(nextUi);
      setLoading(true);

      const payload: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...history
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content },
      ];
```

- [ ] **Step 6: `send()` 的 `finally` 里重新检查额度**

找到：

```tsx
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [loading, messages, systemPrompt]
  );
```

改成：

```tsx
      } finally {
        setLoading(false);
        abortRef.current = null;
        setQuotaExceeded(!hasQuota());
      }
    },
    [loading, messages, systemPrompt]
  );
```

- [ ] **Step 7: `discoverQuestions()` 加限流拦截 + 结束后重新检查**

找到：

```tsx
  const discoverQuestions = useCallback(async () => {
    if (discovering || loading) return;
    setError(null);
    setDiscovering(true);
```

改成：

```tsx
  const discoverQuestions = useCallback(async () => {
    if (discovering || loading || !hasQuota()) return;
    setError(null);
    setDiscovering(true);
```

再找到：

```tsx
    } finally {
      setDiscovering(false);
      abortRef.current = null;
    }
  }, [discovering, loading, scope, systemPrompt]);
```

改成：

```tsx
    } finally {
      setDiscovering(false);
      abortRef.current = null;
      setQuotaExceeded(!hasQuota());
    }
  }, [discovering, loading, scope, systemPrompt]);
```

- [ ] **Step 8: 消息渲染加 `system` 分支**

找到：

```tsx
            messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.msg} ${
                  m.role === "user" ? styles.msgUser : styles.msgAi
                }`}
              >
                {m.role === "user" ? (
                  <div className={styles.bubbleUser}>{m.content}</div>
                ) : (
                  <div
                    className={styles.bubbleAi}
```

改成：

```tsx
            messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.msg} ${
                  m.role === "user"
                    ? styles.msgUser
                    : m.role === "system"
                    ? styles.msgSystem
                    : styles.msgAi
                }`}
              >
                {m.role === "user" ? (
                  <div className={styles.bubbleUser}>{m.content}</div>
                ) : m.role === "system" ? (
                  <div className={styles.systemNote}>{m.content}</div>
                ) : (
                  <div
                    className={styles.bubbleAi}
```

- [ ] **Step 9: 建议标签 / 发现问题按钮加 `quotaExceeded` 禁用**

找到（标签主按钮）：

```tsx
              <button
                type="button"
                className={styles.chipMain}
                disabled={loading || discovering}
                onClick={() => send(s)}
              >
```

改成：

```tsx
              <button
                type="button"
                className={styles.chipMain}
                disabled={loading || discovering || quotaExceeded}
                onClick={() => send(s)}
              >
```

再找到（发现问题按钮）：

```tsx
          <button
            type="button"
            className={styles.chipAction}
            disabled={loading || discovering}
            onClick={discoverQuestions}
          >
```

改成：

```tsx
          <button
            type="button"
            className={styles.chipAction}
            disabled={loading || discovering || quotaExceeded}
            onClick={discoverQuestions}
          >
```

- [ ] **Step 10: 加限流提示条 + 发送按钮的口令例外**

找到：

```tsx
        </div>

        <form className={styles.composer} onSubmit={handleSubmit}>
```

改成：

```tsx
        </div>

        {quotaExceeded && (
          <div className={styles.quotaNotice}>{QUOTA_EXCEEDED_MESSAGE}</div>
        )}

        <form className={styles.composer} onSubmit={handleSubmit}>
```

再找到（发送按钮）：

```tsx
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={!input.trim()}
              >
                发送
              </button>
```

改成：

```tsx
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={
                  !input.trim() ||
                  (quotaExceeded && input.trim() !== UNLOCK_PASSPHRASE)
                }
              >
                发送
              </button>
```

注意：输入框（`<textarea>`）本身的 `disabled={loading}` 不用改——保持始终可编辑（除非正在生成回答），这样即使额度用尽，用户也能把解锁口令打出来发送。

- [ ] **Step 11: `index.less` 加系统提示消息 + 限流提示条样式**

找到（`.bubbleAi` 相关规则块之前，`.msgAi` 定义处）：

```less
.msgAi {
  justify-content: flex-start;
}
```

在它后面插入：

```less
.msgSystem {
  justify-content: center;
}

.systemNote {
  padding: 6px 14px;
  font-size: 12.5px;
  color: var(--color-text-secondary);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 999px;
}
```

再找到（`.error` 规则块）：

```less
.error {
  color: #e5484d;
  font-size: 13px;
  padding: 8px 12px;
  background: color-mix(in srgb, #e5484d 12%, transparent);
  border-radius: var(--radius-sm);
}
```

在它后面插入：

```less
.quotaNotice {
  flex: none;
  margin: 0 20px;
  padding: 8px 14px;
  font-size: 13px;
  color: var(--color-text-secondary);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  text-align: center;
}
```

- [ ] **Step 12: 编译校验**

Run: `npx tsc --noEmit`
Expected: 无新增错误。

- [ ] **Step 13: Commit**

```bash
git add src/components/AiChatDialog/index.tsx src/components/AiChatDialog/index.less
git commit -m "feat: enforce quota in AiChatDialog UI and add unlock passphrase flow"
```

---

### Task 5: 侧边栏顶部新增 AI 入口按钮

**Files:**
- Modify: `src/components/Sidebar/index.tsx`
- Modify: `src/components/Sidebar/index.less`

**Interfaces:**
- Consumes: Task 3/4 完成后的 `<AiChatDialog open onClose scope="page" />`
- Produces: 无对外接口变化（`Sidebar` 本身不接收新 props）。

- [ ] **Step 1: 引入 `AiChatDialog`**

找到：

```tsx
import { Link, useLocation } from "umi";
import type { DocRoute } from "@/routes/types";
import { docRoutes } from "@/routes/docRoutes";
import styles from "./index.less";
```

改成：

```tsx
import { Link, useLocation } from "umi";
import type { DocRoute } from "@/routes/types";
import { docRoutes } from "@/routes/docRoutes";
import AiChatDialog from "@/components/AiChatDialog";
import styles from "./index.less";
```

- [ ] **Step 2: 加按钮 + state + 弹窗**

找到：

```tsx
const Sidebar: React.FC<{
  drawerOpen?: boolean;
  onClose?: () => void;
}> = ({ drawerOpen = false, onClose }) => {
  const { pathname } = useLocation();

  return (
    <aside
      className={`${styles.sidebar} ${drawerOpen ? styles.drawerOpen : ""}`}
    >
      <div className={styles.brand}>
        <span className={styles.brandText}>Java Docs</span>
        {/* Close button: only visible inside the mobile drawer */}
        <button
          className={styles.closeBtn}
          aria-label="关闭菜单"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <nav className={styles.nav}>
        {docRoutes.map((node, i) => (
          <RouteNode
            key={node.path}
            node={node}
            pathname={pathname}
            level={1}
            initiallyOpen={i === 0}
          />
        ))}
      </nav>
    </aside>
  );
};
```

改成：

```tsx
const Sidebar: React.FC<{
  drawerOpen?: boolean;
  onClose?: () => void;
}> = ({ drawerOpen = false, onClose }) => {
  const { pathname } = useLocation();
  const [pageAiOpen, setPageAiOpen] = useState(false);

  return (
    <aside
      className={`${styles.sidebar} ${drawerOpen ? styles.drawerOpen : ""}`}
    >
      <div className={styles.brand}>
        <span className={styles.brandText}>Java Docs</span>
        <button
          type="button"
          className={styles.aiEntryBtn}
          onClick={() => setPageAiOpen(true)}
          title="针对本页内容的 AI 问答"
          aria-label="打开 AI 问答"
        >
          AI 🤖
        </button>
        {/* Close button: only visible inside the mobile drawer */}
        <button
          className={styles.closeBtn}
          aria-label="关闭菜单"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <nav className={styles.nav}>
        {docRoutes.map((node, i) => (
          <RouteNode
            key={node.path}
            node={node}
            pathname={pathname}
            level={1}
            initiallyOpen={i === 0}
          />
        ))}
      </nav>

      <AiChatDialog
        open={pageAiOpen}
        onClose={() => setPageAiOpen(false)}
        scope="page"
      />
    </aside>
  );
};
```

（`useState` 已经在文件顶部的 `import React, { useEffect, useRef, useState } from "react";` 里导入，不用再加。）

- [ ] **Step 3: `index.less` 加按钮样式**

找到：

```less
.brandText {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}
```

改成：

```less
.brandText {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

/* 顶部 AI 入口：针对当前整篇文档页问答，视觉复用代码块工具栏里 AI 按钮的强调色风格 */
.aiEntryBtn {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border: 1px solid color-mix(in srgb, var(--color-accent) 40%, transparent);
  border-radius: 999px;
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast),
    border-color var(--transition-fast);
}

.aiEntryBtn:hover {
  color: #fff;
  background: var(--color-accent);
  border-color: var(--color-accent);
}
```

- [ ] **Step 4: 编译校验**

Run: `npx tsc --noEmit`
Expected: 无新增错误。

- [ ] **Step 5: 浏览器快速检查（不发消息，不消耗 token）**

```bash
npm run dev
```

打开任意文档页，确认：
- 侧边栏品牌行「Java Docs」右侧出现「AI 🤖」按钮（桌面端 + 把窗口缩到手机宽度都看一下）。
- 点击后，弹窗从底部滑入并铺满整个视口（无圆角、无 80% 高度的裸露背景遮罩边缘）。
- 欢迎语显示「针对《当前页面标题》这篇文档，问我任何问题 👇」。

点 ✕ 关闭，不用发消息。

- [ ] **Step 6: Commit**

```bash
git add src/components/Sidebar/index.tsx src/components/Sidebar/index.less
git commit -m "feat: add sidebar entry button for page-scoped AI chat"
```

---

### Task 6: 端到端浏览器验证（收尾）

**Files:** 无代码改动（除非 Step 3 的 DeepSeek 兼容性检查触发 Task 2 的 Step 6 那条回退）。

- [ ] **Step 1: 启动 dev server**

```bash
npm run dev
```

用浏览器打开站点（注意 `.umirc.ts` 里配置了 `base: "/learn-java-docs/"`，本地开发地址通常是 `http://localhost:8000/learn-java-docs/`，以终端输出的实际地址为准）。

- [ ] **Step 2: 回归检查——代码问答（scope='snippet'）不受影响**

打开一篇带代码块的文档页，点代码块工具栏「AI 🤖」，确认抽屉是 80% 高度、非全屏、欢迎语是代码版文案。先不发消息，关闭它。

- [ ] **Step 3: 用 DevTools console 模拟「额度已用尽」，不花真实 token**

打开浏览器 DevTools → Console，执行：

```js
const d = new Date();
const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
localStorage.setItem("ai-daily-usage", JSON.stringify({ date: key, tokens: 999999 }));
```

点击侧边栏「AI 🤖」打开页面问答弹窗（打开时会重新检查额度），确认：
- 顶部/输入框上方出现提示「今日 AI 问答额度已用完，请明天再来」。
- 三个默认建议标签变灰不可点。
- 「✨ 发现问题」按钮变灰不可点。
- 发送按钮（此时输入框为空）本来就是禁用状态。

- [ ] **Step 4: 验证解锁口令**

在输入框里输入（一字不差）：

```
我的限流key是jiangjie
```

确认输入框本身能正常输入（没有被禁用），且发送按钮此刻是可点击的（即使额度已用尽）。按 Enter 或点发送，确认：
- 对话区出现一条居中的提示条「✅ 限流已解除」（不是用户气泡也不是 AI 气泡）。
- 输入框被清空。
- 限流提示条消失，三个建议标签和「发现问题」恢复可点。

在 DevTools console 确认：

```js
localStorage.getItem("ai-quota-unlocked"); // 应该是 "1"
```

- [ ] **Step 5: 验证解锁是永久的**

刷新整个页面（F5），重新打开侧边栏 AI 弹窗，确认限流提示条**没有**再出现（尽管 `ai-daily-usage` 里还是很大的数字，`ai-quota-unlocked` 让 `hasQuota()` 永远为真）。

- [ ] **Step 6: 清理测试用的 localStorage，恢复干净状态**

```js
localStorage.removeItem("ai-daily-usage");
localStorage.removeItem("ai-quota-unlocked");
```

刷新页面。

- [ ] **Step 7: 真实调用一次，验证真实用量 / 估算兜底 + 切页自动关闭**

这一步会真实消耗共享 Key 的 token 额度，只做一次。打开侧边栏 AI 弹窗，点一个默认建议标签（比如「这页讲了什么？」），确认：
- 回答逐字流式出现，带闪烁光标；结束后光标消失。
- Markdown（如果回答里有代码块/列表/加粗）渲染正常。

等回答完全结束后，在 DevTools console 执行：

```js
JSON.parse(localStorage.getItem("ai-daily-usage"));
```

确认返回一个 `{ date: "...", tokens: <正整数> }`，`tokens` 是几十到几百的量级（不应该是 0 或异常巨大的数）。

**如果这一步请求直接失败**，打开 Network 面板看这次 `/chat/completions` 请求的响应体：
- 如果错误提示与 `stream_options` 或未知参数相关：回到 `src/utils/aiChat.ts`，删掉 `stream_options: { include_usage: true }` 那一行（Task 2 Step 6 已经预告了这个回退方案），保存后重新触发这一步。
- 如果是其它错误（如 401/超时），先确认 `src/config/ai.ts` 里的 Key 仍然有效，这与本次改动无关。

不要关闭这个弹窗，直接进行下一步。

- [ ] **Step 8: 复用上一步的会话，验证流式生成时不打断手动滚动**

如果上一步的回答比较长（能撑出滚动条），趁它还在流式生成时，用鼠标滚轮把消息区往上滚一段——确认视图停在你滚到的位置，不会被新到达的文字重新拽回底部。再把滚动条拖回到最底部——确认此后新增的文字又开始自动跟随滚动到底部。

如果上一步的回答太短没滚动条，就在输入框里追加问一个明确要「详细展开、尽量长」的问题（例如「请更详细地展开讲讲，包含具体例子」），用这次回答重复上述滚动验证（这会产生第二次真实调用，属于本次验证必要的成本）。

- [ ] **Step 9: 验证切页自动关闭对话**

保持 AI 弹窗打开（可以是上一步用完的那个），点侧边栏里任意另一篇文档链接切换页面，确认：
- AI 弹窗自动关闭（退场动画正常）。
- 重新点开侧边栏「AI 🤖」，确认是全新会话（没有上一页的对话历史），欢迎语里的书名号内容已经变成新页面的标题。

- [ ] **Step 10: 收尾检查**

```bash
git status
```

确认没有遗留的未提交改动（每个任务应该已经在各自 Step 里 commit 过）。停掉 dev server。

- [ ] **Step 11: 最终确认（无需 commit，仅口头/文字确认）**

如果 Step 1-9 都符合预期，本计划到此完成；把验证中发现的任何偏差（如 Step 7 触发了 `stream_options` 回退）总结一句话告知用户。
