import { useSyncExternalStore } from "react";
import {
  getRecentDocs,
  subscribeRecentDocs,
  type RecentDoc,
} from "@/utils/recentDocs";

/**
 * 订阅「最近浏览」列表，数据变更时组件自动重渲染。
 *
 * const recent = useRecentDocs();
 */
export function useRecentDocs(): RecentDoc[] {
  return useSyncExternalStore(
    subscribeRecentDocs,
    getRecentDocs,
    getRecentDocs, // SSR/首屏快照，与客户端一致
  );
}
