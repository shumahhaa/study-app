import React, { useRef, useEffect, useState } from 'react';
import { styles } from './styles';

// ウィンドウサイズを監視するカスタムフック
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // リサイズイベントのリスナーを追加
    window.addEventListener('resize', handleResize);
    
    // クリーンアップ関数
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const ChatInput = ({ 
  input, 
  setInput, 
  handleKeyDown, 
  sendMessage, 
  isLoading, 
  usageCount, 
  dailyUsage,
  MAX_USAGE_COUNT,
  dailyLimitExceeded,
  hasApiError = false
}) => {
  const textAreaRef = useRef(null);
  const { width } = useWindowSize(); // ウィンドウサイズを取得
  
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
  
  // ウィンドウサイズに応じてスタイルを調整
  const containerStyle = {
    ...styles.inputContainer,
    padding: width <= 768 ? "12px 12px" : "16px 70px", // スマホサイズでは左右のパディングを小さく
  };
  
  // テキストエリアのスタイルも調整
  const textAreaStyle = {
    ...styles.textArea,
    // スマホサイズでは横幅を最大化
    width: width <= 768 ? "calc(100% - 50px)" : "auto", // 送信ボタンのスペースを確保
  };
  
  // 使用回数カウンターのスタイル（APIエラー時は警告色に）
  const usageCounterStyle = {
    ...styles.usageCounter,
    ...(hasApiError ? { color: '#ff4d4d' } : {})
  };
  
  return (
    <div style={containerStyle}>
      <form onSubmit={sendMessage} style={styles.inputForm}>
        {/* 使用回数カウンターを表示 */}
        <div style={usageCounterStyle}>
          <div>１セッション：{usageCount}/{MAX_USAGE_COUNT}</div>
          <div>１日：{dailyUsage.current}/{dailyUsage.limit}</div>
          {hasApiError && (
            <div style={styles.apiErrorMessage}>
              サーバー接続エラー
            </div>
          )}
        </div>
        <textarea
          ref={textAreaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hasApiError ? "接続に問題があります。もう一度試してください..." : "質問を入力してください..."}
          style={{
            ...textAreaStyle,
            ...(hasApiError ? { borderColor: '#ff4d4d' } : {})
          }}
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
            ...(isLoading || input.trim() === "" || usageCount >= MAX_USAGE_COUNT || dailyLimitExceeded ? styles.disabledButton : {}),
            ...(hasApiError ? { color: '#ff4d4d' } : {})
          }}
          disabled={isLoading || input.trim() === "" || usageCount >= MAX_USAGE_COUNT || dailyLimitExceeded}
          title={hasApiError ? "接続を再試行" : "送信"}
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