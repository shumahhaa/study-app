import React from 'react';
import styles from './styles';
import { formatDuration } from './utils';

// 学習時間を表示するコンポーネント
const Timer = ({ studyDuration }) => {
  return (
    <div style={styles.timerContainer}>
      <div style={styles.timerCircle}>
        <div style={styles.timerValue}>{formatDuration(studyDuration)}</div>
      </div>
    </div>
  );
};

export default Timer; 