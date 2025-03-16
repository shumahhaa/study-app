import React from "react";
import { Link } from "react-router-dom";
import StudyInput from "../components/StudyInput";
import StudyControls from "../components/StudyControls";

const HomePage = ({
  studyTopic,
  setStudyTopic,
  motivation,
  setMotivation,
  isStudying,
  isPaused,
  pauseStudy,
  resumeStudy,
  startStudy,
  stopStudy,
  studyDuration,
  recordedStudyTopic,
  recordedMotivation,
  formatTime,
  getStatus
}) => {
  const status = getStatus();
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>LearnTime</h1>
        <Link to="/history" style={styles.historyLink}>
          学習履歴を見る
        </Link>
      </header>
      
      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.statusWrapper}>
            <div style={{...styles.statusIndicator, backgroundColor: status.color}}></div>
            <div style={{...styles.statusText, color: status.color}}>
              {status.text}
            </div>
          </div>
          
          {isStudying && (
            <div style={styles.studyInfo}>
              <p style={styles.currentStudyTopic}>
                <span style={styles.infoLabel}>学習中: </span>
                {recordedStudyTopic}
              </p>
              <p style={styles.timer}>{formatTime(studyDuration)}</p>
            </div>
          )}
          
          {!isStudying && (
            <StudyInput
              studyTopic={studyTopic}
              setStudyTopic={setStudyTopic}
              motivation={motivation}
              setMotivation={setMotivation}
            />
          )}
          
          <StudyControls
            isStudying={isStudying}
            isPaused={isPaused}
            pauseStudy={pauseStudy}
            resumeStudy={resumeStudy}
            startStudy={startStudy}
            stopStudy={stopStudy}
            studyTopic={studyTopic}
            studyDuration={studyDuration}
            recordedStudyTopic={recordedStudyTopic}
            recordedMotivation={recordedMotivation}
            formatTime={formatTime}
          />
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },
  title: {
    fontSize: "32px",
    margin: 0,
    color: "#333"
  },
  historyLink: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "500",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s"
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  statusWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px"
  },
  statusIndicator: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    marginRight: "10px"
  },
  statusText: {
    fontSize: "18px",
    fontWeight: "600"
  },
  studyInfo: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px"
  },
  currentStudyTopic: {
    fontSize: "16px",
    margin: "0 0 10px 0"
  },
  infoLabel: {
    fontWeight: "600",
    color: "#555"
  },
  timer: {
    fontSize: "32px",
    fontWeight: "700",
    margin: "10px 0",
    textAlign: "center",
    color: "#333"
  }
};

export default HomePage;