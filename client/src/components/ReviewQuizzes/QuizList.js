import React from 'react';
import styles from './styles';
import QuizCard from './QuizCard';
import { isDueToday, toDateObject } from './utils';

// クイズリストを表示するコンポーネント
const QuizList = ({ 
  quizzes, 
  searchTerm, 
  filterMode, 
  onQuizSelect, 
  onDeleteQuiz 
}) => {
  
  // 問題を復習ステータスでフィルタリングする
  const filterQuizzes = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filtered = quizzes;
    
    if (searchTerm) {
      filtered = filtered.filter(quiz => 
        quiz.studyTopic?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterMode === 'due_today') {
      filtered = filtered.filter(quiz => {
        if (!quiz.nextReviewDate || quiz.reviewStatus === false) {
          return false;
        }
        
        const nextReview = toDateObject(quiz.nextReviewDate);
        if (!nextReview) return false;
        
        // 次の復習日が今日以前の場合を「今日の復習」とする
        const nextReviewDay = new Date(nextReview);
        nextReviewDay.setHours(0, 0, 0, 0);
        return nextReviewDay <= today;
      });
    } else if (filterMode === 'completed') {
      filtered = filtered.filter(quiz => quiz.reviewStatus === false);
    }
    
    return filtered;
  };

  const filteredQuizzes = filterQuizzes();

  if (filteredQuizzes.length === 0) {
    return (
      <div style={styles.noQuizzes}>
        <p>
          {filterMode === 'due_today' 
            ? '今日復習する問題はありません。まだ復習の時期に達していない問題があるか確認するには「すべて」を選択してください。' 
            : filterMode === 'completed'
              ? '復習が完了した問題はありません。復習サイクルを完了するとここに表示されます。'
              : '復習問題がまだありません。学習セッション終了時に作成できます。'}
        </p>
      </div>
    );
  }

  return (
    <div style={styles.quizList}>
      {filteredQuizzes.map(quiz => (
        <QuizCard 
          key={quiz.id} 
          quiz={quiz} 
          onClick={() => onQuizSelect(quiz)}
          onDelete={onDeleteQuiz}
        />
      ))}
    </div>
  );
};

export default QuizList; 