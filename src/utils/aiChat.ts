/**
 * AI 流式对话封装（Gemini OpenAI 兼容 /chat/completions，stream:true）。
 *
 * 解析 SSE：逐行读取 "data: {...}" 分片，回调 delta 文本；遇到 [DONE] 结束。
 * 不引入任何依赖，纯 fetch + ReadableStream。
 *
 * 健壮性：
 *  - 建立连接阶段对「可重试」状态码（429/500/502/503/504，含 Gemini 高峰期的
 *    503 UNAVAILABLE）做指数退避重试；
 *  - 主模型多次重试仍失败时，自动降级到备用模型；
 *  - 仅在「尚未产生任何输出」前重试，开始流式后不再重试，避免重复内容。
 */
import { AI_CONFIG, getApiKey } from "@/config/ai";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** 服务端临时性错误：值得重试 */
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

interface HttpError extends Error {
  status?: number;
}

/** 可被 AbortSignal 中断的延时 */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

/** 建立一次流式连接；非 2xx 抛出带 status 的错误（供上层判断是否重试）。 */
async function openStream(
  model: string,
  apiKey: string,
  messages: ChatMessage[],
  signal?: AbortSignal
): Promise<Response> {
  const res = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, stream: true }),
    signal,
  });

  if (!res.ok || !res.body) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    const err: HttpError = new Error(
      `DeepSeek 请求失败（HTTP ${res.status}）${detail}`.trim()
    );
    err.status = res.status;
    throw err;
  }
  return res;
}

/**
 * 发起一次流式对话。
 * @param messages 完整的多轮消息（含 system）
 * @param onDelta  每收到一段增量文本时回调
 * @param signal   可选，用于中断请求
 */
export async function streamChat(
  messages: ChatMessage[],
  onDelta: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("尚未配置 DeepSeek API Key");
  }

  // 重试计划：主模型先试 2 次，仍失败则降级到备用模型再试 2 次。
  const fallback = AI_CONFIG.fallbackModel;
  const plan = [
    AI_CONFIG.model,
    AI_CONFIG.model,
    ...(fallback ? [fallback, fallback] : [AI_CONFIG.model, AI_CONFIG.model]),
  ];

  let res: Response | null = null;
  let lastErr: unknown = null;

  for (let i = 0; i < plan.length; i++) {
    try {
      res = await openStream(plan[i], apiKey, messages, signal);
      break;
    } catch (e) {
      lastErr = e;
      const status = (e as HttpError)?.status;
      // 用户主动中断 / 不可重试错误（如 400 参数错、401 鉴权失败）：直接抛出
      if ((e as Error)?.name === "AbortError" || !RETRYABLE_STATUS.has(status!)) {
        throw e;
      }
      if (i === plan.length - 1) throw e; // 重试用尽
      // 指数退避：0.8s, 1.6s, 3.2s …（封顶 8s）+ 抖动，避开同时重试
      const backoff = Math.min(8000, 800 * 2 ** i) + Math.floor(Math.random() * 300);
      await sleep(backoff, signal);
    }
  }

  if (!res || !res.body) {
    throw lastErr ?? new Error("DeepSeek 请求失败");
  }

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
