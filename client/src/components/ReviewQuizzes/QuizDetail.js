import React, { useState } from 'react';
import styles from './styles';
import QuestionItem from './QuestionItem';
import { formatDateSafe, isDueToday } from './utils';

// クイズ詳細を表示するコンポーネント
const QuizDetail = ({ quiz, onBackToList, onMarkCompleted }) => {
  const [showAnswers, setShowAnswers] = useState({});
  
  // 回答の表示/非表示を切り替え
  const toggleAnswer = (index) => {
    setShowAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const isQuizDueToday = isDueToday(quiz);
  
  return (
    <div style={styles.container}>
      <div style={styles.quizDetailHeader}>
        <button 
          style={styles.backButton}
          onClick={onBackToList}
          className="back-button"
        >
          <span style={{ marginRight: '6px', fontSize: '18px' }}>←</span>
          一覧に戻る
        </button>
        
        <h2 style={styles.quizTitle}>{quiz.studyTopic}</h2>
        
        <div style={styles.quizMeta}>
          <p style={styles.quizDate}>
            作成日: {formatDateSafe(quiz.createdAt)}
          </p>
        </div>
      </div>
      
      <div style={styles.questionsList}>
        {quiz.questions.map((question, index) => (
          <QuestionItem
            key={index}
            question={question}
            index={index}
            showAnswer={showAnswers[index]}
            onToggleAnswer={() => toggleAnswer(index)}
          />
        ))}
      </div>
      
      <div style={styles.reviewActions}>
        <button 
          style={{
            ...styles.completeReviewButton,
            ...(isQuizDueToday ? {} : styles.disabledReviewButton)
          }}
          onClick={() => onMarkCompleted(quiz.id)}
          disabled={
            quiz.reviewStatus === false || 
            (quiz.currentReviewIndex >= 
              (quiz.reviewSchedule?.length || 0)) ||
            !isQuizDueToday
          }
          title={!isQuizDueToday ? "今日の復習問題ではないため完了できません" : ""}
          className={isQuizDueToday ? "complete-review-button" : ""}
        >
          {isQuizDueToday 
            ? "この復習ステップを完了する" 
            : quiz.reviewStatus === false
              ? "全ての復習ステップが完了しています"
              : "まだ復習の時期ではありません"}
        </button>
      </div>
    </div>
  );
};

export default QuizDetail; 