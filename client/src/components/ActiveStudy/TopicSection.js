import React, { useState, useEffect } from 'react';
import styles from './styles';

// 学習トピックを表示するコンポーネント
const TopicSection = ({ topic, motivation }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 画面サイズの変更を監視
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        paddingLeft: "10px",
        textAlign: "left",
        margin: isMobile ? "0" : undefined,
      }}>{topic}</h1>
    </div>
  );
};

export default TopicSection; 