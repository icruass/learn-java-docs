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
