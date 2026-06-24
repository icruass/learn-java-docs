/**
 * AI 模型配置（DeepSeek，OpenAI 兼容接口）。
 *
 * 在 https://platform.deepseek.com 申请 API Key。
 *
 * ⚠️ 本站是纯静态站点（GitHub Pages）无后端，下面写死的 Key 会进前端产物、
 *    也会进公开仓库。请知悉风险，建议只用额度有限的 Key。
 */
export const AI_CONFIG = {
  /** OpenAI 兼容接口地址（注意下游会再拼 /chat/completions） */
  baseURL: "https://api.deepseek.com",
  /** 主模型 */
  model: "deepseek-chat",
  /** 备用模型：主模型过载重试仍失败时自动降级到它 */
  fallbackModel: "deepseek-chat",
} as const;

/** 👉 在此填入你的 DeepSeek API Key（写死，直接生效）。 */
export const API_KEY = "sk-6b712fa6e8734ccdaa2692247fc51ed7";

/** 取得 API Key。 */
export function getApiKey(): string {
  return API_KEY;
}
