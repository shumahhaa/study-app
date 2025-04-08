import React from "react";
import { styles } from "./styles";

/**
 * 学習時間表示コンポーネント
 */
const TimeDisplay = ({ isPaused, duration, formatTime }) => {
  return (
    <p style={{ 
      ...styles.timeDisplay,
      ...(isPaused ? styles.pausedTimeDisplay : styles.activeTimeDisplay)
    }}>
      経過時間： {formatTime(duration)}
    </p>
  );
};

export default TimeDisplay; 