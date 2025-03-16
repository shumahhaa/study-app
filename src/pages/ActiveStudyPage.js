import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const ActiveStudyPage = ({
  recordedStudyTopic,
  studyDuration,
  formatTime,
  isPaused,
  pauseStudy,
  resumeStudy,
  stopStudy,
  recordedMotivation
}) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [elapsedTimePercent, setElapsedTimePercent] = useState(0);
  const [timeGoal, setTimeGoal] = useState(25 * 60); // デフォルト25分

  // 目標時間の選択肢
  const timeOptions = [
    { value: 5 * 60, label: "5分" },
    { value: 15 * 60, label: "15分" },
    { value: 25 * 60, label: "25分" },
    { value: 45 * 60, label: "45分" },
    { value: 60 * 60, label: "1時間" },
    { value: 120 * 60, label: "2時間" },
    { value: 180 * 60, label: "3時間" },
    { value: 300 * 60, label: "5時間" }
  ];

  // 目標時間に対する進捗率を計算
  useEffect(() => {
    if (studyDuration && timeGoal) {
      const percent = Math.min((studyDuration / timeGoal) * 100, 100);
      setElapsedTimePercent(percent);
    }
  }, [studyDuration, timeGoal]);

  const handleStopStudy = () => {
    setShowConfirmation(true);
  };

  const confirmStopStudy = async () => {
    await stopStudy();
    navigate("/completed");
  };

  const cancelStopStudy = () => {
    setShowConfirmation(false);
  };

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

  // 時間フォーマット関数を追加
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

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>学習セッション進行中</h1>
          <div 
            style={{
              ...styles.statusBadge,
              backgroundColor: isPaused ? "#ff9800" : "#2196F3"
            }}
          >
            {isPaused ? "一時停止中" : "学習中"}
          </div>
        </div>

        <div style={styles.topicCard}>
          <div style={styles.topicHeader}>
            <h2 style={styles.topicTitle}>{recordedStudyTopic}</h2>
            <div 
              style={{
                ...styles.motivationBadge,
                backgroundColor: getMotivationColor(recordedMotivation)
              }}
            >
              モチベーション: {recordedMotivation}/5
            </div>
          </div>
          
          <div style={styles.timerSection}>
            <div style={styles.timerDisplay}>
              <span style={styles.timerText}>{formatDuration(studyDuration)}</span>
              <div style={styles.goalSelector}>
                <span style={styles.goalLabel}>目標時間:</span>
                <select 
                  value={timeGoal}
                  onChange={(e) => setTimeGoal(parseInt(e.target.value))}
                  style={styles.goalSelect}
                >
                  {timeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={styles.progressBarContainer}>
              <div 
                style={{
                  ...styles.progressBar,
                  width: `${elapsedTimePercent}%`,
                  backgroundColor: elapsedTimePercent >= 100 ? "#2196F3" : "#64B5F6"
                }}
              />
            </div>
            
            <div style={styles.progressLabel}>
              {elapsedTimePercent >= 100 
                ? "目標達成！おめでとうございます！" 
                : `目標まで ${formatDuration(timeGoal - studyDuration > 0 ? timeGoal - studyDuration : 0)}`}
            </div>
          </div>
          
          <div style={styles.controlsSection}>
            {isPaused ? (
              <button
                onClick={resumeStudy}
                style={styles.resumeButton}
              >
                <span style={styles.buttonIcon}>▶</span> 学習を再開
              </button>
            ) : (
              <button
                onClick={pauseStudy}
                style={styles.pauseButton}
              >
                <span style={styles.buttonIcon}>⏸</span> 一時停止
              </button>
            )}
            
            <button
              onClick={handleStopStudy}
              style={styles.stopButton}
            >
              <span style={styles.buttonIcon}>⏹</span> 学習を終了
            </button>
          </div>
        </div>
        
        {showConfirmation && (
          <div style={styles.confirmationOverlay}>
            <div style={styles.confirmationDialog}>
              <h3 style={styles.confirmationTitle}>学習を終了しますか？</h3>
              <p style={styles.confirmationText}>
                学習時間: {formatDuration(studyDuration)}
              </p>
              <div style={styles.confirmationButtons}>
                <button
                  onClick={cancelStopStudy}
                  style={styles.cancelButton}
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmStopStudy}
                  style={styles.confirmButton}
                >
                  終了する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    color: "#333",
    fontSize: "28px",
  },
  statusBadge: {
    padding: "8px 16px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
  },
  topicCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "24px",
    marginBottom: "30px",
  },
  topicHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  topicTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#333",
    fontWeight: "600",
  },
  motivationBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "500",
    fontSize: "14px",
  },
  timerSection: {
    marginBottom: "30px",
  },
  timerDisplay: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  timerText: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#333",
    fontFamily: "monospace",
  },
  goalSelector: {
    display: "flex",
    alignItems: "center",
  },
  goalLabel: {
    marginRight: "10px",
    fontSize: "16px",
    color: "#666",
  },
  goalSelect: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "#f9f9f9",
  },
  progressBarContainer: {
    height: "12px",
    backgroundColor: "#e0e0e0",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressBar: {
    height: "100%",
    transition: "width 0.3s ease-in-out",
  },
  progressLabel: {
    textAlign: "center",
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },
  controlsSection: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  pauseButton: {
    padding: "12px 24px",
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s",
  },
  resumeButton: {
    padding: "12px 24px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s",
  },
  stopButton: {
    padding: "12px 24px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s",
  },
  buttonIcon: {
    marginRight: "8px",
    fontSize: "18px",
  },
  confirmationOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  confirmationDialog: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
  confirmationTitle: {
    margin: 0,
    marginBottom: "15px",
    fontSize: "20px",
    color: "#333",
    textAlign: "center",
  },
  confirmationText: {
    fontSize: "18px",
    color: "#555",
    textAlign: "center",
    marginBottom: "20px",
  },
  confirmationButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#9e9e9e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  confirmButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default ActiveStudyPage; 