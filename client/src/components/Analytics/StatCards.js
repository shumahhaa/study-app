import React from "react";
import styles from "./styles";

const StatCards = ({ totalStudyTime, filteredHistory, averageMotivation, averageStudyTime, formatTime }) => {
  const iconContainerStyle = { 
    ...styles.statsIcon,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  };
  
  const valueStyle = {
    ...styles.statsValue,
    textAlign: 'center',
  };
  
  return (
    <div style={styles.statsCards}>
      <div style={styles.statsCard}>
        <div style={iconContainerStyle}>
          <img src="/total-study-time.png" alt="" style={{ width: '80px', height: '80px' }} />
        </div>
        <div style={styles.statsInfo}>
          <div style={valueStyle}>{formatTime(totalStudyTime)}</div>
        </div>
      </div>
      
      <div style={styles.statsCard}>
        <div style={iconContainerStyle}>
          <img src="/study-session.png" alt="" style={{ width: '80px', height: '80px' }} />
        </div>
        <div style={styles.statsInfo}>
          <div style={valueStyle}>{filteredHistory.length}回</div>
        </div>
      </div>
      
      <div style={styles.statsCard}>
        <div style={iconContainerStyle}>
          <img src="/average-motivation.png" alt="" style={{ width: '80px', height: '80px' }} />
        </div>
        <div style={styles.statsInfo}>
          <div style={valueStyle}>{averageMotivation.toFixed(1)}/5</div>
        </div>
      </div>
      
      <div style={styles.statsCard}>
        <div style={iconContainerStyle}>
          <img src="/average-study-time.png" alt="" style={{ width: '80px', height: '80px' }} />
        </div>
        <div style={styles.statsInfo}>
          <div style={valueStyle}>{formatTime(averageStudyTime)}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCards; 