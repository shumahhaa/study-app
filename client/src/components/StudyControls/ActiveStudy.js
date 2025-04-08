import React from "react";
import TimeDisplay from "./TimeDisplay";
import PauseResumeButton from "./PauseResumeButton";
import StopButton from "./StopButton";

/**
 * アクティブな学習状態を表示するコンポーネント
 */
const ActiveStudy = ({ 
  studyTopic, 
  studyDuration, 
  isPaused, 
  formatTime, 
  pauseStudy, 
  resumeStudy, 
  stopStudy 
}) => {
  return (
    <div>
      <p>「{studyTopic}の学習を開始しました！」</p>
      <TimeDisplay 
        isPaused={isPaused} 
        duration={studyDuration} 
        formatTime={formatTime} 
      />
      
      <PauseResumeButton 
        isPaused={isPaused} 
        onPause={pauseStudy} 
        onResume={resumeStudy} 
      />
      
      <StopButton onClick={stopStudy} />
    </div>
  );
};

export default ActiveStudy; 