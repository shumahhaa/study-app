import React, { useRef, useEffect } from 'react';
import { styles } from './styles';

const ChatInput = ({ 
  input, 
  setInput, 
  handleKeyDown, 
  sendMessage, 
  isLoading, 
  usageCount, 
  dailyUsage,
  MAX_USAGE_COUNT,
  dailyLimitExceeded 
}) => {
  const textAreaRef = useRef(null);
  
  // テキストエリアの高さを自動調整する関数
  const adjustTextAreaHeight = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      // 最初に高さをリセット
      textArea.style.height = "auto";
      // スクロールの高さに基づいて高さを設定（最小は42px、最大は150px）
      const newHeight = Math.min(Math.max(textArea.scrollHeight, 42), 150);
      textArea.style.height = `${newHeight}px`;
    }
  };

  // 入力内容が変更されたときに高さを調整
  useEffect(() => {
    adjustTextAreaHeight();
  }, [input]);
  
  return (
    <div style={styles.inputContainer}>
      <form onSubmit={sendMessage} style={styles.inputForm}>
        {/* 使用回数カウンターを表示 */}
        <div style={styles.usageCounter}>
          <div>１セッション：{usageCount}/{MAX_USAGE_COUNT}</div>
          <div>１日：{dailyUsage.current}/{dailyUsage.limit}</div>
        </div>
        <textarea
          ref={textAreaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="質問を入力してください..."
          style={styles.textArea}
          disabled={isLoading || usageCount >= MAX_USAGE_COUNT || dailyLimitExceeded}
          rows="1"
          spellCheck="false"
          className="text-area-center-placeholder"
          autoFocus
        />
        <button
          type="submit"
          className="send-button"
          style={{
            ...styles.sendButton,
            ...(isLoading || input.trim() === "" || usageCount >= MAX_USAGE_COUNT || dailyLimitExceeded ? styles.disabledButton : {})
          }}
          disabled={isLoading || input.trim() === "" || usageCount >= MAX_USAGE_COUNT || dailyLimitExceeded}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput; 