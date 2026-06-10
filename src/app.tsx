import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";

/**
 * Umi 运行时配置。
 * rootContainer 包裹整个应用，在这里挂上全局的 ThemeProvider，
 * 使所有页面与组件都能通过 useTheme 访问/切换主题。
 */
export function rootContainer(container: React.ReactNode) {
  return <ThemeProvider>{container}</ThemeProvider>;
}
