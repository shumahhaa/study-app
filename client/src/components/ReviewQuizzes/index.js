import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { fetchReviewQuizzes, updateReviewQuiz, deleteReviewQuiz } from '../../utils/api';
import { DelayedLoader } from '../../components/Common';
import styles from './styles';
import GlobalStyles from './GlobalStyles';
import QuizList from './QuizList';
import QuizDetail from './QuizDetail';
import FilterControls from './FilterControls';
import ConfirmDelete from './ConfirmDelete';

const ReviewQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('due_today'); // 'due_today', 'all', 'completed'
  const [confirmDelete, setConfirmDelete] = useState(null); // 削除確認用の状態

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // バックエンドAPIを使用して復習問題を取得
        const fetchedQuizzes = await fetchReviewQuizzes();
        
        setQuizzes(fetchedQuizzes);
        setLoading(false);
      } catch (error) {
        console.error('復習問題の取得中にエラーが発生しました:', error);
        setError('復習問題を読み込めませんでした。再度お試しください。');
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, []);

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
  };

  // 復習完了を記録する関数
  const markReviewAsCompleted = async (quizId) => {
    try {
      const quizToUpdate = quizzes.find(q => q.id === quizId);
      if (!quizToUpdate) return;
      
      const currentReviewIndex = quizToUpdate.currentReviewIndex;
      
      // 現在のステップを完了としてマーク
      const updatedSchedule = [...quizToUpdate.reviewSchedule];
      updatedSchedule[currentReviewIndex].completed = true;
      
      // 次のレビュースケジュールがあれば更新
      let nextReviewDate = null;
      let nextReviewIndex = currentReviewIndex + 1;
      let reviewStatus = quizToUpdate.reviewStatus;
      
      if (nextReviewIndex < updatedSchedule.length) {
        // 次の復習ステップが存在する場合
        const nextInterval = updatedSchedule[nextReviewIndex].interval;
        // 次の復習日を計算（例: 1d = 1日後, 3d = 3日後, 1w = 1週間後, 2w = 2週間後, 1m = 1ヶ月後）
        const now = new Date();
        let daysToAdd = 1;
        
        if (nextInterval === '1d') daysToAdd = 1;
        else if (nextInterval === '3d') daysToAdd = 3;
        else if (nextInterval === '1w') daysToAdd = 7;
        else if (nextInterval === '2w') daysToAdd = 14;
        else if (nextInterval === '1m') daysToAdd = 30;
        
        nextReviewDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        reviewStatus = true; // まだ復習が続くのでtrue
      } else {
        // すべてのステップが完了した場合
        reviewStatus = false; // 復習完了でfalse
      }
      
      // バックエンドAPIを使用して更新
      await updateReviewQuiz(quizId, {
        reviewSchedule: updatedSchedule,
        currentReviewIndex: nextReviewIndex,
        nextReviewDate: nextReviewDate,
        reviewStatus: reviewStatus,
        lastReviewedAt: new Date()
      });
      
      // ローカルステートを更新
      setQuizzes(prev => prev.map(q => 
        q.id === quizId ? {
          ...q,
          reviewSchedule: updatedSchedule,
          currentReviewIndex: nextReviewIndex,
          nextReviewDate: nextReviewDate,
          reviewStatus: reviewStatus,
          lastReviewedAt: new Date()
        } : q
      ));
      
      // 一覧ページに戻る
      setSelectedQuiz(null);
    } catch (error) {
      console.error('復習更新エラー:', error);
      setError('復習記録の更新に失敗しました。再度お試しください。');
    }
  };

  // 問題削除時の確認ダイアログを表示
  const promptDeleteQuiz = (quizId) => {
    setConfirmDelete(quizId);
  };

  // 問題削除の実行
  const confirmDeleteQuiz = async () => {
    if (!confirmDelete) return;
    
    try {
      // バックエンドAPIを使用して削除
      await deleteReviewQuiz(confirmDelete);
      
      // ローカルステートを更新
      setQuizzes(prev => prev.filter(q => q.id !== confirmDelete));
      setSelectedQuiz(null);
      setConfirmDelete(null);
    } catch (error) {
      console.error('問題削除エラー:', error);
      setError('問題の削除に失敗しました。再度お試しください。');
    }
  };

  if (error) {
    return (
      <Layout>
        <div style={styles.error}>{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <GlobalStyles />
      <div style={styles.container}>
        <DelayedLoader loading={loading}>
          <div style={styles.loading}>読み込み中...</div>
        </DelayedLoader>
        
        {!loading && selectedQuiz ? (
          <QuizDetail 
            quiz={selectedQuiz} 
            onBackToList={handleBackToList} 
            onMarkCompleted={markReviewAsCompleted}
          />
        ) : !loading && (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h1 style={{
                ...styles.title,
                margin: 0,
                textAlign: 'left'
              }}>復習問題一覧</h1>
              
              <FilterControls 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterMode={filterMode}
                setFilterMode={setFilterMode}
              />
            </div>
            
            {/* 削除確認ダイアログ */}
            {confirmDelete && (
              <ConfirmDelete 
                onCancel={() => setConfirmDelete(null)} 
                onConfirm={confirmDeleteQuiz} 
              />
            )}
            
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="トピックで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            
            <QuizList 
              quizzes={quizzes}
              searchTerm={searchTerm}
              filterMode={filterMode}
              onQuizSelect={handleQuizSelect}
              onDeleteQuiz={promptDeleteQuiz}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ReviewQuizzesPage; 