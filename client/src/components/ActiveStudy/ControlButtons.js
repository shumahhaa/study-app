import React from 'react';
import styles from './styles';

// 学習コントロールボタンを表示するコンポーネント
const ControlButtons = ({ 
  isPaused, 
  onPause, 
  onResume, 
  onStop, 
  onAbandon 
}) => {
  return (
    <div style={styles.controlsContainer}>
      {isPaused ? (
        <button
          onClick={onResume}
          className="action-button"
        >
          再開する
        </button>
      ) : (
        <button
          onClick={onPause}
          className="pause-button"
        >
          一時停止
        </button>
      )}
      
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