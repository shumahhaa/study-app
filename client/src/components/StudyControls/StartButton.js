import React from "react";
import { baseButtonStyle, styles } from "./styles";

/**
 * 学習開始ボタンコンポーネント
 */
const StartButton = ({ isStudying, studyTopic, onClick }) => {
  const isDisabled = isStudying || studyTopic.trim() === "";
  
  return (
    <button 
      onClick={onClick} 
      disabled={isDisabled}
      style={{
        ...baseButtonStyle,
        ...(isDisabled ? styles.disabledStartButton : styles.startButton)
      }}
      onMouseOver={(e) => !isDisabled && (e.target.style.backgroundColor = "lightgreen")}
      onMouseOut={(e) => !isDisabled && (e.target.style.backgroundColor = "green")}
    >
      学習開始
    </button>
  );
};

export default StartButton; 