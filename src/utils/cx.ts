/**
 * 轻量 className 拼接工具，过滤掉 false / undefined / null。
 *   cx('a', cond && 'b', 'c') => 'a c'（cond 为假时）
 */
export function cx(...args: Array<string | false | null | undefined>): string {
  return args.filter(Boolean).join(' ');
}
