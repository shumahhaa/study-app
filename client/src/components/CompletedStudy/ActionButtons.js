import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles';

const ActionButtons = ({
  quizGenerated,
  isGeneratingQuiz,
  handleGenerateQuiz
}) => {
  return (
    <div style={styles.actionsSection}>
      {quizGenerated ? (
        <>
          <Link to="/review-quizzes" style={styles.quizButton}>
            復習問題を確認する
          </Link>
          <Link to="/" style={styles.homeButton}>
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
              ...(isGeneratingQuiz ? styles.disabledButton : {})
            }}
          >
            {isGeneratingQuiz ? (
              <>
                <span style={styles.loadingIndicator}></span> 
                復習問題を作成中...
              </>
            ) : (
              'チャットから復習問題を作成'
            )}
          </button>
          <Link to="/" style={styles.homeButton}>
            ホームに戻る
          </Link>
        </>
      )}
    </div>
  );
};

export default ActionButtons; 