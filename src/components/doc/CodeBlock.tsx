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
  // 仅当容器高度 ≥ 视口高度的 50% 时才启用工具栏吸顶（矮代码块无需吸顶）
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [stickyEnabled, setStickyEnabled] = useState(false);

  const prismStyle = theme === 'dark' ? oneDark : oneLight;

  // 测量容器高度，按「≥ 50% 视口高度」决定是否吸顶；
  // 折叠 / 展开 / 全屏切换、内容或窗口尺寸变化都会触发重新测量
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof window === 'undefined') return;
    const measure = () => {
      setStickyEnabled(el.offsetHeight >= window.innerHeight * 0.5);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

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
      className={`${styles.wrapper} ${fullscreen ? styles.fullscreen : ''} ${
        stickyEnabled ? styles.stickyEnabled : ''
      }`}
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

      {!collapsed && (
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
      )}
    </div>
  );
};

export default CodeBlock;
