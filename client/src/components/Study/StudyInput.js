import React from 'react';
import { useStudy } from '../../contexts/StudyContext';

/**
 * 学習トピックとモチベーション入力のためのコンポーネント
 */
const StudyInput = () => {
  const {
    studyTopic,
    setStudyTopic,
    motivation,
    setMotivation,
    isStudying
  } = useStudy();

  const handleTopicChange = (e) => {
    setStudyTopic(e.target.value);
  };

  const handleMotivationChange = (e) => {
    setMotivation(parseInt(e.target.value, 10));
  };

  return (
    <div className="study-input">
      <div className="input-group">
        <label htmlFor="study-topic">学習トピック:</label>
        <input
          id="study-topic"
          type="text"
          value={studyTopic}
          onChange={handleTopicChange}
          placeholder="何を学習しますか？"
          disabled={isStudying}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="motivation-level">モチベーションレベル: {motivation}</label>
        <input
          id="motivation-level"
          type="range"
          min="1"
          max="5"
          value={motivation}
          onChange={handleMotivationChange}
          disabled={isStudying}
        />
        <div className="motivation-labels">
          <span>低</span>
          <span>中</span>
          <span>高</span>
        </div>
      </div>
    </div>
  );
};

export default StudyInput; 