import React from "react";
import type { ExerciseCategory } from "./types";
import ExerciseList from "./ExerciseList";
import styles from "./exercise.less";

export interface CategoryExercisesProps {
  /** 在其中查找的分类集合（某大类的全部分类） */
  categories: ExerciseCategory[];
  /** 要展示的分类 key（如 "basics"、"oop"） */
  categoryKey: string;
  /** 自定义标题，缺省为「本章练习 · 分类名」 */
  title?: string;
  /** 是否显示标题（默认显示） */
  showTitle?: boolean;
}

/**
 * 按分类 key 取出题目并渲染，用于「文档章节底部内嵌本章练习」。
 * 找不到对应分类时不渲染任何内容。
 */
const CategoryExercises: React.FC<CategoryExercisesProps> = ({
  categories,
  categoryKey,
  title,
  showTitle = true,
}) => {
  const category = categories.find((c) => c.key === categoryKey);
  if (!category) return null;

  return (
    <section className={styles.embed}>
      {showTitle && (
        <h2 className={styles.embedTitle}>
          ✍️ {title ?? `本章练习 · ${category.name}`}
        </h2>
      )}
      <ExerciseList problems={category.problems} />
    </section>
  );
};

export default CategoryExercises;
