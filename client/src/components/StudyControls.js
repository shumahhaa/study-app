import React from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  const handleStartStudy = () => {
    startStudy();
    navigate("/active");
  };
  
  return (
    <div>
      <button 
        onClick={handleStartStudy} 
        disabled={isStudying || studyTopic.trim() === ""}
        style={{
          ...baseButtonStyle,
          backgroundColor: isStudying ? "gray" : "green",
          cursor: isStudying ? "not-allowed" : "pointer",
        }}
        onMouseOver={(e) => !isStudying && (e.target.style.backgroundColor = "lightgreen")}
        onMouseOut={(e) => !isStudying && (e.target.style.backgroundColor = "green")}
      >
        学習開始
      </button>

      {isStudying && (
        <div>
          <p>「{studyTopic}の学習を開始しました！」</p>
          <p style={{ 
            fontSize: "32px", 
            fontWeight: "bold", 
            textAlign: "center",
            color: isPaused ? "orange" : "black",
            transition: "color 0.3s ease-in-out"
          }}>
            経過時間： {formatTime(studyDuration)}
          </p>
          
          {isPaused ? (
            <button
              onClick={resumeStudy}
              style={{
                ...baseButtonStyle,
                backgroundColor: "blue",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "lightblue")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "blue")}
            >
              ▶ 再開
            </button>
          ) : (
            <button
              onClick={pauseStudy}
              style={{
                ...baseButtonStyle,
                backgroundColor: "orange",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "gold")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "orange")}
            >
              ⏸ 一時停止
            </button>
          )}
          <button 
            onClick={stopStudy}
            style={{
              ...baseButtonStyle,
              backgroundColor: "red",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "lightcoral")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "red")}
          >
            学習終了
          </button>
        </div>
      )}

      {!isStudying && studyDuration > 0 && (
        <div>
          <p>学習内容： {recordedStudyTopic}</p>
          <p>最終学習時間: {formatTime(studyDuration)}</p>
          <p>学習開始時のモチベーション： {recordedMotivation}/5</p>
        </div>
      )}
    </div>
  );
};

const baseButtonStyle = {
  color: "white",
  padding: "10px 20px",
  margin: "5px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background-color 0.3s ease",
};

export default StudyControls;