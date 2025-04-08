// StudyControlsコンポーネントのスタイル定義
export const baseButtonStyle = {
  color: "white",
  padding: "10px 20px",
  margin: "5px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background-color 0.3s ease",
};

export const styles = {
  container: {
    width: '100%',
  },
  timeDisplay: {
    fontSize: "32px", 
    fontWeight: "bold", 
    textAlign: "center",
    transition: "color 0.3s ease-in-out"
  },
  pausedTimeDisplay: {
    color: "orange"
  },
  activeTimeDisplay: {
    color: "black"
  },
  startButton: {
    backgroundColor: "green",
  },
  disabledStartButton: {
    backgroundColor: "gray",
    cursor: "not-allowed",
  },
  pauseButton: {
    backgroundColor: "orange",
  },
  resumeButton: {
    backgroundColor: "blue",
  },
  stopButton: {
    backgroundColor: "red",
  },
  studyInfo: {
    marginTop: "15px",
    fontSize: "16px",
  }
}; 