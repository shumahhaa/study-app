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
          background-color: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          color: #555;
          position: relative;
          font-size: 14px;
        }
        
        .period-button:hover {
          background-color: rgba(76, 175, 80, 0.05);
          color: #388e3c;
        }
        
        .period-button:after {
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
        
        .period-button:hover:after {
          width: 70%;
        }
        
        .period-button-active {
          background-color: rgba(76, 175, 80, 0.08);
          color: #4CAF50;
          font-weight: 600;
        }
        
        .period-button-active:after {
          width: 70%;
        }
        
        .period-button-active:hover {
          background-color: rgba(76, 175, 80, 0.12);
          color: #2E7D32;
        }
        
        /* モバイル表示の調整 */
        @media (max-width: 768px) {
          .period-button {
            padding: 6px 9px;
            font-size: 15px;
            margin: 0 1px;
            white-space: nowrap;
          }
          
          .period-button-active:after {
            width: 60%;
          }
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