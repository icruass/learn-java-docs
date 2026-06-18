/**
 * AI 模型配置（Google Gemini，走 OpenAI 兼容接口）。
 *
 * 免费额度：在 https://aistudio.google.com/apikey 免费申请 API Key，
 * Gemini Flash 系列有相当大方的免费额度，个人学习场景基本够用。
 *
 * ⚠️ 本站是纯静态站点（GitHub Pages）无后端，下面写死的 Key 会进前端产物、
 *    也会进公开仓库。因为是免费 Key，被刷也不心疼；但仍建议只用免费额度的 Key。
 */
export const AI_CONFIG = {
  /** OpenAI 兼容接口地址（注意结尾的 /openai，下游会再拼 /chat/completions） */
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  /** 主模型：免费额度可用 gemini-2.5-flash */
  model: "gemini-2.5-flash",
  /** 备用模型：主模型 503 过载重试仍失败时自动降级到它（通常更空闲） */
  fallbackModel: "gemini-2.0-flash",
} as const;

/** 👉 在此填入你的 Gemini API Key（写死，直接生效）。 */
export const API_KEY = "AIzaSyAM__Mvm9rmb8EjwqEcXDyoHVz2JJzra_g";

/** 取得 API Key。 */
export function getApiKey(): string {
  return API_KEY;
}
