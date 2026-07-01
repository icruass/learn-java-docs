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
import {
  hasQuota,
  unlockQuota,
  UNLOCK_PASSPHRASE,
  QUOTA_EXCEEDED_MESSAGE,
} from "@/utils/aiUsage";
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
  role: "user" | "assistant" | "system";
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
  // 今日 token 额度是否已用尽（打开时 / 每次请求结束后重新检查）
  const [quotaExceeded, setQuotaExceeded] = useState(() => !hasQuota());

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
    setQuotaExceeded(!hasQuota());
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
        setQuotaExceeded(!hasQuota());
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
    if (discovering || loading || !hasQuota()) return;
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
      setQuotaExceeded(!hasQuota());
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
                disabled={loading || discovering || quotaExceeded}
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
            disabled={loading || discovering || quotaExceeded}
            onClick={discoverQuestions}
          >
            {discovering ? "分析中…" : "✨ 发现问题"}
          </button>
        </div>

        {quotaExceeded && (
          <div className={styles.quotaNotice}>{QUOTA_EXCEEDED_MESSAGE}</div>
        )}

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
                disabled={
                  !input.trim() ||
                  (quotaExceeded && input.trim() !== UNLOCK_PASSPHRASE)
                }
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
