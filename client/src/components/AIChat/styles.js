// AIChat用のスタイル定義
export const styles = {
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
    maxWidth: "95%",
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
    backgroundColor: "#4CAF50",
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
    maxWidth: "calc(100% - 60px)",
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
    background: "linear-gradient(135deg, #2196F3 0%, #4CAF50 100%)",
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
  usageCounter: {
    position: "absolute",
    top: "-28px",
    right: "10px",
    fontSize: "12px",
    color: "#666",
    display: "flex",
    gap: "12px",
  },
};

// グローバルCSSスタイル（CSSインジェクション用）
export const injectGlobalStyles = () => {
  const globalStyle = document.createElement('style');
  globalStyle.innerHTML = `
    /* KaTeXスタイルの調整 */
    .katex-display-wrapper {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      margin: 1em 0;
      padding: 8px 0;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
    
    .katex-display {
      margin: 0;
      padding: 0 16px;
      text-align: center;
    }
    
    .katex {
      font-size: 1.1em;
      text-align: center;
    }
    
    .katex-display > .katex {
      font-size: 1.21em;
      display: inline-block;
      text-align: center;
      max-width: 100%;
    }
    
    /* インライン数式のスタイル */
    .katex-inline {
      padding: 0 2px;
    }
    
    /* 数式のスクロールバーがあるときの処理 */
    .katex-display-wrapper::-webkit-scrollbar {
      height: 6px;
    }
    
    .katex-display-wrapper::-webkit-scrollbar-thumb {
      background-color: #c1c1c1;
      border-radius: 3px;
    }
    
    .katex-display-wrapper::-webkit-scrollbar-track {
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
  
  return () => {
    // クリーンアップ関数：スタイル要素を削除
    if (document.head.contains(globalStyle)) {
      document.head.removeChild(globalStyle);
    }
  };
}; 