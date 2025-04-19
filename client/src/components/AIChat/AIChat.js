import React, { useState, useRef, useEffect, useCallback } from "react";
import { fetchChatResponse, fetchChatUsage } from "../../utils/api";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { styles, injectGlobalStyles } from "./styles";

const AIChat = ({ studyTopic, customStyles = {} }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // チャットの使用回数を追跡するstate
  const [usageCount, setUsageCount] = useState(0);
  // 1日のチャット使用回数を追跡するstate
  const [dailyUsage, setDailyUsage] = useState({ current: 0, limit: 100 });
  const [dailyLimitExceeded, setDailyLimitExceeded] = useState(false);
  const messagesEndRef = useRef(null);
  const chatStorageKey = `aiChat_${studyTopic}`; // 学習トピックごとに固有のストレージキー
  const usageCountKey = `aiChatUsage_${studyTopic}`; // 使用回数保存用のキー

  // モデル選択用の設定
  const selectedModel = process.env.REACT_APP_SELECTED_MODEL || "gpt-3.5-turbo";
  
  // 最大使用回数の制限（環境変数またはデフォルト値を使用）
  // 環境変数の値が無効な場合にデフォルト値を使用するように改善
  const getMaxUsageCount = () => {
    const envValue = process.env.REACT_APP_MAX_USAGE_COUNT;
    if (!envValue) return 20; // 環境変数が未設定の場合
    
    const parsed = parseInt(envValue, 10);
    return isNaN(parsed) ? 20 : parsed; // NaNの場合はデフォルト値を返す
  };
  
  const MAX_USAGE_COUNT = getMaxUsageCount();

  // グローバルスタイルの適用
  useEffect(() => {
    const removeGlobalStyles = injectGlobalStyles();
    
    // クリーンアップ関数を返す
    return () => {
      removeGlobalStyles();
    };
  }, []);

  // 1日の使用回数を取得
  const fetchDailyUsage = useCallback(async () => {
    try {
      const response = await fetchChatUsage();
      if (response && response.dailyUsage) {
        setDailyUsage(response.dailyUsage);
        setDailyLimitExceeded(response.dailyUsage.current >= response.dailyUsage.limit);
      }
    } catch (error) {
      console.error('1日のチャット使用回数取得エラー:', error);
    }
  }, []);

  // コンポーネントのマウント時にチャット使用回数を取得
  useEffect(() => {
    if (studyTopic) {
      fetchDailyUsage();
    }
  }, [fetchDailyUsage, studyTopic]);

  // 初期ウェルカムメッセージを設定する関数
  const setInitialWelcomeMessage = useCallback(() => {
    const welcomeMessage = {
      role: "assistant",
      content: `「${studyTopic}」について学習中ですね！質問があればいつでも聞いてください！`,
    };
    setMessages([welcomeMessage]);
    
    // セッションストレージに新しいウェルカムメッセージを保存
    sessionStorage.setItem(chatStorageKey, JSON.stringify([welcomeMessage]));
  }, [studyTopic, chatStorageKey]);

  // セッションストレージからチャット履歴と使用回数を読み込む
  useEffect(() => {
    // studyTopicが空の場合は何もしない
    if (!studyTopic) return;
    
    const savedMessages = sessionStorage.getItem(chatStorageKey);
    const savedUsageCount = sessionStorage.getItem(usageCountKey);
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("チャット履歴の読み込みエラー:", error);
        setInitialWelcomeMessage();
      }
    } else {
      setInitialWelcomeMessage();
    }
    
    if (savedUsageCount) {
      try {
        const parsedUsageCount = parseInt(savedUsageCount, 10);
        setUsageCount(parsedUsageCount);
      } catch (error) {
        console.error("使用回数の読み込みエラー:", error);
        setUsageCount(0);
      }
    } else {
      setUsageCount(0);
    }
  }, [studyTopic, chatStorageKey, usageCountKey, setInitialWelcomeMessage]);

  // チャット履歴が更新されたらセッションストレージに保存
  useEffect(() => {
    if (messages.length > 0 && studyTopic) {
      sessionStorage.setItem(chatStorageKey, JSON.stringify(messages));
    }
  }, [messages, chatStorageKey, studyTopic]);
  
  // 使用回数が更新されたらセッションストレージに保存
  useEffect(() => {
    if (studyTopic) {
      sessionStorage.setItem(usageCountKey, usageCount.toString());
    }
  }, [usageCount, usageCountKey, studyTopic]);

  // メッセージ送信処理
  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    
    // この学習セッションでの使用回数が上限に達している場合は送信しない
    if (usageCount >= MAX_USAGE_COUNT) {
      const limitMessage = {
        role: "assistant",
        content: "申し訳ありませんが、この学習セッションでのAIチャットの使用回数上限（20回）に達しました。",
        isError: true,
      };
      setMessages((prevMessages) => [...prevMessages, limitMessage]);
      return;
    }

    // 1日の使用制限チェック - 最新の状態を取得してから判断
    try {
      await fetchDailyUsage();
      
      if (dailyLimitExceeded) {
        const limitMessage = {
          role: "assistant",
          content: `申し訳ありませんが、1日のAIチャット使用回数上限（${dailyUsage.limit}回）に達しました。明日になるとリセットされます。`,
          isError: true,
        };
        setMessages((prevMessages) => [...prevMessages, limitMessage]);
        return;
      }
    } catch (error) {
      console.error("使用回数取得エラー:", error);
    }

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 会話履歴をOpenAI形式に変換
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // 新しいユーザーメッセージを追加
      conversationHistory.push({
        role: "user",
        content: input
      });

      // バックエンドAPIを呼び出し（現在の使用回数も送信）
      const response = await fetchChatResponse(
        conversationHistory, 
        studyTopic, 
        selectedModel,
        usageCount // 現在のセッション使用回数を送信
      );

      const botResponse = {
        role: "assistant",
        content: response.message,
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
      
      // 使用回数をインクリメント
      setUsageCount(prevCount => prevCount + 1);
      
      // 1日の使用回数を更新
      if (response.dailyUsage) {
        setDailyUsage(response.dailyUsage);
        setDailyLimitExceeded(response.dailyUsage.current >= response.dailyUsage.limit);
      } else {
        // レスポンスに含まれていない場合は最新の状態を取得
        fetchDailyUsage();
      }
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      
      // レート制限エラーの場合
      if (error.message && error.message.includes('1日のAIチャット使用回数上限')) {
        setDailyLimitExceeded(true);
        fetchDailyUsage(); // 最新の使用状況を取得
      }
      
      const errorMessage = {
        role: "assistant",
        content: error.message || "すみません、エラーが発生しました。しばらくしてからもう一度お試しください。",
        isError: true,
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    setIsLoading(false);
    // APIレスポンス後に入力欄に自動でフォーカスを戻す
    setTimeout(() => {
      document.querySelector("textarea")?.focus();
      // 新しいメッセージが追加されたら、ページの最下部にスクロール
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  };

  // 新しいメッセージが追加されたらページ全体をスクロール
  useEffect(() => {
    if (messages.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [messages]);

  // Enterキーで送信、Shift+Enterで改行
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div style={{ ...styles.container, ...customStyles }}>
      {/* AIアシスタントのヘッダーバーを追加 */}
      <div style={styles.header}>
        <h3 style={styles.title}>AIアシスタント</h3>
      </div>
      
      <div style={styles.chatContent}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {isLoading && (
          <div style={styles.loadingContainer}>
            <div style={styles.typingIndicator} className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} style={{height: "20px"}} />
      </div>
      
      <ChatInput
        input={input}
        setInput={setInput}
        handleKeyDown={handleKeyDown}
        sendMessage={sendMessage}
        isLoading={isLoading}
        usageCount={usageCount}
        dailyUsage={dailyUsage}
        MAX_USAGE_COUNT={MAX_USAGE_COUNT}
        dailyLimitExceeded={dailyLimitExceeded}
      />
    </div>
  );
};

export default AIChat; 