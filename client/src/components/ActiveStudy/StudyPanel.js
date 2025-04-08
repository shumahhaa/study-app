import React from 'react';
import styles from './styles';
import StatusIndicator from './StatusIndicator';
import TopicSection from './TopicSection';
import Timer from './Timer';
import ControlButtons from './ControlButtons';

// 左側の学習管理パネル
const StudyPanel = ({
  isPaused,
  recordedStudyTopic,
  studyDuration,
  recordedMotivation,
  pauseStudy,
  resumeStudy,
  onStopStudy,
  onAbandonStudy
}) => {
  return (
    <div style={styles.leftPanel}>
      <div style={styles.studyInfoCard}>
        <StatusIndicator isPaused={isPaused} />
        
        <TopicSection 
          topic={recordedStudyTopic} 
          motivation={recordedMotivation} 
        />
        
        <Timer studyDuration={studyDuration} />
        
        <ControlButtons 
          isPaused={isPaused}
          onPause={pauseStudy}
          onResume={resumeStudy}
          onStop={onStopStudy}
          onAbandon={onAbandonStudy}
        />
      </div>
    </div>
  );
};

export default StudyPanel; 