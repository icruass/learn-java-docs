import { useContext } from 'react';
import { ThemeContext } from '@/components/ThemeProvider';

/**
 * 读取/切换全局主题。必须在 <ThemeProvider> 内部使用。
 *
 * const { theme, toggleTheme } = useTheme();
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme 必须在 <ThemeProvider> 内使用');
  }
  return ctx;
}
