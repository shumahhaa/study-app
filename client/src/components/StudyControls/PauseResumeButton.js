import React from "react";
import { baseButtonStyle, styles } from "./styles";

/**
 * 一時停止・再開ボタンコンポーネント
 */
const PauseResumeButton = ({ isPaused, onPause, onResume }) => {
  return isPaused ? (
    <button
      onClick={onResume}
      style={{
        ...baseButtonStyle,
        ...styles.resumeButton,
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "lightblue")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "blue")}
    >
      ▶ 再開
    </button>
  ) : (
    <button
      onClick={onPause}
      style={{
        ...baseButtonStyle,
        ...styles.pauseButton,
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "gold")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "orange")}
    >
      ⏸ 一時停止
    </button>
  );
};

export default PauseResumeButton; 