import React from 'react';
import styles from './doc.less';

export type CalloutType =
  | 'tip' // 💡 提示
  | 'warning' // ⚠️ 注意
  | 'danger' // 🕳️ 常见坑
  | 'success' // ✅ 总结 / 结论
  | 'note'; // 📌 预告 / 其它

interface CalloutProps {
  type?: CalloutType;
  /** 标题（如「提示」「注意」「常见坑」），不传则用类型默认文案 */
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const META: Record<CalloutType, { icon: string; label: string; cls: string }> = {
  tip: { icon: '💡', label: '提示', cls: 'calloutTip' },
  warning: { icon: '⚠️', label: '注意', cls: 'calloutWarning' },
  danger: { icon: '🕳️', label: '常见坑', cls: 'calloutDanger' },
  success: { icon: '✅', label: '总结', cls: 'calloutSuccess' },
  note: { icon: '📌', label: '说明', cls: 'calloutNote' },
};

/**
 * 提示框 / 引用块。对应 markdown 里的 > 💡提示 / ⚠️注意 / 🕳️常见坑 / ✅总结 / 📌预告。
 *
 * <Callout type="warning">软件 ≠ 数据库，别再混了。</Callout>
 */
const Callout: React.FC<CalloutProps> = ({
  type = 'note',
  title,
  children,
  className,
}) => {
  const meta = META[type];
  return (
    <div className={`${styles.callout} ${styles[meta.cls]} ${className ?? ''}`}>
      <div className={styles.calloutTitle}>
        <span className={styles.calloutIcon}>{meta.icon}</span>
        <span>{title ?? meta.label}</span>
      </div>
      <div className={styles.calloutBody}>{children}</div>
    </div>
  );
};

export default Callout;
