import React, { useEffect, useState } from "react";
import styles from "./index.less";

interface ScrollToggleProps {
  /** 实际的滚动容器（DocLayout 中的内容区 main 元素） */
  scrollRef: React.RefObject<HTMLElement>;
}

/**
 * 右侧内容区的悬浮按钮。
 *
 * 根据滚动进度切换方向：
 * - 内容滚动到 50% 及以下（进度 >= 0.5）→ 点击回到顶部
 * - 否则（进度 < 0.5）→ 点击滚动到底部
 *
 * 内容不足以滚动时（无滚动条）不渲染按钮。
 */
const ScrollToggle: React.FC<ScrollToggleProps> = ({ scrollRef }) => {
  // toTop = true 表示当前进度 >= 50%，点击应回到顶部
  const [toTop, setToTop] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) {
        setVisible(false);
        return;
      }
      setVisible(true);
      const progress = el.scrollTop / scrollable;
      setToTop(progress >= 0.5);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    // 内容高度变化（如切换页面、异步渲染）时重新计算
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [scrollRef]);

  const handleClick = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: toTop ? 0 : el.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className={styles.fab}
      onClick={handleClick}
      aria-label={toTop ? "回到顶部" : "滚动到底部"}
      title={toTop ? "回到顶部" : "滚动到底部"}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={toTop ? "" : styles.flipped}
      >
        <path d="M10 16V4" />
        <path d="M5 9l5-5 5 5" />
      </svg>
    </button>
  );
};

export default ScrollToggle;
