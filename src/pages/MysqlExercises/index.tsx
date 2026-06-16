import React from "react";
import { ExerciseBrowser } from "@/components/exercise";
import { categories } from "@/pages/mysql/练习题/index.generated";

/** 「MySQL 基础练习」专门页：复用共享的 ExerciseBrowser，渲染 mysql 题库的全部分类。 */
const MysqlExercises: React.FC = () => (
  <article>
    <ExerciseBrowser categories={categories} heading="✍️ MySQL 基础练习" />
  </article>
);

export default MysqlExercises;
