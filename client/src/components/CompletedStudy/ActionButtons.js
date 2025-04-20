import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles';

const ActionButtons = ({
  quizGenerated,
  isGeneratingQuiz,
  handleGenerateQuiz,
  isMobile
}) => {
  return (
    <div style={styles.actionsSection}>
      {quizGenerated ? (
        <>
          <Link to="/review-quizzes" style={isMobile ? {...styles.quizButton, ...styles.mobileButton} : styles.quizButton}>
            復習問題を確認する
          </Link>
          <Link to="/" style={isMobile ? {...styles.homeButton, ...styles.mobileButton} : styles.homeButton}>
            ホームに戻る
          </Link>
        </>
      ) : (
        <>
          <button 
            onClick={handleGenerateQuiz} 
            disabled={isGeneratingQuiz}
            style={{
              ...styles.quizButton,
              ...(isGeneratingQuiz ? styles.disabledButton : {}),
              ...(isMobile ? styles.mobileButton : {})
            }}
          >
            {isGeneratingQuiz ? (
              <>
                <span style={styles.loadingIndicator}></span> 
                復習問題を作成中...
              </>
            ) : (
              isMobile ? '復習問題作成' : 'チャットから復習問題を作成'
            )}
          </button>
          <Link to="/" style={isMobile ? {...styles.homeButton, ...styles.mobileButton} : styles.homeButton}>
            ホームに戻る
          </Link>
        </>
      )}
    </div>
  );
};

export default ActionButtons; 