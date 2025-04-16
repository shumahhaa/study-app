import React from 'react';
import styles from './styles';

// 学習コントロールボタンを表示するコンポーネント
const ControlButtons = ({ 
  onStop, 
  onAbandon,
  isMobile
}) => {
  // モバイル用のボタンスタイル
  const mobileButtonStyle = {
    flex: 1,
    marginTop: 0
  };

  return (
    <div style={isMobile ? styles.controlsContainerMobile : styles.controlsContainer}>
      <button
        onClick={onStop}
        className="stop-button"
        style={isMobile ? mobileButtonStyle : {}}
      >
        学習を終了
      </button>
      
      <button
        onClick={onAbandon}
        className="abandon-button"
        style={isMobile ? mobileButtonStyle : {}}
      >
        学習を放棄
      </button>
    </div>
  );
};

export default ControlButtons; 