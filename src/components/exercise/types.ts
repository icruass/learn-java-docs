/**
 * 练习题数据模型（全站共享）。
 *
 * 各大类（java、mysql…）的练习数据放在 `src/pages/<tech>/练习题/NN-分类.ts`，
 * 统一引用这里的类型；渲染组件（ProblemCard / ExerciseList / ExerciseBrowser /
 * CategoryExercises）也基于这些类型，做到「数据 + 组件」两处共用一套模型。
 */

/** 题目难度 */
export type Difficulty = "简单" | "中等" | "困难";

/** 单道练习题 */
export interface Exercise {
  /** 题目标题 */
  title: string;
  /** 难度 */
  difficulty: Difficulty;
  /** 题干描述 */
  question: string;
  /** 可选：题目给出的代码（如「写出下列代码的输出」「找出错误」） */
  code?: string;
  /** 可选：代码语言（如 "sql"、"java"、"text"；缺省按 java 高亮，对 code 与 answerCode 同时生效） */
  language?: string;
  /** 可选：解题提示 */
  hint?: string;
  /** 参考答案 / 解析（文字） */
  answer: string;
  /** 可选：参考答案代码 */
  answerCode?: string;
  /** 可选：知识点标签 */
  tags?: string[];
}

/** 一个练习分类（对应教程章节） */
export interface ExerciseCategory {
  /** 唯一标识（路由 / 状态用，英文） */
  key: string;
  /** 分类显示名（与教程章节一致，如「入门基础」） */
  name: string;
  /** 该分类下的所有题目 */
  problems: Exercise[];
}
