import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const CompletedStudyPage = ({
  recordedStudyTopic,
  studyDuration,
  formatTime,
  recordedMotivation,
  studyStartTime,
  pausedTime
}) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const endTime = studyStartTime ? studyStartTime + (studyDuration * 1000) + pausedTime : null;

  // 学習内容がなければホームページにリダイレクト
  useEffect(() => {
    if (!recordedStudyTopic) {
      navigate("/");
    }
    
    // 5秒後にコンフェティを非表示
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [recordedStudyTopic, navigate]);

  // モチベーションに応じた色を取得
  const getMotivationColor = (level) => {
    const colors = {
      1: "#ff6b6b",
      2: "#ffa06b",
      3: "#ffd06b",
      4: "#9be36b",
      5: "#4CAF50"
    };
    return colors[level] || "#ddd";
  };

  // 学習時間に応じたメッセージを取得
  const getCompletionMessage = () => {
    if (studyDuration < 300) { // 5分未満
      return "短い時間でも、一歩前進です！";
    } else if (studyDuration < 1200) { // 20分未満
      return "素晴らしい集中力でした！";
    } else if (studyDuration < 3600) { // 1時間未満
      return "すごい頑張りました！充実した学習時間でしたね！";
    } else { // 1時間以上
      return "驚異的な集中力です！長時間の学習、本当にお疲れ様でした！";
    }
  };

  // 学習時間のフォーマット
  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${Math.floor(seconds)}秒`;
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    let result = "";
    if (hours > 0) {
      result += `${hours}時間`;
    }
    if (minutes > 0 || hours > 0) {
      result += `${minutes}分`;
    }
    if (remainingSeconds > 0 && hours === 0) {
      result += `${remainingSeconds}秒`;
    }
    
    return result;
  };

  // 日時をフォーマット（完全表示）
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "不明";
    
    const date = new Date(timestamp);
    
    // 曜日の配列
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdays[date.getDay()];
    
    // 年月日
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 時刻
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}年${month}月${day}日(${weekday}) ${hour}:${minute}`;
  };

  return (
    <Layout>
      <div style={styles.container}>
        {showConfetti && (
          <div style={styles.confetti}>
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i}
                style={{
                  ...styles.confettiPiece,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  backgroundColor: ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0'][Math.floor(Math.random() * 5)],
                  animation: `fall ${Math.random() * 3 + 2}s linear forwards, sway ${Math.random() * 2 + 3}s ease-in-out infinite alternate`
                }}
              />
            ))}
          </div>
        )}
        
        <div style={styles.completionCard}>
          <div style={styles.completionHeader}>
            <h1 style={styles.completionTitle}>学習完了！</h1>
            <p style={styles.completionMessage}>{getCompletionMessage()}</p>
          </div>
          
          <div style={styles.summarySection}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>学習内容</span>
              <span style={styles.summaryValue}>{recordedStudyTopic}</span>
            </div>
            
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>学習時間</span>
              <span style={styles.summaryValue}>{formatDuration(studyDuration)}</span>
            </div>
            
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>休憩時間</span>
              <span style={styles.summaryValue}>{formatDuration(pausedTime / 1000)}</span>
            </div>
            
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>開始時間</span>
              <span style={styles.summaryValue}>{formatDateTime(studyStartTime)}</span>
            </div>
            
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>終了時間</span>
              <span style={styles.summaryValue}>{formatDateTime(endTime)}</span>
            </div>
            
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>開始時のモチベーション</span>
              <div 
                style={{
                  ...styles.motivationBadge,
                  backgroundColor: getMotivationColor(recordedMotivation)
                }}
              >
                {recordedMotivation}/5
              </div>
            </div>
          </div>
          
          <div style={styles.actionsSection}>
            <Link to="/" style={styles.homeButton}>
              ホームに戻る
            </Link>
            <Link to="/history" style={styles.historyButton}>
              学習履歴を見る
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  confetti: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 100,
  },
  confettiPiece: {
    position: "absolute",
    top: "-10px",
    borderRadius: "2px",
  },
  completionCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    padding: "30px",
    marginTop: "20px",
    position: "relative",
    zIndex: 10,
  },
  completionHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },
  completionTitle: {
    fontSize: "36px",
    color: "#2196F3",
    margin: 0,
    marginBottom: "10px",
  },
  completionMessage: {
    fontSize: "18px",
    color: "#555",
    margin: 0,
  },
  summarySection: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },
  summaryLabel: {
    fontSize: "16px",
    color: "#666",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: "18px",
    color: "#333",
    fontWeight: "600",
  },
  motivationBadge: {
    display: "inline-block",
    padding: "6px 12px",
    color: "white",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
    minWidth: "50px",
  },
  actionsSection: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  homeButton: {
    padding: "12px 24px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center",
    transition: "background-color 0.3s",
  },
  historyButton: {
    padding: "12px 24px",
    backgroundColor: "#03A9F4",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center",
    transition: "background-color 0.3s",
  },
  "@keyframes fall": {
    "to": {
      top: "100vh",
      transform: "rotate(360deg)",
    }
  },
  "@keyframes sway": {
    "from": {
      transform: "translateX(-10px)",
    },
    "to": {
      transform: "translateX(10px)",
    }
  }
};

export default CompletedStudyPage; 