import React from 'react';
import styles from './styles';
import { formatDate, isDueToday } from './utils';
import { toDateObject } from './utils';

// クイズカードを表示するコンポーネント
const QuizCard = ({ quiz, onClick, onDelete }) => {
  
  // カードのスタイルを取得する関数
  const getQuizCardStyle = () => {
    if (!quiz) return styles.quizCard;
    
    const baseStyle = { ...styles.quizCard };
    
    // 完了済みの場合は緑色の線と薄緑色の背景
    if (quiz.reviewStatus === false) {
      return { 
        ...baseStyle, 
        borderLeft: '5px solid #4CAF50',
        paddingLeft: '1.2rem',
        backgroundColor: 'rgba(76, 175, 80, 0.05)'
      };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextReviewDate = toDateObject(quiz.nextReviewDate);
    
    // 次の復習日が過去の場合（期限切れ）は赤色の線と薄い赤色の背景
    if (nextReviewDate && nextReviewDate < today) {
      return { 
        ...baseStyle, 
        borderLeft: '5px solid #f44336',
        paddingLeft: '1.2rem',
        backgroundColor: 'rgba(244, 67, 54, 0.05)'
      };
    }
    
    // 今日が復習日の場合は青色の線と薄青色の背景
    if (nextReviewDate && isDueToday(quiz)) {
      return { 
        ...baseStyle, 
        borderLeft: '5px solid #2196F3',
        paddingLeft: '1.2rem',
        backgroundColor: 'rgba(33, 150, 243, 0.05)'
      };
    }
    
    // それ以外（未来の復習予定）は灰色の線と薄いグレーの背景
    return { 
      ...baseStyle, 
      borderLeft: '5px solid #9e9e9e',
      paddingLeft: '1.2rem',
      backgroundColor: 'rgba(158, 158, 158, 0.05)'
    };
  };

  return (
    <div 
      key={quiz.id} 
      style={getQuizCardStyle()}
      onClick={onClick}
      className="quiz-card"
    >
      <div style={styles.quizCardHeader}>
        <h3 style={styles.quizTopicTitle}>{quiz.studyTopic}</h3>
        <button
          style={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation(); // イベント伝播を防止
            onDelete(quiz.id);
          }}
          title="この復習問題を削除"
          className="delete-button"
        >
          <span style={styles.deleteIcon}>×</span>
        </button>
      </div>
      <p style={styles.quizInfo}>
        問題数: {quiz.questions?.length || 0}問
      </p>
      <div style={styles.reviewInfo}>
        <span style={styles.nextReviewLabel}>次の復習:</span>
        <span style={{
          ...styles.nextReviewDate,
          ...(quiz.reviewStatus === false 
            ? styles.completedReview 
            : isDueToday(quiz) 
              ? styles.todayReview 
              : (quiz.nextReviewDate && toDateObject(quiz.nextReviewDate) < new Date()) 
                ? styles.overdueReview 
                : styles.futureReview)
        }}>
          {quiz.reviewStatus === false 
            ? '全ステップ完了' 
            : formatDate(quiz.nextReviewDate)}
        </span>
      </div>
    </div>
  );
};

export default QuizCard; 