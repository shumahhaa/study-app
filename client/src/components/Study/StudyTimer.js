import React from 'react';
import { useStudy } from '../../contexts/StudyContext';

/**
 * 学習時間を表示するタイマーコンポーネント
 */
const StudyTimer = () => {
  const { studyDuration, formatTime, isStudying } = useStudy();

  if (!isStudying && !studyDuration) {
    return null;
  }

  return (
    <div className="study-timer">
      <h3>学習時間</h3>
      <div className="timer-display">{formatTime(studyDuration)}</div>
    </div>
  );
};

export default StudyTimer; 