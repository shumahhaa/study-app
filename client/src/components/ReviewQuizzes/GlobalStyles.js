import { useEffect } from 'react';

// グローバルスタイルを追加するユーティリティコンポーネント
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* 全体の背景色 */
      body {
        background-color: #f6f8fa;
      }
      
      /* ホバー効果のアニメーション */
      @keyframes buttonPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      /* カスタム緑色ナビゲーションリンク */
      .green-nav-link {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 16px;
        color: #555;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        transition: color 0.3s ease, background-color 0.3s ease;
        margin: 0 4px;
        min-width: 80px;
        height: 36px;
        background-color: transparent;
        border: none;
        position: relative;
        cursor: pointer;
      }
      
      .green-nav-link:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #4CAF50 0%, #388E3C 100%);
        transition: width 0.3s ease;
      }
      
      .green-nav-link:hover {
        background-color: rgba(76, 175, 80, 0.05);
        color: #388e3c;
      }
      
      .green-nav-link:hover:after {
        width: 70%;
      }
      
      .green-active-link {
        color: #4CAF50;
        font-weight: 600;
        background-color: rgba(76, 175, 80, 0.08);
      }
      
      .green-active-link:after {
        width: 70%;
      }
      
      .green-active-link:hover {
        background-color: rgba(76, 175, 80, 0.12);
        color: #2E7D32;
      }
      
      .quiz-card {
        transition: box-shadow 0.3s ease !important;
      }
      
      .quiz-card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
      }
      
      .quiz-card:active {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        transition: box-shadow 0.1s !important;
      }
      
      .back-button {
        transition: all 0.3s ease !important;
        padding: 0.6rem 1.2rem !important;
        font-size: 0.9rem !important;
        border-radius: 8px !important;
        display: inline-flex !important;
      }
      
      .back-button:hover {
        background-color: #e9e9e9 !important;
        color: #333 !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        border: 1px solid #d5d5d5 !important;
      }
      
      .toggle-answer-button:hover {
        background-color: rgba(76, 175, 80, 0.08) !important;
        color: #388e3c !important;
        box-shadow: 0 1px 3px rgba(76, 175, 80, 0.15) !important;
        border: 1px solid #4CAF50 !important;
      }
      
      .toggle-answer-button.active-toggle-button:hover {
        background-color: #eeeeee !important;
        color: #222 !important;
        border: 1px solid #cccccc !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08) !important;
      }
      
      .complete-review-button:hover {
        background-color: #388e3c !important;
        box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2) !important;
        border: none !important;
      }
      
      .filter-button {
        transition: all 0.2s ease !important;
      }
      
      .filter-button:hover {
        background-color: transparent !important;
        color: #4CAF50 !important;
        border-bottom: 2px solid rgba(76, 175, 80, 0.3) !important;
      }
      
      .filter-button.active-filter:hover {
        background-color: transparent !important;
        color: #4CAF50 !important;
        border-bottom: 2px solid #4CAF50 !important;
      }
      
      .delete-button {
        transition: all 0.2s ease !important;
      }
      
      .delete-button:hover {
        background-color: #f44336 !important;
        color: white !important;
        border: 1px solid #f44336 !important;
      }
      
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
      
      /* その他のスタイル */
      .completed-mark {
        color: #4CAF50;
        margin-left: 8px;
      }
      
      .review-status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        margin-left: 10px;
      }
      
      .status-due, .status-overdue {
        background-color: #ffebee;
        color: #d32f2f;
      }
      
      .status-today {
        background-color: #e3f2fd;
        color: #1976d2;
      }
      
      .status-scheduled {
        background-color: #e0f2f1;
        color: #00897b;
      }
      
      .status-completed {
        background-color: #e8f5e9;
        color: #388e3c;
      }
      
      .confirm-delete-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      
      .confirm-delete-dialog {
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }
      
      .toggle-answer-button {
        transition: all 0.2s ease;
      }
      
      .toggle-answer-button:hover {
        background-color: #f5f5f5;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      }
      
      .active-toggle-button {
        background-color: #f5f5f5;
      }
      
      .filter-button {
        transition: all 0.2s ease;
      }
      
      .filter-button:hover {
        color: #3f51b5;
      }
      
      .active-filter {
        color: #3f51b5;
        font-weight: 600;
      }
      
      .back-button:hover {
        background-color: #e0e0e0;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      }
      
      /* レスポンシブスタイル - モバイル対応 */
      @media screen and (max-width: 768px) {
        .header-container {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 16px;
        }
        
        .header-container h1 {
          margin-bottom: 10px !important;
          text-align: center !important;
          width: 100% !important;
        }
        
        .filter-controls {
          width: 100% !important;
          justify-content: center !important;
          gap: 10px !important;
          margin-bottom: 10px !important;
        }
        
        .green-nav-link {
          padding: 8px 10px;
          min-width: 70px;
          font-size: 13px;
        }
        
        /* QuizDetail スマホ対応 */
        .quiz-detail-header {
          flex-direction: column !important;
          align-items: flex-start !important;
          padding: 1rem !important;
          gap: 1rem;
        }
        
        .quiz-title {
          font-size: calc(1.3rem + 2px) !important;
          text-align: left !important;
          padding: 0 !important;
          width: 100% !important;
          order: 1;
        }
        
        .back-button {
          width: auto !important;
          order: 0;
        }
        
        .quiz-meta {
          width: 100% !important;
          justify-content: flex-start !important;
          order: 2;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null; // このコンポーネントは何もレンダリングしない
};

export default GlobalStyles; 