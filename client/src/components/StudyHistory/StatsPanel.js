import React from 'react';
import styles from './styles';

/**
 * 統計情報表示コンポーネント
 */
const StatsPanel = ({ filteredHistory, formatTime }) => {
  return (
    <div style={styles.stats}>
      <div style={styles.statItem}>
        <span style={styles.statLabel}>合計学習時間</span>
        <span style={styles.statValue}>
          {formatTime(filteredHistory.reduce((total, session) => total + session.duration, 0))}
        </span>
      </div>
      <div style={styles.statItem}>
        <span style={styles.statLabel}>学習回数</span>
        <span style={styles.statValue}>{filteredHistory.length}回</span>
      </div>
      <div style={styles.statItem}>
        <span style={styles.statLabel}>平均モチベーション</span>
        <span style={styles.statValue}>
          {filteredHistory.length > 0 
            ? (filteredHistory.reduce((sum, session) => sum + session.motivation, 0) / filteredHistory.length).toFixed(1)
            : "-"
          }/5
        </span>
      </div>
    </div>
  );
};

export default StatsPanel; 