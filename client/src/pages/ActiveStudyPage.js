import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AIChat from "../components/AIChat";

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
  isStudying,
  resetChatHistory
}) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState("stop");

  // ページロード時の処理
  useEffect(() => {
    // リロードフラグをチェック
    const isReloaded = sessionStorage.getItem('pageReloaded');
    
    if (isReloaded === 'true') {
      // リロードされた場合、学習を放棄してホームに戻る
      abandonStudy();
      navigate('/');
      // フラグをリセット
      sessionStorage.removeItem('pageReloaded');
    } else {
      // 初回アクセス時はフラグを設定
      sessionStorage.setItem('pageReloaded', 'true');
    }
    
    // beforeunloadイベントのリスナーを設定
    const handleBeforeUnload = (e) => {
      if (isStudying) {
        const message = "学習中です。ページを離れると学習データが保存されません。";
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // コンポーネントがアンマウントされる時（正常な遷移時）はフラグを削除
      sessionStorage.removeItem('pageReloaded');
    };
  }, [abandonStudy, navigate, isStudying]);

  const handleStopStudy = () => {
    setConfirmationType("stop");
    setShowConfirmation(true);
  };

  const handleAbandonStudy = () => {
    setConfirmationType("abandon");
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    setShowConfirmation(false); // まず確認ダイアログを閉じる
    
    if (confirmationType === "stop") {
      try {
        // 学習終了処理を実行
        await stopStudy();
        // 完了ページへ遷移（チャット履歴のリセットは完了ページで行う）
        navigate("/completed");
      } catch (error) {
        console.error("学習終了エラー:", error);
        alert("学習の終了処理中にエラーが発生しました。もう一度お試しください。");
      }
    } else {
      // 学習放棄時にチャット履歴をリセット
      if (recordedStudyTopic) {
        resetChatHistory(recordedStudyTopic);
      }
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
        
        {/* 右側：AIチャット */}
        <div style={styles.rightPanel}>
          {recordedStudyTopic ? (
            <AIChat 
              studyTopic={recordedStudyTopic}
              customStyles={{
                boxShadow: 'none',
                borderRadius: '0',
              }}
            />
          ) : (
            <div style={styles.loadingChat}>学習トピックが設定されていません</div>
          )}
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
    padding: "20px",
    paddingLeft: "60px",
    paddingRight: "60px",
  },
  // 左側パネル（学習管理）
  leftPanel: {
    width: "280px",
    position: "fixed",
    top: "100px", 
    left: "60px",
    height: "auto",
    maxHeight: "calc(100vh - 180px)",
    overflowY: "auto",
  },
  studyInfoCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    padding: "20px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100vh - 200px)",
    overflowY: "auto",
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
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
    marginBottom: "20px",
  },
  topicTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#333",
    margin: "0 0 12px 0",
    lineHeight: "1.3",
  },
  motivationTag: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "18px",
    fontSize: "12px",
    fontWeight: "600",
  },
  timerContainer: {
    textAlign: "center",
    marginTop: "10px",
    marginBottom: "25px",
    padding: "0",
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
    marginBottom: "6px",
  },
  timerLabel: {
    fontSize: "16px",
    color: "#888",
    fontWeight: "500",
  },
  controlsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "auto",
    marginBottom: "15px",
  },
  
  // 右側パネル（AIチャット用）
  rightPanel: {
    flex: 1,
    marginLeft: "300px",
    minHeight: "calc(100vh - 180px)",
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
    fontSize: "15px",
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
  loadingChat: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontSize: "18px",
    fontWeight: "500",
    color: "#555",
  },
};

export default ActiveStudyPage; 