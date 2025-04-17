import React, { useState, useEffect } from 'react';
import MarkdownContent from './MarkdownContent';
import { styles } from './styles';

// チャットメッセージコンポーネント
const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";
  const isError = message.isError || false;
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

  // バブルのスタイルを定義
  const bubbleStyle = {
    ...styles.bubble,
    ...(isUser ? { backgroundColor: "rgba(76, 175, 80, 0.1)" } : {}), // ユーザーメッセージの背景色を薄緑に
    maxWidth: isMobile ? "calc(100% - 16px)" : "calc(100% - 60px)", // モバイル時にバブルを広げる
    margin: isMobile ? "0 4px" : "0 12px", // モバイル時にマージンを小さく
  };

  return (
    <div
      style={{
        ...styles.message,
        ...(isUser ? styles.userMessage : styles.botMessage),
        ...(isError ? styles.errorMessage : {})
      }}
    >
      {/* アイコンを非表示にする */}
      {!isMobile && (
        <div style={styles.avatarContainer}>
          <div
            style={isUser ? styles.userAvatar : styles.avatar}
          >
            {isUser ? "U" : "AI"}
          </div>
        </div>
      )}
      <div style={bubbleStyle}>
        {isUser ? (
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{message.content}</p>
        ) : (
          <MarkdownContent content={message.content} />
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 