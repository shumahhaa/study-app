import React, { useEffect } from 'react';

/**
 * StudyHistoryで使用するグローバルスタイルを適用するコンポーネント
 */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .study-history-table tr:hover {
        background-color: #f5f5f5;
      }
      
      .delete-button:hover {
        background-color: #f44336 !important;
        color: white !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(244, 67, 54, 0.2);
      }
      
      @media (max-width: 768px) {
        .table-container {
          margin: 0 -15px;
          width: calc(100% + 30px);
          border-radius: 0;
        }
        
        .study-history-table {
          font-size: 14px;
        }
        
        .study-history-table th,
        .study-history-table td {
          padding: 10px 8px;
        }
        
        .delete-text {
          display: none;
        }
        
        .delete-button {
          padding: 5px !important;
          min-width: 30px !important;
          width: 30px;
          height: 30px;
        }
        
        .advanced-search-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default GlobalStyles; 