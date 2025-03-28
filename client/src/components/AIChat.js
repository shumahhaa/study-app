import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import "katex/dist/katex.min.css"; // KaTeXのスタイルをインポート
import { fetchChatResponse } from "../utils/api";

const AIChat = ({ studyTopic, customStyles = {} }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);
  const chatStorageKey = `aiChat_${studyTopic}`; // 学習トピックごとに固有のストレージキー

  // モデル選択用の設定
  const selectedModel = "gpt-3.5-turbo"; // ここでモデルを指定（環境変数から取得することも可能）

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

  // セッションストレージからチャット履歴を読み込む
  useEffect(() => {
    // studyTopicが空の場合は何もしない
    if (!studyTopic) return;
    
    const savedMessages = sessionStorage.getItem(chatStorageKey);
    
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
  }, [studyTopic, chatStorageKey, setInitialWelcomeMessage]);

  // チャット履歴が更新されたらセッションストレージに保存
  useEffect(() => {
    if (messages.length > 0 && studyTopic) {
      sessionStorage.setItem(chatStorageKey, JSON.stringify(messages));
    }
  }, [messages, chatStorageKey, studyTopic]);

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

  // メッセージ送信処理
  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

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

      // バックエンドAPIを呼び出し
      const response = await fetchChatResponse(conversationHistory, studyTopic, selectedModel);

      const botResponse = {
        role: "assistant",
        content: response.message,
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      
      const errorMessage = {
        role: "assistant",
        content: "すみません、エラーが発生しました。しばらくしてからもう一度お試しください。",
        isError: true,
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    setIsLoading(false);
    // APIレスポンス後に入力欄に自動でフォーカスを戻す
    setTimeout(() => {
      textAreaRef.current?.focus();
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

  // Markdownコンテンツをレンダリングするコンポーネント
  const MarkdownContent = ({ content }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // コードブロックのカスタムレンダリング
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span>{match[1]}</span>
                </div>
                <pre className={`language-${match[1]}`}>
                  <code className={`language-${match[1]}`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // 数式用のカスタムレンダリング
          math: ({ value }) => (
            <div className="katex-display">
              {value}
            </div>
          ),
          inlineMath: ({ value }) => (
            <span className="katex-inline">
              {value}
            </span>
          ),
          // 他のMarkdown要素もカスタマイズできます
          h1: ({ node, ...props }) => <h1 style={styles.markdownH1} {...props} />,
          h2: ({ node, ...props }) => <h2 style={styles.markdownH2} {...props} />,
          h3: ({ node, ...props }) => <h3 style={styles.markdownH3} {...props} />,
          p: ({ node, ...props }) => <p style={styles.markdownP} {...props} />,
          ul: ({ node, ...props }) => <ul style={styles.markdownUl} {...props} />,
          ol: ({ node, ...props }) => <ol style={styles.markdownOl} {...props} />,
          li: ({ node, ...props }) => <li style={styles.markdownLi} {...props} />,
          a: ({ node, ...props }) => <a style={styles.markdownA} {...props} />,
          blockquote: ({ node, ...props }) => <blockquote style={styles.markdownBlockquote} {...props} />,
          table: ({ node, ...props }) => <table style={styles.markdownTable} {...props} />,
          img: ({ node, ...props }) => <img style={styles.markdownImg} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div style={{ ...styles.container, ...customStyles }}>
      {/* AIアシスタントのヘッダーバーを追加 */}
      <div style={styles.header}>
        <h3 style={styles.title}>AIアシスタント</h3>
      </div>
      
      <div style={styles.chatContent}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(message.role === "user" ? styles.userMessage : styles.botMessage),
              ...(message.isError ? styles.errorMessage : {})
            }}
          >
            {message.role === "assistant" && (
              <div style={styles.avatarContainer}>
                <div style={styles.avatar}>AI</div>
              </div>
            )}
            <div style={styles.bubble}>
              <div style={styles.messageContent}>
                {message.role === "user" ? (
                  message.content // ユーザーメッセージはプレーンテキストとして表示
                ) : (
                  <MarkdownContent content={message.content} /> // AIの回答はMarkdownとして表示
                )}
              </div>
            </div>
            {message.role === "user" && (
              <div style={styles.avatarContainer}>
                <div style={styles.userAvatar}>You</div>
              </div>
            )}
          </div>
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
      
      <div style={styles.inputContainer}>
        <form onSubmit={sendMessage} style={styles.inputForm}>
          <textarea
            ref={textAreaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="質問を入力してください..."
            style={styles.textArea}
            disabled={isLoading}
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
              ...(isLoading || input.trim() === "" ? styles.disabledButton : {})
            }}
            disabled={isLoading || input.trim() === ""}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    marginBottom: "0",
    height: "calc(100% - 60px)",
    marginTop: "45px",
    marginBottom: "30px",
    position: "relative",
    overflow: "hidden",
  },
  chatContent: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minHeight: "200px",
    flex: 1,
    overflowY: "auto",
    paddingBottom: "80px",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
  },
  message: {
    display: "flex",
    alignItems: "flex-start",
    maxWidth: "85%",
    margin: "4px 0",
  },
  userMessage: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  botMessage: {
    alignSelf: "flex-start",
  },
  avatarContainer: {
    flexShrink: 0,
    width: "36px",
    height: "36px",
    marginTop: "4px",
  },
  avatar: {
    backgroundColor: "#2196F3",
    color: "white",
    width: "36px",
    height: "36px",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "bold",
  },
  userAvatar: {
    backgroundColor: "#9c27b0",
    color: "white",
    width: "36px",
    height: "36px",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "bold",
  },
  bubble: {
    padding: "12px 16px",
    borderRadius: "18px",
    margin: "0 12px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    maxWidth: "calc(100% - 72px)",
    wordBreak: "break-word",
    background: "white",
  },
  errorMessage: {
    "& $bubble": {
      backgroundColor: "#ffebee",
      color: "#d32f2f",
    },
  },
  messageContent: {
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#333",
  },
  // Markdown用のスタイル
  markdownH1: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    marginTop: '16px',
    marginBottom: '8px',
    borderBottom: '1px solid #eaecef',
    paddingBottom: '0.3em',
  },
  markdownH2: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    marginTop: '16px',
    marginBottom: '8px',
    borderBottom: '1px solid #eaecef',
    paddingBottom: '0.3em',
  },
  markdownH3: {
    fontSize: '1.25em',
    fontWeight: 'bold',
    marginTop: '16px',
    marginBottom: '8px',
  },
  markdownP: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  markdownUl: {
    paddingLeft: '20px',
    marginTop: '8px',
    marginBottom: '8px',
  },
  markdownOl: {
    paddingLeft: '20px',
    marginTop: '8px',
    marginBottom: '8px',
  },
  markdownLi: {
    marginTop: '4px',
    marginBottom: '4px',
  },
  markdownA: {
    color: '#0366d6',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  markdownBlockquote: {
    padding: '0 16px',
    borderLeft: '4px solid #dfe2e5',
    color: '#6a737d',
    marginTop: '8px',
    marginBottom: '8px',
  },
  markdownTable: {
    borderCollapse: 'collapse',
    marginTop: '8px',
    marginBottom: '8px',
    width: '100%',
    overflow: 'auto',
  },
  markdownImg: {
    maxWidth: '100%',
    height: 'auto',
  },
  inputContainer: {
    padding: "16px 70px",
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: "0",
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomLeftRadius: "16px",
    borderBottomRightRadius: "16px",
    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.08)",
  },
  inputForm: {
    display: "flex",
    alignItems: "center",
  },
  textArea: {
    flex: 1,
    padding: "12px 20px",
    border: "1px solid rgba(0, 0, 0, 0.15)",
    borderRadius: "24px",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    resize: "none",
    overflow: "hidden",
    height: "44px",
    maxHeight: "150px",
    lineHeight: "20px",
    fontFamily: "inherit",
    "&::placeholder": {
      color: "#9e9e9e",
      opacity: 1,
      lineHeight: "20px",
    },
    "&:focus": {
      borderColor: "#2196F3",
      boxShadow: "0 0 0 2px rgba(33, 150, 243, 0.15)",
    },
    "&:hover": {
      borderColor: "#90CAF9",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
      backgroundColor: "#FAFAFA",
    },
  },
  sendButton: {
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "44px",
    height: "44px",
    marginLeft: "12px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    flexShrink: 0,
    "&:hover": {
      backgroundColor: "#1976d2",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
    color: "#9e9e9e",
    cursor: "not-allowed",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      transform: "none",
      boxShadow: "none",
    },
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: "4px",
  },
  typingIndicator: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    padding: "12px 16px",
    borderRadius: "18px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    gap: "4px",
    margin: "0 12px 0 48px",
  },
  header: {
    padding: "16px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  },
};

// コードハイライト、Markdown、KaTeXのスタイル
const globalStyle = document.createElement('style');
globalStyle.innerHTML = `
  /* KaTeXスタイルの調整 */
  .katex-display {
    margin: 1em 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 8px 0;
    background-color: #f8f9fa;
    border-radius: 4px;
  }
  
  .katex {
    font-size: 1.1em;
  }
  
  .katex-display > .katex {
    font-size: 1.21em;
    display: flex !important;
    justify-content: center;
  }
  
  /* インライン数式のスタイル */
  .katex-inline {
    padding: 0 2px;
  }
  
  /* 数式のスクロールバーがあるときの処理 */
  .katex-display::-webkit-scrollbar {
    height: 6px;
  }
  
  .katex-display::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 3px;
  }
  
  .katex-display::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  
  /* コードブロックのスタイル */
  .code-block-wrapper {
    margin: 16px 0;
    border-radius: 6px;
    overflow: hidden;
    background-color: #f6f8fa;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .code-block-header {
    background-color: #e1e4e8;
    padding: 6px 16px;
    font-size: 12px;
    font-family: monospace;
    color: #24292e;
    font-weight: 500;
    border-bottom: 1px solid #d1d5da;
  }
  
  pre {
    margin: 0;
    padding: 16px;
    overflow-x: auto;
    font-size: 14px;
    line-height: 1.45;
  }
  
  code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    margin: 0;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
  }
  
  pre code {
    background-color: transparent;
    padding: 0;
    margin: 0;
    font-size: 100%;
    word-break: normal;
    white-space: pre;
    overflow: visible;
  }
  
  /* マークダウンの表スタイル */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
    display: block;
    overflow-x: auto;
  }
  
  th, td {
    border: 1px solid #dfe2e5;
    padding: 6px 13px;
  }
  
  th {
    background-color: #f6f8fa;
    font-weight: 600;
  }
  
  tr:nth-child(2n) {
    background-color: #f6f8fa;
  }
  
  /* テキストエリアのプレースホルダーを中央に配置するスタイル */
  .text-area-center-placeholder {
    padding-top: 12px;
    padding-bottom: 12px;
    display: flex;
    align-items: center;
  }
  
  .text-area-center-placeholder::placeholder {
    display: flex;
    align-items: center;
    line-height: 20px;
  }
  
  /* テキストエリアとボタンのホバーエフェクト */
  textarea:hover {
    border-color: #90CAF9 !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08) !important;
    background-color: #FAFAFA !important;
  }
  
  .send-button {
    transition: all 0.2s ease !important;
  }
  
  .send-button:hover:not(:disabled) {
    background-color: #1976d2 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  }
  
  /* Markdownのリスト調整 */
  ul, ol {
    padding-left: 20px;
  }
  
  blockquote {
    margin-left: 0;
    padding-left: 16px;
    border-left: 4px solid #dfe2e5;
    color: #6a737d;
  }
  
  a {
    color: #0366d6;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  /* タイピングアニメーション */
  .typing-indicator span {
    width: 8px;
    height: 8px;
    background-color: #2196F3;
    border-radius: 50%;
    display: inline-block;
    opacity: 0.6;
    animation: typingAnimation 1.4s infinite ease-in-out both;
  }
  
  .typing-indicator span:nth-child(1) {
    animation-delay: 0s;
  }
  
  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typingAnimation {
    0%, 80%, 100% {
      transform: scale(0.6);
    }
    40% {
      transform: scale(1);
    }
  }
`;
document.head.appendChild(globalStyle);

export default AIChat; 