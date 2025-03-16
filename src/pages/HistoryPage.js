import React from "react";
import { Link } from "react-router-dom";
import StudyHistory from "../components/StudyHistory";

const HistoryPage = ({ studyHistory, deleteStudySession, formatTime }) => {
  return (
    <div>
      <h1>学習履歴</h1>
      <Link to="/" style={styles.homeLink}>
        ホームに戻る
      </Link>
      <StudyHistory
        studyHistory={studyHistory}
        deleteStudySession={deleteStudySession}
        formatTime={formatTime}
      />
    </div>
  );
};

const styles = {
  homeLink: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    marginBottom: "20px",
  }
};

export default HistoryPage; 