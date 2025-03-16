import React from "react";

const StudyControls = ({ 
  isStudying, 
  isPaused, 
  pauseStudy, 
  resumeStudy, 
  startStudy, 
  stopStudy, 
  studyTopic, 
  studyDuration, 
  recordedStudyTopic, 
  recordedMotivation, 
  formatTime 
}) => {
  // ボタンがアクティブかどうかの判定
  const canStart = !isStudying && studyTopic.trim() !== "";
  
  return (
    <div style={styles.container}>
      {!isStudying && (
        <div style={styles.startButtonContainer}>
          <button 
            onClick={startStudy} 
            disabled={!canStart}
            style={{
              ...styles.button,
              ...styles.startButton,
              opacity: canStart ? 1 : 0.6,
              cursor: canStart ? "pointer" : "not-allowed",
            }}
          >
            <div style={styles.buttonIcon}>▶</div>
            <span>学習開始</span>
          </button>
          {!canStart && studyTopic.trim() === "" && (
            <p style={styles.helperText}>学習内容を入力してください</p>
          )}
        </div>
      )}

      {isStudying && (
        <div style={styles.studyActiveContainer}>
          <div style={styles.studyInfo}>
            <p style={styles.studyInfoText}>
              <span style={styles.studyLabel}>学習中:</span> {recordedStudyTopic}
            </p>
          </div>
          
          <div style={styles.timerContainer}>
            <p style={{ 
              ...styles.timer,
              color: isPaused ? "#f39c12" : "#2c3e50",
            }}>
              {formatTime(studyDuration)}
            </p>
            <div style={styles.statusDot(isPaused)}></div>
          </div>
          
          <div style={styles.controlsGroup}>
            {isPaused ? (
              <button
                onClick={resumeStudy}
                style={{
                  ...styles.button,
                  ...styles.resumeButton,
                }}
              >
                <div style={styles.buttonIcon}>▶</div>
                <span>再開</span>
              </button>
            ) : (
              <button
                onClick={pauseStudy}
                style={{
                  ...styles.button,
                  ...styles.pauseButton,
                }}
              >
                <div style={styles.buttonIcon}>⏸</div>
                <span>一時停止</span>
              </button>
            )}
            <button 
              onClick={stopStudy}
              style={{
                ...styles.button,
                ...styles.stopButton,
              }}
            >
              <div style={styles.buttonIcon}>■</div>
              <span>学習終了</span>
            </button>
          </div>
        </div>
      )}

      {!isStudying && studyDuration > 0 && (
        <div style={styles.studySummary}>
          <h3 style={styles.summaryTitle}>前回の学習セッション</h3>
          <div style={styles.summaryContent}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>学習内容:</span>
              <span style={styles.summaryValue}>{recordedStudyTopic}</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>学習時間:</span>
              <span style={styles.summaryValue}>{formatTime(studyDuration)}</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>モチベーション:</span>
              <div style={styles.motivationStars}>
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    style={{
                      ...styles.star,
                      color: i < recordedMotivation ? "#f1c40f" : "#ddd"
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    marginTop: "20px"
  },
  startButtonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px"
  },
  studyActiveContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    height: "48px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  startButton: {
    backgroundColor: "#27ae60",
    color: "white",
    width: "200px",
    fontSize: "18px",
    "&:hover": {
      backgroundColor: "#2ecc71",
    }
  },
  pauseButton: {
    backgroundColor: "#f39c12",
    color: "white",
    flex: 1,
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#f1c40f",
    }
  },
  resumeButton: {
    backgroundColor: "#3498db",
    color: "white",
    flex: 1,
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#2980b9",
    }
  },
  stopButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    flex: 1,
    "&:hover": {
      backgroundColor: "#c0392b",
    }
  },
  buttonIcon: {
    marginRight: "8px",
    fontSize: "14px"
  },
  controlsGroup: {
    display: "flex",
    marginTop: "15px"
  },
  studyInfo: {
    marginBottom: "10px"
  },
  studyInfoText: {
    margin: "0",
    fontSize: "16px",
    color: "#34495e"
  },
  studyLabel: {
    fontWeight: "600",
    color: "#2c3e50"
  },
  timerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "15px"
  },
  timer: {
    fontSize: "36px",
    fontWeight: "700",
    margin: "5px 0",
    fontFamily: "'Roboto Mono', monospace"
  },
  statusDot: (isPaused) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: isPaused ? "#f39c12" : "#27ae60",
    marginLeft: "10px",
    animation: isPaused ? "none" : "pulse 1.5s infinite"
  }),
  helperText: {
    color: "#e74c3c",
    fontSize: "14px",
    marginTop: "5px",
    textAlign: "center"
  },
  studySummary: {
    marginTop: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  },
  summaryTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#34495e",
    margin: "0 0 10px 0",
    borderBottom: "1px solid #eee",
    paddingBottom: "8px"
  },
  summaryContent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  summaryLabel: {
    fontWeight: "500",
    color: "#7f8c8d"
  },
  summaryValue: {
    fontWeight: "600",
    color: "#2c3e50"
  },
  motivationStars: {
    display: "flex"
  },
  star: {
    fontSize: "18px",
    marginLeft: "2px"
  }
};

export default StudyControls;
