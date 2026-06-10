import React from 'react';
import styles from './doc.less';

interface TableProps {
  /** 表头单元格 */
  head: React.ReactNode[];
  /** 表体，每个元素是一行，行内每个元素是一个单元格 */
  rows: React.ReactNode[][];
  /** 各列对齐方式，可选；长度不足时其余列默认左对齐 */
  align?: Array<'left' | 'center' | 'right'>;
  className?: string;
}

/**
 * 文档表格。外层带横向滚动容器，宽表在窄屏下可滑动；样式随主题切换。
 *
 * <Table head={['列', '说明']} rows={[['id', '主键'], ['name', '姓名']]} />
 */
const Table: React.FC<TableProps> = ({ head, rows, align, className }) => {
  const colAlign = (i: number) => align?.[i] ?? 'left';
  return (
    <div className={`${styles.tableWrap} ${className ?? ''}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th key={i} style={{ textAlign: colAlign(i) }}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} style={{ textAlign: colAlign(c) }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
