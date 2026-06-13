import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ThemeMode = "light" | "dark";

/** 主题切换动画的圆心（视口坐标），用于 View Transitions 的扩散揭示。 */
export interface TransitionOrigin {
  x: number;
  y: number;
}

export interface ThemeContextValue {
  theme: ThemeMode;
  /** 设置主题；可传切换动画的圆心（一般为开关中心） */
  setTheme: (mode: ThemeMode, origin?: TransitionOrigin) => void;
  /** 在亮/暗之间切换；可传切换动画的圆心 */
  toggleTheme: (origin?: TransitionOrigin) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "doc-theme";
/** 兜底过渡（无 View Transitions 时）给 <html> 挂的临时类，需与 theme.less 对应 */
const TRANSITION_CLASS = "theme-transition";
/** 兜底过渡时长（ms），略大于 --theme-transition-duration(0.45s) 以确保淡变完成后再移除类 */
const TRANSITION_MS = 480;
/** View Transitions 扩散揭示时长（ms） */
const REVEAL_MS = 500;

/** 读取初始主题：localStorage > 系统偏好 > 默认暗色 */
function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (saved === "light" || saved === "dark") return saved;
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches)
    return "dark";
  return "dark";
}

/** 把主题写到 <html data-theme> 上，CSS 变量据此切换 */
function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", mode);
}

/** 是否开启了「减少动效」系统偏好 */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  // 用 ref 持有最新主题，让 setTheme/toggleTheme 保持稳定引用又能读到当前值
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    applyTheme(theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode, origin?: TransitionOrigin) => {
    if (mode === themeRef.current) return;

    // 尊重「减少动效」偏好 / 非浏览器环境：直接切换，无任何过渡
    if (typeof document === "undefined" || prefersReducedMotion()) {
      setThemeState(mode);
      return;
    }

    const root = document.documentElement;
    const startViewTransition = (
      document as unknown as {
        startViewTransition?: (cb: () => void) => {
          ready?: Promise<void>;
        };
      }
    ).startViewTransition?.bind(document);

    // 现代浏览器 + 已知圆心：以开关为圆心做 clip-path 扩散揭示，最丝滑
    if (startViewTransition && origin) {
      const transition = startViewTransition(() => {
        // 全部在快照回调内改 DOM：浏览器先捕获旧快照，再执行此回调，最后捕获新快照。
        // 放在这里可保证「旧主题」快照不被提前发生的 React 提交污染（否则会无揭示动画）。
        applyTheme(mode);
        setThemeState(mode);
      });
      transition.ready
        ?.then(() => {
          const endRadius = Math.hypot(
            Math.max(origin.x, window.innerWidth - origin.x),
            Math.max(origin.y, window.innerHeight - origin.y),
          );
          root.animate(
            {
              clipPath: [
                `circle(0px at ${origin.x}px ${origin.y}px)`,
                `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`,
              ],
            },
            {
              duration: REVEAL_MS,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              pseudoElement: "::view-transition-new(root)",
            } as KeyframeAnimationOptions,
          );
        })
        .catch(() => {
          /* 动画失败不影响主题已切换的事实 */
        });
      return;
    }

    // 兜底（不支持 View Transitions 或无圆心）：临时挂过渡类做全局颜色柔和淡变
    root.classList.add(TRANSITION_CLASS);
    window.setTimeout(
      () => root.classList.remove(TRANSITION_CLASS),
      TRANSITION_MS,
    );
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(
    (origin?: TransitionOrigin) => {
      setTheme(themeRef.current === "dark" ? "light" : "dark", origin);
    },
    [setTheme],
  );

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
