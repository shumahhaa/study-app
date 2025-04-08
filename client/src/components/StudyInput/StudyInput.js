import React from "react";
import { styles } from "./styles";

const StudyInput = ({ studyTopic, setStudyTopic, motivation, setMotivation }) => {
  const handleMotivationChange = (level) => {
    setMotivation(level);
  };

  const getMotivationColor = (level) => {
    switch (level) {
      case 1:
        return "#e53935"; // Red
      case 2:
        return "#FB8C00"; // Orange
      case 3:
        return "#FFD600"; // Yellow
      case 4:
        return "#7CB342"; // Light Green
      case 5:
        return "#43A047"; // Green
      default:
        return "#e0e0e0"; // Grey
    }
  };

  const getMotivationMessage = (level) => {
    switch (level) {
      case 1:
        return "やる気が出ないですね。無理せず少しだけ始めてみましょう。";
      case 2:
        return "モチベーションが低めです。小さな目標から始めましょう。";
      case 3:
        return "平均的なモチベーションです。コツコツ進めていきましょう。";
      case 4:
        return "モチベーション高いですね！この調子で頑張りましょう。";
      case 5:
        return "最高のモチベーションです！今日は大きな進歩が期待できます！";
      default:
        return "モチベーションレベルを選択してください";
    }
  };

  const renderMotivationMessage = () => {
    if (motivation === 0) return null;

    return (
      <div style={styles.motivationMessageContainer}>
        <div
          style={{
            ...styles.motivationIcon,
            backgroundColor: getMotivationColor(motivation),
          }}
        >
          {motivation}
        </div>
        <p style={styles.motivationMessage}>{getMotivationMessage(motivation)}</p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>学習セッション設定</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          勉強するトピック <span style={styles.required}>*</span>
        </label>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={studyTopic}
            onChange={(e) => setStudyTopic(e.target.value)}
            placeholder="例: React Hooks、微分方程式、英語の過去形..."
            style={styles.input}
            required
          />
        </div>
        {!studyTopic && (
          <p style={styles.helperText}>トピックを入力してください</p>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>現在のモチベーションレベル</label>
        <div style={styles.motivationButtons}>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleMotivationChange(level)}
              style={{
                ...styles.motivationButton,
                backgroundColor:
                  motivation === level
                    ? getMotivationColor(level)
                    : "#f5f5f5",
                color: motivation === level ? "white" : "#333",
                border: `2px solid ${
                  motivation === level ? getMotivationColor(level) : "#ddd"
                }`,
                outline: "none",
              }}
            >
              {level}
            </button>
          ))}
        </div>
        <div style={styles.motivationLabels}>
          <span>低</span>
          <span>高</span>
        </div>
        {renderMotivationMessage()}
      </div>
    </div>
  );
};

export default StudyInput; 