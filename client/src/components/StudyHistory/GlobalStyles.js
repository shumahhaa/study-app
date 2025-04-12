import React, { useEffect } from 'react';

/**
 * StudyHistoryで使用するグローバルスタイルを適用するコンポーネント
 */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .study-history-table tr:hover {
        background-color: #f0f8ff !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }
      
      .study-history-table th:hover {
        background-color: #c8e6c9 !important;
      }
      
      .delete-button:hover {
        background-color: #f44336 !important;
        color: white !important;
      }
      
      .search-input:hover, .search-input:focus {
        border-color: #4CAF50 !important;
        box-shadow: 0 1px 3px rgba(76, 175, 80, 0.3) !important;
      }
      
      .advanced-search-button:hover {
        background-color: #4CAF50 !important;
        color: white !important;
      }
      
      .advanced-search-button.active {
        background-color: #388E3C !important;
        color: white !important;
      }
      
      .reset-button:hover {
        background-color: #4CAF50 !important;
        color: white !important;
      }
      
      .reset-filters-button:hover {
        background-color: #4CAF50 !important;
      }
      
      input[type="text"]:focus, input[type="number"]:focus, input[type="date"]:focus, select:focus {
        border-color: #4CAF50 !important;
        box-shadow: 0 1px 3px rgba(76, 175, 80, 0.2) !important;
        outline: none;
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