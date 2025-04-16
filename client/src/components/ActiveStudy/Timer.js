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

  // モバイル用のタイマーポーズスタイル（背景透明維持）
  const mobileTimerPausedStyle = {
    border: "2px solid rgba(255, 165, 0, 0.3)",
    boxShadow: "none",
    background: "transparent"
  };

  return (
    <div style={isMobile ? styles.timerContainerMobile : styles.timerContainer}>
      {isMobile ? (
        <div 
          style={{
            ...styles.timerDigital,
            ...(isPaused && mobileTimerPausedStyle),
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '80px',
            boxSizing: 'border-box'
          }}
          onClick={handleTimerClick}
        >
          <div style={styles.timerValueMobile}>{formatDuration(studyDuration)}</div>
          <div style={{ 
            ...styles.pausedIndicator, 
            visibility: isPaused ? 'visible' : 'hidden',
            opacity: isPaused ? 1 : 0,
            height: '20px'
          }}>
            一時停止中
          </div>
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