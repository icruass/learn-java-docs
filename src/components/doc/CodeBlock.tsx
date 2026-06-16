import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/hooks/useTheme';
import styles from './CodeBlock.less';

export interface CodeBlockProps {
  /** 代码内容（问答模式下为“问题”的代码） */
  code: string;
  /** 语言，默认 java */
  language?: string;
  /** 是否显示行号 */
  showLineNumbers?: boolean;
  /** 代码块标题（如文件名） */
  title?: string;
  /** 是否开启问答模式：右侧出现切换按钮，先看问题、切换后看答案 */
  qa?: boolean;
  /** 问答模式下“答案”的代码；缺省时切换后仍展示 code */
  answerCode?: string;
}

/**
 * 代码块组件：
 *  - 基于 react-syntax-highlighter（Prism），随主题在 oneDark / oneLight 间切换
 *  - 高度自适应，无纵向滚动条
 *  - 支持顶部左侧折叠按钮收起 / 展开代码
 *  - 支持全屏展示
 *  - 支持一键复制
 *  - 支持问答模式（qa）：默认展示问题代码，点击右侧按钮切换查看答案
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'java',
  showLineNumbers = true,
  title,
  qa = false,
  answerCode,
}) => {
  const { theme } = useTheme();
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);
  const animRef = useRef<number | null>(null);
  // 仅当代码块容器高度 ≥ 视窗高度的 70% 时才展示底部收起按钮（矮代码块无需）
  const [tall, setTall] = useState(false);

  const prismStyle = theme === 'dark' ? oneDark : oneLight;

  // 测量容器高度：≥ 70% 视窗高度则视为「高代码块」，展示底部收起按钮。
  // 折叠/展开、问答切换、内容或窗口尺寸变化都会触发重新测量。
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof window === 'undefined') return;
    const measure = () => {
      setTall(el.offsetHeight >= window.innerHeight * 0.7);
    };
    measure();
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // 折叠/展开动画：用 rAF 同时驱动 max-height（保证「完整收起」）与滚动位置。
  // 收起时仅本块及其下方内容上移，上方内容保持不变（不跳动）；
  // 并把滚动位置收敛到「代码块顶部最多停在视窗顶部（顶栏下方）」，
  // 避免滚到底部时收起导致下方内容越过视窗顶部。
  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    // 首帧直接落到终态，不播放动画
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      el.style.maxHeight = collapsed ? '0px' : 'none';
      return;
    }

    if (animRef.current != null) cancelAnimationFrame(animRef.current);

    const fullH = el.scrollHeight;
    const fromH = collapsed ? fullH : 0;
    const toH = collapsed ? 0 : fullH;

    // 收起时计算目标滚动位置：min(当前, 让代码块顶部对齐到视窗顶部/顶栏下方)。
    // 当前已在块顶部之上（min 命中当前值）时不动滚动，保留「下方内容顶上来」的观感。
    let scroller: HTMLElement | null = null;
    let fromScroll = 0;
    let toScroll = 0;
    if (collapsed) {
      const getScrollParent = (
        node: HTMLElement | null,
      ): HTMLElement | null => {
        let p = node?.parentElement ?? null;
        while (p) {
          const oy = getComputedStyle(p).overflowY;
          if (oy === 'auto' || oy === 'scroll') return p;
          p = p.parentElement;
        }
        return null;
      };
      scroller = getScrollParent(el);
      const wrapper = wrapperRef.current;
      if (scroller && wrapper) {
        const topbarH =
          parseInt(
            getComputedStyle(scroller).getPropertyValue('--doc-topbar-height'),
            10,
          ) || 0;
        const blockTop =
          scroller.scrollTop +
          (wrapper.getBoundingClientRect().top -
            scroller.getBoundingClientRect().top);
        const alignTop = Math.max(0, blockTop - topbarH);
        fromScroll = scroller.scrollTop;
        toScroll = Math.min(fromScroll, alignTop);
      }
    }
    const scrollDelta = toScroll - fromScroll;

    const prefersReduced =
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const finish = () => {
      animRef.current = null;
      el.style.maxHeight = collapsed ? '0px' : 'none';
      if (scroller && scrollDelta) scroller.scrollTop = toScroll;
    };

    if (prefersReduced) {
      finish();
      return;
    }

    const DURATION = 320;
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const e = easeInOut(t);
      el.style.maxHeight = `${fromH + (toH - fromH) * e}px`;
      if (scroller && scrollDelta) scroller.scrollTop = fromScroll + scrollDelta * e;
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        finish();
      }
    };
    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current != null) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, [collapsed]);

  // 问答模式下，切换到答案时展示 answerCode（缺省则回退到 code）
  const displayedCode = qa && showAnswer ? answerCode ?? code : code;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(displayedCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* 忽略复制失败（如非安全上下文） */
    }
  }, [displayedCode]);

  // 全屏时按 ESC 退出，并锁定背景滚动
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreen]);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${fullscreen ? styles.fullscreen : ''}`}
    >
      <div
        className={`${styles.toolbar} ${
          collapsed ? styles.toolbarCollapsed : ''
        }`}
      >
        <div className={styles.meta}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            title={collapsed ? '展开' : '折叠'}
          >
            <span
              className={`${styles.collapseIcon} ${
                collapsed ? styles.collapseIconClosed : ''
              }`}
            >
              ▾
            </span>
          </button>
          <span className={styles.lang}>{title ?? language}</span>
          {qa && (
            <span
              className={`${styles.qaBadge} ${
                showAnswer ? styles.qaBadgeAnswer : ''
              }`}
            >
              {showAnswer ? '答案' : '问题'}
            </span>
          )}
        </div>
        <div className={styles.actions}>
          {qa && (
            <button
              type="button"
              className={`${styles.action} ${styles.qaToggle} ${
                showAnswer ? styles.qaToggleActive : ''
              }`}
              onClick={() => setShowAnswer((v) => !v)}
            >
              {showAnswer ? '← 看问题' : '看答案 →'}
            </button>
          )}
          <button
            type="button"
            className={styles.action}
            onClick={handleCopy}
          >
            {copied ? '已复制 ✓' : '复制'}
          </button>
          <button
            type="button"
            className={styles.action}
            onClick={() => setFullscreen((v) => !v)}
          >
            {fullscreen ? '退出全屏 ✕' : '全屏 ⤢'}
          </button>
        </div>
      </div>

      <div ref={revealRef} className={styles.codeReveal}>
        <div className={styles.code}>
          <SyntaxHighlighter
            language={language}
            style={prismStyle}
            showLineNumbers={showLineNumbers}
            wrapLongLines={false}
            customStyle={{
              margin: 0,
              padding: '16px 18px',
              background: 'transparent',
              fontSize: '13.5px',
              lineHeight: 1.6,
            }}
            codeTagProps={{
              style: { fontFamily: 'var(--font-mono)' },
            }}
          >
            {displayedCode}
          </SyntaxHighlighter>
        </div>
      </div>

      {!collapsed && tall && (
        <div className={styles.collapseFloat}>
          <button
            type="button"
            className={styles.collapseFloatBtn}
            onClick={() => setCollapsed(true)}
            title="收起代码块"
            aria-label="收起代码块"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
