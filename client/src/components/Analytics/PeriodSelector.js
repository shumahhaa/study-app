import React, { useEffect } from "react";
import styles from "./styles";

const PeriodSelector = ({ selectedPeriod, setSelectedPeriod }) => {
  // グローバルスタイルを追加
  const addGlobalStyles = () => {
    // 期間ボタンのスタイルを追加
    if (!document.getElementById('period-button-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'period-button-styles';
      styleElement.innerHTML = `
        .period-button {
          padding: 8px 16px;
          border: none;
          background-color: #f5f5f5;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .period-button:hover {
          background-color: #e0e0e0;
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .period-button-active {
          background-color: #2196F3;
          color: white;
        }
        
        .period-button-active:hover {
          background-color: #1976D2;
          box-shadow: 0 2px 5px rgba(33, 150, 243, 0.3);
        }
      `;
      document.head.appendChild(styleElement);
    }
  };

  // コンポーネントがマウントされたときにスタイルを追加
  useEffect(() => {
    addGlobalStyles();
  }, []);

  return (
    <div style={styles.periodSelector}>
      <button 
        onClick={() => setSelectedPeriod("week")}
        className={`period-button ${selectedPeriod === "week" ? "period-button-active" : ""}`}
      >
        直近7日間
      </button>
      <button 
        onClick={() => setSelectedPeriod("month")}
        className={`period-button ${selectedPeriod === "month" ? "period-button-active" : ""}`}
      >
        直近30日間
      </button>
      <button 
        onClick={() => setSelectedPeriod("year")}
        className={`period-button ${selectedPeriod === "year" ? "period-button-active" : ""}`}
      >
        直近1年間
      </button>
      <button 
        onClick={() => setSelectedPeriod("all")}
        className={`period-button ${selectedPeriod === "all" ? "period-button-active" : ""}`}
      >
        全期間
      </button>
    </div>
  );
};

export default PeriodSelector; 