import React from "react";
import { styles } from "./styles";

const StudyInput = ({
  studyTopic,
  setStudyTopic,
  motivation,
  setMotivation
}) => {
  // モチベーションレベルの設定（1〜5）
  const handleMotivationChange = (level) => {
    setMotivation(level);
  };

  // モチベーションに応じた色を取得
  const getMotivationColor = (level) => {
    const colors = {
      1: "#ff6b6b", // 低いモチベーション（赤）
      2: "#ffa06b", // やや低いモチベーション（オレンジ）
      3: "#ffd06b", // 普通のモチベーション（黄色）
      4: "#9be36b", // やや高いモチベーション（黄緑）
      5: "#4CAF50"  // 高いモチベーション（緑）
    };
    return colors[level] || "#ddd";
  };

  // モチベーションレベルに応じたメッセージ
  const getMotivationMessage = (level) => {
    const messages = {
      1: "今日は少しだけでも良い。始めることが大切。",
      2: "小さな一歩から始めよう。短時間でも質の高い学習を。",
      3: "コツコツ続けることが、大きな成果につながる。",
      4: "一歩一歩、確実に前進しよう。今日の学びが未来を変える。",
      5: "今日のあなたなら、どんな難題も乗り越えられる！"
    };
    return messages[level] || "";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>新しい学習セッションを始める</h2>
      
      <div style={styles.formGroup}>
        <label htmlFor="studyTopic" style={styles.label}>
          学習内容
        </label>
        <div style={styles.inputWrapper}>
          <input
            id="studyTopic"
            type="text"
            value={studyTopic}
            onChange={(e) => setStudyTopic(e.target.value)}
            placeholder="例: TOEIC、数学、簿記２級..."
            className="study-topic-input"
            required
          />
        </div>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>
          モチベーション
        </label>
        <div style={styles.motivationButtons}>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              className={`motivation-button ${motivation === level ? 'active' : ''}`}
              data-level={level}
              onClick={() => handleMotivationChange(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      
      {motivation > 0 && (
        <div style={styles.motivationMessageContainer}>
          <div style={{
            ...styles.motivationIcon,
            backgroundColor: getMotivationColor(motivation)
          }}>
            {motivation >= 4 ? "✨" : motivation >= 2 ? "👍" : "🚶"}
          </div>
          <p style={styles.motivationMessage}>
            {getMotivationMessage(motivation)}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudyInput; 