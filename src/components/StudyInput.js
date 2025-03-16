import React from "react";

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
          学習内容 <span style={styles.required}>*</span>
        </label>
        <div style={styles.inputWrapper}>
          <input
            id="studyTopic"
            type="text"
            value={studyTopic}
            onChange={(e) => setStudyTopic(e.target.value)}
            placeholder="例: TOEIC、数学、簿記２級..."
            style={styles.input}
            required
          />
          {!studyTopic && <p style={styles.helperText}>学習する内容を入力してください</p>}
        </div>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>
          今日のモチベーション
        </label>
        <div style={styles.motivationButtons}>
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              style={{
                ...styles.motivationButton,
                backgroundColor: motivation === level ? getMotivationColor(level) : "#f5f5f5",
                color: motivation === level ? "white" : "#333"
              }}
              onClick={() => handleMotivationChange(level)}
            >
              {level}
            </button>
          ))}
        </div>
        <div style={styles.motivationLabels}>
          <span>低</span>
          <span>高</span>
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

const styles = {
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "25px"
  },
  heading: {
    fontSize: "20px",
    color: "#333",
    marginTop: 0,
    marginBottom: "20px",
    borderBottom: "1px solid #eaeaea",
    paddingBottom: "10px"
  },
  formGroup: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "8px",
    color: "#444"
  },
  required: {
    color: "#e53935",
    fontSize: "14px"
  },
  inputWrapper: {
    position: "relative"
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    transition: "border 0.3s, box-shadow 0.3s",
    outlineColor: "#4CAF50"
  },
  helperText: {
    margin: "5px 0 0 0",
    fontSize: "14px",
    color: "#e53935"
  },
  motivationButtons: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "5px"
  },
  motivationButton: {
    flex: 1,
    padding: "12px 0",
    border: "none",
    borderRadius: "6px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  motivationLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#666",
    marginTop: "5px"
  },
  motivationMessageContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: "6px",
    padding: "12px 15px",
    marginTop: "15px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  motivationIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "15px",
    color: "white",
    fontSize: "18px"
  },
  motivationMessage: {
    margin: 0,
    color: "#333",
    fontWeight: "500",
    fontSize: "16px"
  }
};

export default StudyInput;
