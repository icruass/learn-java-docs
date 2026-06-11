import React, { useCallback, useEffect, useState } from 'react';
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
  /** 非全屏时代码区最大高度（px），超出滚动；默认 420 */
  maxHeight?: number;
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
 *  - 超出 maxHeight 自动出现滚动条
 *  - 支持全屏展示
 *  - 支持一键复制
 *  - 支持问答模式（qa）：默认展示问题代码，点击右侧按钮切换查看答案
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'java',
  maxHeight = 420,
  showLineNumbers = true,
  title,
  qa = false,
  answerCode,
}) => {
  const { theme } = useTheme();
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const prismStyle = theme === 'dark' ? oneDark : oneLight;

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
      className={`${styles.wrapper} ${fullscreen ? styles.fullscreen : ''}`}
    >
      <div className={styles.toolbar}>
        <div className={styles.meta}>
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

      <div
        className={styles.scroll}
        style={fullscreen ? undefined : { maxHeight }}
      >
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
  );
};

export default CodeBlock;
