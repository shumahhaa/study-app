import React from 'react';
import styles from './styles';

/**
 * 統計情報表示コンポーネント
 */
const StatsPanel = ({ filteredHistory, formatTime }) => {
  const iconStyle = { width: '80px', height: '80px' };

  return (
    <div style={styles.statsCards}>
      <div style={styles.statsCard}>
        <div style={styles.statsIcon}>
          <img src="/total-study-time.png" alt="" style={iconStyle} />
        </div>
        <div style={styles.statsInfo}>
          <div style={styles.statsValue}>
            {formatTime(filteredHistory.reduce((total, session) => total + session.duration, 0))}
          </div>
        </div>
      </div>
      
      <div style={styles.statsCard}>
        <div style={styles.statsIcon}>
          <img src="/study-session.png" alt="" style={iconStyle} />
        </div>
        <div style={styles.statsInfo}>
          <div style={styles.statsValue}>{filteredHistory.length}回</div>
        </div>
      </div>
      
      <div style={styles.statsCard}>
        <div style={styles.statsIcon}>
          <img src="/average-motivation.png" alt="" style={iconStyle} />
        </div>
        <div style={styles.statsInfo}>
          <div style={styles.statsValue}>
            {filteredHistory.length > 0 
              ? (filteredHistory.reduce((sum, session) => sum + session.motivation, 0) / filteredHistory.length).toFixed(1)
              : "-"
            }/5
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 