import React from 'react';
import styles from './styles';
import { formatDuration } from './utils';

// 学習時間を表示するコンポーネント
const Timer = ({ studyDuration, isMobile, isPaused, pauseStudy, resumeStudy }) => {
  const handleTimerClick = () => {
    if (isPaused) {
      resumeStudy();
    } else {
      pauseStudy();
    }
  };

  return (
    <div style={isMobile ? styles.timerContainerMobile : styles.timerContainer}>
      {isMobile ? (
        <div 
          style={{
            ...styles.timerDigital,
            ...(isPaused && styles.timerPaused),
            cursor: 'pointer'
          }}
          onClick={handleTimerClick}
        >
          <div style={styles.timerValueMobile}>{formatDuration(studyDuration)}</div>
          {isPaused && <div style={styles.pausedIndicator}>一時停止中</div>}
        </div>
      ) : (
        <div 
          style={{
            ...styles.timerCircle,
            ...(isPaused && styles.timerPaused),
            cursor: 'pointer'
          }}
          onClick={handleTimerClick}
        >
          <div style={styles.timerValue}>{formatDuration(studyDuration)}</div>
          {isPaused && <div style={styles.pausedIndicator}>一時停止中</div>}
        </div>
      )}
    </div>
  );
};

export default Timer; 