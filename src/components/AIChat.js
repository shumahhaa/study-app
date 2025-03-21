import React, { useState, useRef, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
import katex from "katex";
import "katex/dist/katex.min.css"; // KaTeXのスタイルをインポート

const AIChat = ({ studyTopic, customStyles = {} }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelName, setModelName] = useState("GPT-3.5"); // モデル名の状態を追加
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);
  const chatStorageKey = `aiChat_${studyTopic}`; // 学習トピックごとに固有のストレージキー

  // OpenAI設定
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // モデル選択用の設定
  const selectedModel = "gpt-3.5-turbo"; // ここでモデルを指定（環境変数から取得することも可能）

  // モデル名とAPI呼び出し用のモデルIDのマッピング
  const modelMapping = {
    "gpt-3.5-turbo": "GPT-3.5",
    "gpt-4-turbo": "GPT-4",
    "gpt-4o": "GPT-4o",
    // 他のモデルを必要に応じて追加
  };

  // 初期化時にモデル名を設定
  useEffect(() => {
    setModelName(modelMapping[selectedModel] || "AI");
  }, [selectedModel]);

  // 初期ウェルカムメッセージを設定する関数
  const setInitialWelcomeMessage = () => {
    const welcomeMessage = {
      role: "assistant",
      content: `こんにちは！「${studyTopic}」について学習中ですね。質問があればいつでも聞いてください。`,
    };
    setMessages([welcomeMessage]);
    
    // セッションストレージに新しいウェルカムメッセージを保存
    sessionStorage.setItem(chatStorageKey, JSON.stringify([welcomeMessage]));
  };

  // ローカルストレージからチャット履歴を読み込む
  useEffect(() => {
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
  }, [studyTopic, chatStorageKey]);

  // チャット履歴が更新されたらセッションストレージに保存
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(chatStorageKey, JSON.stringify(messages));
    }
  }, [messages, chatStorageKey]);

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
      
      // 学習内容をシステムメッセージとして追加
      const systemMessage = {
        role: "system",
        content: `あなたは学習者のサポートをするAIアシスタントです。学習者は現在「${studyTopic}」について学習しています。簡潔で役立つアドバイスを日本語で提供してください。`
      };
      
      // 新しいユーザーメッセージを追加
      conversationHistory.push({
        role: "user",
        content: input
      });

      const completion = await openai.createChatCompletion({
        model: selectedModel, // 選択したモデルを使用
        messages: [systemMessage, ...conversationHistory],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const botResponse = {
        role: "assistant",
        content: completion.data.choices[0].message.content,
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("OpenAI APIエラー:", error);
      
      const errorMessage = {
        role: "assistant",
        content: "すみません、エラーが発生しました。しばらくしてからもう一度お試しください。",
        isError: true,
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      // APIレスポンス後に入力欄に自動でフォーカスを戻す
      setTimeout(() => {
        textAreaRef.current?.focus();
        // 新しいメッセージが追加されたら、ページの最下部にスクロール
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    }
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

  // チャット履歴をクリアする関数（手動クリア用）
  const clearChat = () => {
    if (window.confirm("チャット履歴をクリアしますか？")) {
      sessionStorage.removeItem(chatStorageKey);
      setInitialWelcomeMessage();
    }
  };

  // 数式を検出して変換する関数
  const renderMath = (text) => {
    // インライン数式 $...$ または \(...\) を検出
    let rendered = text.replace(/\$(.+?)\$|\\\((.+?)\\\)/g, (match, p1, p2) => {
      const formula = p1 || p2;
      try {
        return katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false
        });
      } catch (e) {
        console.error("数式レンダリングエラー:", e);
        return match; // レンダリングに失敗した場合は元の文字列を返す
      }
    });

    // ディスプレイモード数式 $$...$$ または \[...\] を検出
    rendered = rendered.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g, (match, p1, p2) => {
      const formula = p1 || p2;
      try {
        return `<div class="katex-display">${katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false
        })}</div>`;
      } catch (e) {
        console.error("数式レンダリングエラー:", e);
        return match; // レンダリングに失敗した場合は元の文字列を返す
      }
    });

    return rendered;
  };

  // メッセージコンテンツを段落と数式でレンダリングする関数
  const renderMessageContent = (content) => {
    // テキストを段落に分割
    return content.split('\n\n').map((paragraph, i) => {
      // 段落内の数式をレンダリング
      const renderedParagraph = paragraph.split('\n').map((line, j) => {
        // 数式をHTMLに変換
        const renderedLine = renderMath(line);
        
        return (
          <React.Fragment key={j}>
            <span dangerouslySetInnerHTML={{ __html: renderedLine }} />
            {j < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        );
      });
      
      // 最初と最後の段落かどうかに基づいてスタイルを変更
      const isFirstParagraph = i === 0;
      const isLastParagraph = i === content.split('\n\n').length - 1;
      
      return (
        <p 
          key={i} 
          style={{
            ...styles.paragraph,
            marginTop: isFirstParagraph ? 0 : 8,
            marginBottom: isLastParagraph ? 0 : 8
          }}
        >
          {renderedParagraph}
        </p>
      );
    });
  };

  return (
    <div style={{ ...styles.container, ...customStyles }}>
      <div style={styles.header}>
        <h3 style={styles.title}>AIアシスタント</h3>
        <div style={styles.headerActions}>
          <button 
            onClick={clearChat} 
            style={styles.clearButton}
            title="チャット履歴をクリア"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
            </svg>
          </button>
          <div style={styles.modelBadge}>{modelName}</div>
        </div>
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
                {renderMessageContent(message.content)}
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
            <div style={styles.typingIndicator}>
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
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    marginBottom: "0",
    height: "100%",
    position: "relative",
  },
  header: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  modelBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "rgba(255, 255, 255, 0.7)",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
    },
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
  paragraph: {
    margin: "8px 0",
    padding: 0,
  },
  inputContainer: {
    padding: "16px 70px",
    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: "0",
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomLeftRadius: "16px",
    borderBottomRightRadius: "16px",
    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)",
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
    "& span": {
      width: "8px",
      height: "8px",
      backgroundColor: "#2196F3",
      borderRadius: "50%",
      display: "inline-block",
      opacity: "0.6",
      animation: "typingAnimation 1.4s infinite ease-in-out both",
    },
    "& span:nth-child(1)": {
      animationDelay: "0s",
    },
    "& span:nth-child(2)": {
      animationDelay: "0.2s",
    },
    "& span:nth-child(3)": {
      animationDelay: "0.4s",
    },
  },
  "@keyframes typingAnimation": {
    "0%, 80%, 100%": {
      transform: "scale(0.6)",
    },
    "40%": {
      transform: "scale(1)",
    },
  },
};

// KaTeX用のカスタムスタイルを追加
const globalStyle = document.createElement('style');
globalStyle.innerHTML = `
  .katex-display {
    margin: 1em 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 5px 0;
  }
  
  .katex {
    font-size: 1.1em;
  }
  
  .katex-display > .katex {
    font-size: 1.21em;
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
`;
document.head.appendChild(globalStyle);

export default AIChat; 