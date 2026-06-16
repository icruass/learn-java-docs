import React from "react";
import { CategoryExercises } from "@/components/exercise";
import { categories } from "./index.generated";

/**
 * Java 章节底部「本章练习」组件（已绑定 java 题库）。
 * 在任意 Java 文档页底部这样引用即可：
 *   import ChapterExercises from "@/pages/java/练习题/ChapterExercises";
 *   <ChapterExercises categoryKey="basics" />
 */
const ChapterExercises: React.FC<{ categoryKey: string; title?: string }> = ({
  categoryKey,
  title,
}) => (
  <CategoryExercises
    categories={categories}
    categoryKey={categoryKey}
    title={title}
  />
);

export default ChapterExercises;
