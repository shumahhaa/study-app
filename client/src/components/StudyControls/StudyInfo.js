import React from "react";
import { styles } from "./styles";

/**
 * 学習情報表示コンポーネント
 */
const StudyInfo = ({ topic, duration, motivation, formatTime }) => {
  return (
    <div style={styles.studyInfo}>
      <p>学習内容： {topic}</p>
      <p>最終学習時間: {formatTime(duration)}</p>
      <p>学習開始時のモチベーション： {motivation}/5</p>
    </div>
  );
};

export default StudyInfo; 