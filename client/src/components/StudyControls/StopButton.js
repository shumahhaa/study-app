import React from "react";
import { baseButtonStyle, styles } from "./styles";

/**
 * 学習終了ボタンコンポーネント
 */
const StopButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      style={{
        ...baseButtonStyle,
        ...styles.stopButton,
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "lightcoral")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "red")}
    >
      学習終了
    </button>
  );
};

export default StopButton; 