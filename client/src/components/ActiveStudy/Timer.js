import React from 'react';
import styles from './styles';
import { formatDuration } from './utils';

// 学習時間を表示するコンポーネント
const Timer = ({ studyDuration, isMobile }) => {
  return (
    <div style={isMobile ? styles.timerContainerMobile : styles.timerContainer}>
      {isMobile ? (
        <div style={styles.timerDigital}>
          <div style={styles.timerValueMobile}>{formatDuration(studyDuration)}</div>
        </div>
      ) : (
        <div style={styles.timerCircle}>
          <div style={styles.timerValue}>{formatDuration(studyDuration)}</div>
        </div>
      )}
    </div>
  );
};

export default Timer; 