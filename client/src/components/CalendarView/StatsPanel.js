import React from 'react';
import styles from './styles';
import PieChart from './PieChart';

const StatsPanel = ({ selectedDateSessions, topicDistribution, formatTime }) => {
  if (selectedDateSessions.length === 0) {
    return null;
  }

  // 合計学習時間を計算
  const totalStudyTime = selectedDateSessions.reduce((sum, session) => sum + session.duration, 0);
  
  // 平均学習時間を計算（セッション数で割る）
  const averageStudyTime = Math.round(totalStudyTime / selectedDateSessions.length);
  
  // 平均モチベーションを計算
  const averageMotivation = (selectedDateSessions.reduce((sum, session) => sum + session.motivation, 0) / selectedDateSessions.length).toFixed(1);

  return (
    <div style={styles.sessionsSummary}>
      {/* 2×2のカード形式で学習概要を表示 */}
      <div style={styles.statsCardsGrid}>
        {/* 合計学習時間カード */}
        <div style={styles.statsCard}>
          <img 
            src="/total-study-time.png" 
            alt="合計学習時間"
            style={styles.statsCardIcon}
          />
          <div style={styles.statsCardContent}>
            <div style={styles.statsCardValue}>{formatTime(totalStudyTime)}</div>
          </div>
        </div>
        
        {/* 学習セッション数カード */}
        <div style={styles.statsCard}>
          <img 
            src="/study-session.png" 
            alt="学習セッション数"
            style={styles.statsCardIcon}
          />
          <div style={styles.statsCardContent}>
            <div style={styles.statsCardValue}>{selectedDateSessions.length}回</div>
          </div>
        </div>
        
        {/* 平均モチベーションカード */}
        <div style={styles.statsCard}>
          <img 
            src="/average-motivation.png" 
            alt="平均モチベーション"
            style={styles.statsCardIcon}
          />
          <div style={styles.statsCardContent}>
            <div style={styles.statsCardValue}>{averageMotivation}/5</div>
          </div>
        </div>
        
        {/* 平均学習時間カード */}
        <div style={styles.statsCard}>
          <img 
            src="/average-study-time.png" 
            alt="平均学習時間"
            style={styles.statsCardIcon}
          />
          <div style={styles.statsCardContent}>
            <div style={styles.statsCardValue}>{formatTime(averageStudyTime)}</div>
          </div>
        </div>
      </div>
      
      {/* 学習内容の分布（topicDistributionが空の場合は表示しない） */}
      {topicDistribution.length > 0 && (
        <div style={{
          ...styles.summaryCard,
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 15px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{...styles.pieChartHeader, fontSize: '18px', color: '#000000', textAlign: 'center'}}>学習内容の分布</div>
          <PieChart 
            topicDistribution={topicDistribution} 
            formatTime={formatTime} 
          />
        </div>
      )}
    </div>
  );
};

export default StatsPanel; 