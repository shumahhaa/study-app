import React, { useEffect } from "react";
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
  const endTime = studyStartTime ? studyStartTime + (studyDuration * 1000) + pausedTime : null;

  // 学習内容がなければホームページにリダイレクト
  useEffect(() => {
    if (!recordedStudyTopic) {
      navigate("/");
    }
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
        <div style={styles.completionCard}>
          <div style={styles.completionHeader}>
            <div style={styles.completionIcon}>✓</div>
            <h1 style={styles.completionTitle}>学習完了</h1>
            <p style={styles.completionSubtitle}>お疲れ様でした！また一歩成長しました！</p>
          </div>
          
          <div style={styles.summarySection}>
            <table style={styles.summaryTable}>
              <tbody>
                <tr style={styles.tableRow}>
                  <td style={styles.tableLabel}>学習内容:</td>
                  <td style={styles.tableValue}>{recordedStudyTopic}</td>
                </tr>
                
                <tr style={styles.tableRow}>
                  <td style={styles.tableLabel}>モチベーション:</td>
                  <td style={styles.tableValue}>
                    <strong>{recordedMotivation}/5</strong>
                  </td>
                </tr>
                
                <tr style={styles.tableRow}>
                  <td style={styles.tableLabel}>学習時間:</td>
                  <td style={styles.tableValue}>{formatDuration(studyDuration)}</td>
                </tr>
                
                <tr style={styles.tableRow}>
                  <td style={styles.tableLabel}>休憩時間:</td>
                  <td style={styles.tableValue}>{formatDuration(pausedTime / 1000)}</td>
                </tr>
                
                <tr style={styles.tableRow}>
                  <td style={styles.tableLabel}>時間:</td>
                  <td style={styles.tableValue}>
                    <span>{formatDateTime(studyStartTime)}</span>
                    <span style={styles.timelineArrow}>→</span>
                    <span>{formatDateTime(endTime)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
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
    maxWidth: "700px",
    margin: "0 auto",
    padding: "15px",
  },
  completionCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    padding: "25px",
    marginTop: "20px",
    width: "100%",
  },
  completionHeader: {
    textAlign: "center",
    marginBottom: "25px",
  },
  completionIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontWeight: "bold",
  },
  completionTitle: {
    fontSize: "24px",
    color: "#333",
    margin: "0 0 5px 0",
  },
  completionSubtitle: {
    fontSize: "16px",
    color: "#666",
    margin: 0,
  },
  summarySection: {
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "25px",
    overflowX: "auto",
  },
  summaryTable: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
    tableLayout: "fixed",
  },
  tableRow: {
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  tableLabel: {
    padding: "12px 15px",
    fontSize: "14px",
    color: "#666",
    fontWeight: "500",
    width: "120px",
    textAlign: "left",
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius: "8px",
    verticalAlign: "top",
  },
  tableValue: {
    padding: "12px 15px",
    fontSize: "15px",
    color: "#333",
    fontWeight: "700",
    textAlign: "left",
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
    verticalAlign: "top",
    wordBreak: "break-word",
  },
  timelineArrow: {
    margin: "0 10px",
    color: "#2196F3",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  actionsSection: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  homeButton: {
    padding: "12px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(33, 150, 243, 0.2)",
    letterSpacing: "0.5px",
    minWidth: "140px",
  },
  historyButton: {
    padding: "12px 20px",
    backgroundColor: "white",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    letterSpacing: "0.5px",
    minWidth: "140px",
  },
  buttonIcon: {
    marginRight: "8px",
    fontSize: "16px",
  }
};

export default CompletedStudyPage; 