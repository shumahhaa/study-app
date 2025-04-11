import React from 'react';
import styles from './styles';

// 学習トピックを表示するコンポーネント
const TopicSection = ({ topic, motivation }) => {
  return (
    <div style={styles.topicSection}>
      <div style={{
        position: "absolute",
        left: "0",
        top: "17px",
        height: "calc(100% - 34px)",
        width: "4px",
        background: "linear-gradient(to bottom, #2196F3, #4CAF50)",
        borderRadius: "2px",
      }}></div>
      <h1 style={{
        ...styles.topicTitle,
        paddingLeft: "8px",
        textAlign: "left",
      }}>{topic}</h1>
    </div>
  );
};

export default TopicSection; 