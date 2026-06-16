import React from "react";
import type { Exercise } from "./types";
import ProblemCard from "./ProblemCard";
import styles from "./exercise.less";

export interface ExerciseListProps {
  problems: Exercise[];
  /** 是否显示题号（默认显示，从 1 开始） */
  numbered?: boolean;
  /** 空列表时的占位文案 */
  emptyText?: string;
}

/** 题目列表：把一组题目渲染成卡片。供练习页与文档内嵌共用。 */
const ExerciseList: React.FC<ExerciseListProps> = ({
  problems,
  numbered = true,
  emptyText = "暂无题目。",
}) => {
  if (!problems || problems.length === 0) {
    return <div className={styles.empty}>{emptyText}</div>;
  }
  return (
    <div className={styles.problems}>
      {problems.map((p, i) => (
        <ProblemCard
          key={`${p.title}-${i}`}
          problem={p}
          index={numbered ? i + 1 : undefined}
        />
      ))}
    </div>
  );
};

export default ExerciseList;
