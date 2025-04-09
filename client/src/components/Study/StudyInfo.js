import React from 'react';
import { useStudy } from '../../contexts/StudyContext';

/**
 * 現在の学習セッションの情報を表示するコンポーネント
 */
const StudyInfo = () => {
  const { 
    recordedStudyTopic, 
    recordedMotivation, 
    isStudying 
  } = useStudy();

  if (!isStudying || !recordedStudyTopic) {
    return null;
  }

  return (
    <div className="study-info">
      <h3>現在の学習</h3>
      <div className="info-item">
        <span className="label">トピック:</span>
        <span className="value">{recordedStudyTopic}</span>
      </div>
      <div className="info-item">
        <span className="label">モチベーション:</span>
        <span className="value">{recordedMotivation}/5</span>
      </div>
    </div>
  );
};

export default StudyInfo; 