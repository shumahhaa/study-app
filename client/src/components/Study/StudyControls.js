import React from 'react';
import { useStudy } from '../../contexts/StudyContext';

/**
 * 学習セッションのコントロールボタン（開始、一時停止、再開、停止、放棄）を提供するコンポーネント
 */
const StudyControls = () => {
  const {
    isStudying,
    isPaused,
    startStudy,
    pauseStudy,
    resumeStudy,
    stopStudy,
    abandonStudy,
    studyTopic,
    getStatus
  } = useStudy();

  const status = getStatus();
  const isTopicEmpty = !studyTopic || studyTopic.trim() === '';

  return (
    <div className="study-controls">
      <div className="status-indicator" style={{ color: status.color }}>
        状態: {status.text}
      </div>
      
      <div className="control-buttons">
        {!isStudying ? (
          <button 
            className="start-button"
            onClick={startStudy} 
            disabled={isTopicEmpty}
            title={isTopicEmpty ? "学習トピックを入力してください" : "学習を開始"}
          >
            学習開始
          </button>
        ) : isPaused ? (
          <>
            <button className="resume-button" onClick={resumeStudy}>再開</button>
            <button className="stop-button" onClick={stopStudy}>終了</button>
            <button className="abandon-button" onClick={abandonStudy}>放棄</button>
          </>
        ) : (
          <>
            <button className="pause-button" onClick={pauseStudy}>一時停止</button>
            <button className="stop-button" onClick={stopStudy}>終了</button>
            <button className="abandon-button" onClick={abandonStudy}>放棄</button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudyControls; 