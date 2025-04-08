import React from 'react';
import styles from './styles';

const CompletionHeader = () => {
  return (
    <div style={styles.completionHeader}>
      <div style={styles.completionIcon}>✓</div>
      <h1 style={styles.completionTitle}>学習完了</h1>
      <p style={styles.completionSubtitle}>お疲れ様でした！また一歩成長しました！</p>
    </div>
  );
};

export default CompletionHeader; 