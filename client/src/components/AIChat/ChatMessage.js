import React from 'react';
import MarkdownContent from './MarkdownContent';
import { styles } from './styles';

// チャットメッセージコンポーネント
const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";
  const isError = message.isError || false;

  return (
    <div
      style={{
        ...styles.message,
        ...(isUser ? styles.userMessage : styles.botMessage),
        ...(isError ? styles.errorMessage : {})
      }}
    >
      <div style={styles.avatarContainer}>
        <div
          style={isUser ? styles.userAvatar : styles.avatar}
        >
          {isUser ? "U" : "AI"}
        </div>
      </div>
      <div style={styles.bubble}>
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