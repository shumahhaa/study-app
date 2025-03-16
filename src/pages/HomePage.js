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
  return (
    <div>
      <h1>LearnTime</h1>
      <Link to="/history" style={styles.historyLink}>
        学習履歴を見る
      </Link>
      <StudyInput
        studyTopic={studyTopic}
        setStudyTopic={setStudyTopic}
        motivation={motivation}
        setMotivation={setMotivation}
      />
      <div style={{ fontSize: "18px", fontWeight: "bold", color: getStatus().color }}>
        状態: {getStatus().text}
      </div>
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
  );
};

const styles = {
  historyLink: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    marginBottom: "20px",
  }
};

export default HomePage; 