import React from "react";
import styles from "./styles";

const StatCards = ({ totalStudyTime, filteredHistory, averageMotivation, averageStudyTime, formatTime }) => {
  return (
    <div style={styles.statsCards}>
      <div style={styles.statsCard}>
        <div style={styles.statsIcon}>⏱️</div>
        <div style={styles.statsInfo}>
          <h3 style={styles.statsTitle}>合計学習時間</h3>
          <div style={styles.statsValue}>{formatTime(totalStudyTime)}</div>
        </div>
      </div>
      
      <div style={styles.statsCard}>
        <div style={styles.statsIcon}>📚</div>
        <div style={styles.statsInfo}>
          <h3 style={styles.statsTitle}>学習セッション数</h3>
          <div style={styles.statsValue}>{filteredHistory.length}回</div>
        </div>
      </div>
      
      <div style={styles.statsCard}>
        <div style={styles.statsIcon}>⚡</div>
        <div style={styles.statsInfo}>
          <h3 style={styles.statsTitle}>平均モチベーション</h3>
          <div style={styles.statsValue}>{averageMotivation.toFixed(1)}/5</div>
        </div>
      </div>
      
      <div style={styles.statsCard}>
        <div style={styles.statsIcon}>⚡</div>
        <div style={styles.statsInfo}>
          <h3 style={styles.statsTitle}>平均学習時間</h3>
          <div style={styles.statsValue}>{formatTime(averageStudyTime)}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCards; 