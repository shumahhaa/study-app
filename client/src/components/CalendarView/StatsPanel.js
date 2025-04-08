import React from 'react';
import styles from './styles';
import PieChart from './PieChart';

const StatsPanel = ({ selectedDateSessions, topicDistribution, formatTime }) => {
  if (selectedDateSessions.length === 0) {
    return null;
  }

  return (
    <div style={styles.sessionsSummary}>
      <div style={styles.summaryCard}>
        <div style={styles.statsSummary}>
          <div style={styles.summaryHeader}>学習概要</div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>合計学習時間</span>
            <span style={styles.summaryValue}>
              {formatTime(selectedDateSessions.reduce((sum, session) => sum + session.duration, 0))}
            </span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>学習セッション数</span>
            <span style={styles.summaryValue}>{selectedDateSessions.length}回</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>平均モチベーション</span>
            <span style={styles.summaryValue}>
              {(selectedDateSessions.reduce((sum, session) => sum + session.motivation, 0) / selectedDateSessions.length).toFixed(1)}/5
            </span>
          </div>
        </div>
      </div>
      
      <div style={styles.summaryCard}>
        <div style={styles.pieChartHeader}>学習内容の分布</div>
        <PieChart 
          topicDistribution={topicDistribution} 
          formatTime={formatTime} 
        />
      </div>
    </div>
  );
};

export default StatsPanel; 