import React, { useState } from "react";
import { CodeBlock } from "@/components/doc";
import type { Exercise } from "./types";
import styles from "./exercise.less";

/** 难度 → 样式类 */
const DIFF_CLASS: Record<string, string> = {
  简单: styles.diffEasy,
  中等: styles.diffMedium,
  困难: styles.diffHard,
};

export interface ProblemCardProps {
  problem: Exercise;
  /** 题号（从 1 开始显示）；不传则不显示序号圆点 */
  index?: number;
}

/** 单道题目卡片：题干 + 可选代码 + 可折叠的答案/解析。供练习页与文档内嵌共用。 */
const ProblemCard: React.FC<ProblemCardProps> = ({ problem, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {typeof index === "number" && (
          <span className={styles.cardIndex}>{index}</span>
        )}
        <h3 className={styles.cardTitle}>{problem.title}</h3>
        <span className={`${styles.diff} ${DIFF_CLASS[problem.difficulty] ?? ""}`}>
          {problem.difficulty}
        </span>
      </div>

      <p className={styles.question}>{problem.question}</p>
      {problem.code && <CodeBlock code={problem.code} />}

      {problem.hint && <p className={styles.hint}>💡 提示：{problem.hint}</p>}

      <button
        type="button"
        className={styles.answerToggle}
        onClick={() => setShowAnswer((v) => !v)}
        aria-expanded={showAnswer}
      >
        {showAnswer ? "收起答案 ▲" : "查看答案 / 解析 ▼"}
      </button>

      {showAnswer && (
        <div className={styles.answer}>
          {problem.answer && <p className={styles.answerText}>{problem.answer}</p>}
          {problem.answerCode && (
            <CodeBlock title="参考答案" code={problem.answerCode} />
          )}
        </div>
      )}

      {problem.tags && problem.tags.length > 0 && (
        <div className={styles.tags}>
          {problem.tags.map((t) => (
            <span key={t} className={styles.tag}>
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemCard;
