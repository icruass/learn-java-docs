/**
 * 练习题组件统一出口。
 * 页面里这样使用：
 *   import { ExerciseBrowser, CategoryExercises } from '@/components/exercise';
 */
export { default as ProblemCard } from "./ProblemCard";
export type { ProblemCardProps } from "./ProblemCard";
export { default as ExerciseList } from "./ExerciseList";
export type { ExerciseListProps } from "./ExerciseList";
export { default as ExerciseBrowser } from "./ExerciseBrowser";
export type { ExerciseBrowserProps } from "./ExerciseBrowser";
export { default as CategoryExercises } from "./CategoryExercises";
export type { CategoryExercisesProps } from "./CategoryExercises";

export type { Exercise, ExerciseCategory, Difficulty } from "./types";
