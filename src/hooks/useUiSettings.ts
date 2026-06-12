import { useSyncExternalStore } from "react";
import {
  getUiSettings,
  subscribeUiSettings,
  type UiSettings,
} from "@/utils/uiSettings";

/**
 * 订阅「界面设置」，数据变更时组件自动重渲染。
 *
 * const settings = useUiSettings();
 */
export function useUiSettings(): UiSettings {
  return useSyncExternalStore(
    subscribeUiSettings,
    getUiSettings,
    getUiSettings, // SSR/首屏快照，与客户端一致
  );
}
