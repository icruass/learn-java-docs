import React, { useState } from "react";
import type { ExerciseCategory } from "./types";
import ExerciseList from "./ExerciseList";
import styles from "./exercise.less";

export interface ExerciseBrowserProps {
  /** 要展示的分类（如某个大类的全部分类） */
  categories: ExerciseCategory[];
  /** 顶部标题；传 null 隐藏页头 */
  heading?: string | null;
}

/**
 * 练习浏览器：顶部横向滚动的分类卡片（一级，点击切换），下方列出该分类的全部题目。
 * 用于「专门练习页」。
 */
const ExerciseBrowser: React.FC<ExerciseBrowserProps> = ({
  categories,
  heading = null,
}) => {
  const [activeKey, setActiveKey] = useState(categories[0]?.key ?? "");
  const active = categories.find((c) => c.key === activeKey) ?? categories[0];

  return (
    <div className={styles.page}>
      {heading !== null && (
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{heading}</h1>
        </header>
      )}

      {/* 顶部横向滚动的分类卡片（一级菜单） */}
      <div className={styles.catScroller} role="tablist" aria-label="练习分类">
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={c.key === active?.key}
            className={`${styles.catCard} ${
              c.key === active?.key ? styles.catCardActive : ""
            }`}
            onClick={() => setActiveKey(c.key)}
          >
            <span className={styles.catName}>{c.name}</span>
            <span className={styles.catCount}>{c.problems.length} 题</span>
          </button>
        ))}
      </div>

      {/* 选中分类的题目列表 */}
      <ExerciseList
        problems={active?.problems ?? []}
        emptyText="该分类暂无题目。"
      />
    </div>
  );
};

export default ExerciseBrowser;
