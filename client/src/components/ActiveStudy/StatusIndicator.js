import React from 'react';
import styles from './styles';

// 学習状態（学習中/一時停止中）を表示するコンポーネント
const StatusIndicator = ({ isPaused }) => {
  return (
    <div style={styles.statusIndicator}>
      <div 
        style={{
          ...styles.statusDot,
          backgroundColor: isPaused ? "#E0E0E0" : "#4CAF50",
          boxShadow: isPaused ? "none" : "0 0 10px rgba(76, 175, 80, 0.5)"
        }}
      />
      <div style={styles.statusText}>
        {isPaused ? "一時停止中" : "学習中"}
      </div>
    </div>
  );
};

export default StatusIndicator; 