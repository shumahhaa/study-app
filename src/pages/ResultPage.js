import React from "react";
import { Link, useLocation } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const { studyData } = location.state || {};

  if (!studyData) {
    return (
      <div style={styles.container}>
        <h1>エラー</h1>
        <p>学習データが見つかりませんでした。</p>
        <Link to="/" style={styles.link}>
          ホームに戻る
        </Link>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}分 ${remainingSeconds}秒`;
  };

  const getMotivationEmoji = (level) => {
    const emojis = ["😢", "😐", "🙂", "😊", "🤩"];
    return emojis[level - 1] || "🤔";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>学習お疲れ様でした！</h1>
      
      <div style={styles.resultCard}>
        <h2 style={styles.subtitle}>学習結果</h2>
        
        <div style={styles.resultItem}>
          <span style={styles.label}>学習内容：</span>
          <span style={styles.value}>{studyData.topic}</span>
        </div>

        <div style={styles.resultItem}>
          <span style={styles.label}>学習時間：</span>
          <span style={styles.value}>{formatTime(studyData.duration)}</span>
        </div>

        <div style={styles.resultItem}>
          <span style={styles.label}>モチベーション：</span>
          <span style={styles.value}>
            {studyData.motivation}/5 {getMotivationEmoji(studyData.motivation)}
          </span>
        </div>

        <div style={styles.resultItem}>
          <span style={styles.label}>開始時刻：</span>
          <span style={styles.value}>
            {new Date(studyData.startTime).toLocaleString()}
          </span>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <Link to="/" style={styles.link}>
          ホームに戻る
        </Link>
        <Link to="/history" style={styles.link}>
          学習履歴を見る
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: "30px",
  },
  subtitle: {
    color: "#2c3e50",
    borderBottom: "2px solid #3498db",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  resultItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "5px",
  },
  label: {
    fontWeight: "bold",
    minWidth: "120px",
    color: "#34495e",
  },
  value: {
    color: "#2c3e50",
    flex: 1,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  link: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
};

export default ResultPage; 