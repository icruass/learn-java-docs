import React from "react";
import { ExerciseBrowser } from "@/components/exercise";
import { categories } from "@/pages/java/练习题/index.generated";

/** 「Java 基础练习」专门页：复用共享的 ExerciseBrowser，渲染 java 题库的全部分类。 */
const Exercises: React.FC = () => (
  <article>
    <ExerciseBrowser categories={categories} heading="✍️ Java 基础练习" />
  </article>
);

export default Exercises;
