import React from 'react';
import styles from './styles';

// 学習コントロールボタンを表示するコンポーネント
const ControlButtons = ({ 
  onStop, 
  onAbandon 
}) => {
  return (
    <div style={styles.controlsContainer}>
      <button
        onClick={onStop}
        className="stop-button"
      >
        学習を終了
      </button>
      
      <button
        onClick={onAbandon}
        className="abandon-button"
      >
        学習を放棄
      </button>
    </div>
  );
};

export default ControlButtons; 