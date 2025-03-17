import React, { useState } from "react";
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
  abandonStudy,
  recordedMotivation,
  isStudying
}) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState("stop");

  const handleStopStudy = () => {
    setConfirmationType("stop");
    setShowConfirmation(true);
  };

  const handleAbandonStudy = () => {
    setConfirmationType("abandon");
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    if (confirmationType === "stop") {
      await stopStudy();
      navigate("/completed");
    } else {
      abandonStudy();
      navigate("/");
    }
  };

  const cancelConfirmation = () => {
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

  // 時間フォーマット関数
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
    <Layout isStudying={isStudying}>
      <div style={styles.container}>
        {/* 左側：学習管理パネル */}
        <div style={styles.leftPanel}>
          <div style={styles.studyInfoCard}>
            <div style={styles.statusIndicator}>
              <div 
                style={{
                  ...styles.statusDot,
                  backgroundColor: isPaused ? "#E0E0E0" : "#4CAF50",
                  boxShadow: isPaused ? "none" : "0 0 10px rgba(76, 175, 80, 0.5)"
                }}
              />
              <div style={styles.statusText}>
                {isPaused ? "一時停止中" : "学習中"}
              </div>
            </div>
            
            <div style={styles.topicSection}>
              <h1 style={styles.topicTitle}>{recordedStudyTopic}</h1>
              <div 
                style={{
                  ...styles.motivationTag,
                  backgroundColor: `${getMotivationColor(recordedMotivation)}20`,
                  color: getMotivationColor(recordedMotivation)
                }}
              >
                モチベーション {recordedMotivation}/5
              </div>
            </div>
            
            <div style={styles.timerContainer}>
              <div style={styles.timerCircle}>
                <div style={styles.timerValue}>{formatDuration(studyDuration)}</div>
                <div style={styles.timerLabel}>経過時間</div>
              </div>
            </div>
            
            <div style={styles.controlsContainer}>
              {isPaused ? (
                <button
                  onClick={resumeStudy}
                  className="action-button"
                >
                  再開する
                </button>
              ) : (
                <button
                  onClick={pauseStudy}
                  className="pause-button"
                >
                  一時停止
                </button>
              )}
              
              <button
                onClick={handleStopStudy}
                className="stop-button"
              >
                学習を終了
              </button>
              
              <button
                onClick={handleAbandonStudy}
                className="abandon-button"
              >
                学習を放棄
              </button>
            </div>
          </div>
        </div>
        
        {/* 右側：AIチャット用スペース */}
        <div style={styles.rightPanel}>
          <div style={styles.chatPlaceholder}>
            <div style={styles.chatPlaceholderIcon}>🤖</div>
            <h3 style={styles.chatPlaceholderTitle}>AIチャットアシスタント</h3>
            <p style={styles.chatPlaceholderText}>
              この領域にAIチャット機能が実装される予定です。
              学習中の質問や相談ができるようになります。
            </p>
          </div>
        </div>
        
        {showConfirmation && (
          <div style={styles.overlay}>
            <div style={styles.dialog}>
              <h3 style={styles.dialogTitle}>
                {confirmationType === "stop" 
                  ? "学習を終了しますか？" 
                  : "学習を放棄しますか？"}
              </h3>
              <p style={styles.dialogText}>
                {confirmationType === "stop" 
                  ? `学習時間: ${formatDuration(studyDuration)}` 
                  : "放棄すると、この学習セッションは記録されません。"}
              </p>
              <div style={styles.dialogButtons}>
                <button
                  onClick={cancelConfirmation}
                  className="cancel-button"
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmAction}
                  className={`confirm-button ${confirmationType === "stop" ? "stop" : "abandon"}`}
                >
                  {confirmationType === "stop" ? "終了する" : "放棄する"}
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
    display: "flex",
    height: "calc(100vh - 120px)",
    padding: "20px",
    gap: "20px",
  },
  // 左側パネル（学習管理）
  leftPanel: {
    width: "300px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
  },
  studyInfoCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    padding: "25px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    marginBottom: "25px",
  },
  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "10px",
    transition: "all 0.3s ease",
  },
  statusText: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#666",
    letterSpacing: "0.5px",
  },
  topicSection: {
    marginBottom: "30px",
  },
  topicTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#333",
    margin: "0 0 15px 0",
    lineHeight: "1.3",
  },
  motivationTag: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  timerContainer: {
    textAlign: "center",
    marginBottom: "auto",
    padding: "20px 0",
    display: "flex",
    justifyContent: "center",
  },
  timerCircle: {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    backgroundColor: "#f5f9ff",
    border: "2px solid #e6effd",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
    position: "relative",
  },
  timerValue: {
    fontSize: "28px",
    fontWeight: "500",
    color: "#333",
    fontFamily: "'Roboto Mono', monospace",
    letterSpacing: "1px",
    marginBottom: "5px",
  },
  timerLabel: {
    fontSize: "14px",
    color: "#888",
    fontWeight: "500",
  },
  controlsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
  },
  
  // 右側パネル（AIチャット用）
  rightPanel: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  chatPlaceholder: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    backgroundColor: "#f9f9f9",
    borderRadius: "16px",
    border: "2px dashed #e0e0e0",
    margin: "20px",
  },
  chatPlaceholderIcon: {
    fontSize: "48px",
    marginBottom: "20px",
    opacity: 0.5,
  },
  chatPlaceholderTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#666",
    margin: "0 0 10px 0",
  },
  chatPlaceholderText: {
    fontSize: "15px",
    color: "#888",
    textAlign: "center",
    maxWidth: "400px",
    lineHeight: "1.5",
  },
  
  // モーダルダイアログ
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(3px)",
  },
  dialog: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "30px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  },
  dialogTitle: {
    margin: "0 0 20px 0",
    fontSize: "22px",
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  dialogText: {
    fontSize: "18px",
    color: "#555",
    textAlign: "center",
    marginBottom: "30px",
    fontWeight: "500",
  },
  dialogButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  cancelButton: {
    padding: "12px 24px",
    backgroundColor: "#F5F5F5",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flex: "1",
  },
  confirmButton: {
    padding: "12px 24px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 10px rgba(33, 150, 243, 0.3)",
    flex: "1",
  },
};

export default ActiveStudyPage; 