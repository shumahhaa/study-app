import React from 'react';
import styles from './styles';
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
  onAbandonStudy,
  isMobile
}) => {
  return (
    <div style={isMobile ? styles.leftPanelMobile : styles.leftPanel}>
      <div style={styles.studyInfoCard}>
        <TopicSection 
          topic={recordedStudyTopic} 
          motivation={recordedMotivation} 
        />
        
        <Timer 
          studyDuration={studyDuration} 
          isMobile={isMobile} 
          isPaused={isPaused}
          pauseStudy={pauseStudy}
          resumeStudy={resumeStudy}
        />
        
        <ControlButtons 
          onStop={onStopStudy}
          onAbandon={onAbandonStudy}
        />
      </div>
    </div>
  );
};

export default StudyPanel; 