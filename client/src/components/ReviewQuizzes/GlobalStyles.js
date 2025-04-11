import { useEffect } from 'react';

// グローバルスタイルを追加するユーティリティコンポーネント
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* ホバー効果のアニメーション */
      @keyframes buttonPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null; // このコンポーネントは何もレンダリングしない
};

export default GlobalStyles; 