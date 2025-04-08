import React from 'react';
import styles from './styles';
import { getMotivationColor } from './utils';

// 学習トピックとモチベーションを表示するコンポーネント
const TopicSection = ({ topic, motivation }) => {
  return (
    <div style={styles.topicSection}>
      <h1 style={styles.topicTitle}>{topic}</h1>
      <div 
        style={{
          ...styles.motivationTag,
          backgroundColor: `${getMotivationColor(motivation)}20`,
          color: getMotivationColor(motivation)
        }}
      >
        モチベーション {motivation}/5
      </div>
    </div>
  );
};

export default TopicSection; 