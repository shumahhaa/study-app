import React from "react";
import StudyHistory from "../components/StudyHistory";
import Layout from "../components/Layout";

const HistoryPage = ({ studyHistory, deleteStudySession, formatTime }) => {
  return (
    <Layout>
      <div style={styles.container}>
        <StudyHistory
          studyHistory={studyHistory}
          deleteStudySession={deleteStudySession}
          formatTime={formatTime}
        />
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  title: {
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  }
};

export default HistoryPage; 