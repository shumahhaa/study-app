import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "./styles";
import StartButton from "./StartButton";
import ActiveStudy from "./ActiveStudy";
import StudyInfo from "./StudyInfo";

/**
 * 学習制御コンポーネント
 */
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
    <div style={styles.container}>
      <StartButton 
        isStudying={isStudying} 
        studyTopic={studyTopic} 
        onClick={handleStartStudy} 
      />

      {isStudying && (
        <ActiveStudy 
          studyTopic={studyTopic}
          studyDuration={studyDuration}
          isPaused={isPaused}
          formatTime={formatTime}
          pauseStudy={pauseStudy}
          resumeStudy={resumeStudy}
          stopStudy={stopStudy}
        />
      )}

      {!isStudying && studyDuration > 0 && (
        <StudyInfo 
          topic={recordedStudyTopic}
          duration={studyDuration}
          motivation={recordedMotivation}
          formatTime={formatTime}
        />
      )}
    </div>
  );
};

export default StudyControls; 