import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Layout from '../components/Layout';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const ReviewQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showAnswers, setShowAnswers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('due_today'); // 'due_today', 'all', 'completed'
  const [confirmDelete, setConfirmDelete] = useState(null); // 削除確認用の状態

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const q = query(collection(db, 'reviewQuizzes'), orderBy('nextReviewDate', 'asc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedQuizzes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          nextReviewDate: doc.data().nextReviewDate?.toDate() || new Date(),
          reviewSchedule: doc.data().reviewSchedule?.map(schedule => ({
            ...schedule,
            dueDate: schedule.dueDate?.toDate() || new Date()
          })) || []
        }));
        
        setQuizzes(fetchedQuizzes);
        setLoading(false);
      } catch (error) {
        console.error('復習問題の取得中にエラーが発生しました:', error);
        setError('復習問題を読み込めませんでした。再度お試しください。');
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, []);
  
  const toggleAnswer = (index) => {
    setShowAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    // 初期状態ですべての回答を非表示に
    const initialAnswersState = {};
    quiz.questions.forEach((_, index) => {
      initialAnswersState[index] = false;
    });
    setShowAnswers(initialAnswersState);
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
        nextReviewDate = updatedSchedule[nextReviewIndex].dueDate;
        reviewStatus = 'scheduled';
      } else {
        reviewStatus = 'completed';
      }
      
      // Firestoreを更新
      await updateDoc(doc(db, 'reviewQuizzes', quizId), {
        reviewSchedule: updatedSchedule.map(schedule => ({
          ...schedule,
          dueDate: schedule.dueDate
        })),
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
      
      // 警告を表示せずに一覧ページに戻る
      setSelectedQuiz(null);
      
    } catch (error) {
      console.error('復習状態の更新に失敗しました:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    }
  };

  // 日付をフォーマットする関数
  const formatDate = (date) => {
    if (!date) return '不明';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date < today) {
      return '期限切れ';
    } else if (date.getDate() === today.getDate() && 
              date.getMonth() === today.getMonth() && 
              date.getFullYear() === today.getFullYear()) {
      return '今日';
    } else if (date.getDate() === tomorrow.getDate() && 
              date.getMonth() === tomorrow.getMonth() && 
              date.getFullYear() === tomorrow.getFullYear()) {
      return '明日';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

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
        const nextReview = quiz.nextReviewDate;
        return nextReview && nextReview <= new Date() && 
               quiz.reviewStatus !== 'completed';
      });
    } else if (filterMode === 'completed') {
      filtered = filtered.filter(quiz => quiz.reviewStatus === 'completed');
    }
    
    return filtered;
  };

  // 復習ステータスに基づいてクイズカードのスタイルを取得
  const getQuizCardStyle = (quiz) => {
    const baseStyle = styles.quizCard;
    
    if (!quiz.nextReviewDate) return baseStyle;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (quiz.reviewStatus === 'completed') {
      return { ...baseStyle, borderLeft: '4px solid #4CAF50' };
    } else if (quiz.nextReviewDate < today) {
      return { ...baseStyle, borderLeft: '4px solid #f44336' }; // 期限切れ
    } else if (isSameDay(quiz.nextReviewDate, today)) {
      return { ...baseStyle, borderLeft: '4px solid #2196F3' }; // 今日
    } else {
      return { ...baseStyle, borderLeft: '4px solid #9e9e9e' }; // 将来
    }
  };

  // 復習問題が今日の復習対象かどうかをチェックする関数
  const isDueToday = (quiz) => {
    if (!quiz || !quiz.nextReviewDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 次の復習日が今日以前で、まだ完了していない場合
    return quiz.nextReviewDate <= today && quiz.reviewStatus !== 'completed';
  };

  // 同じ日かどうかをチェック
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // 数式を検出して変換する関数
  const renderMath = (text) => {
    if (!text) return '';
    
    // インライン数式 $...$ または \(...\) を検出
    let rendered = text.replace(/\$(.+?)\$|\\\((.+?)\\\)/g, (match, p1, p2) => {
      const formula = p1 || p2;
      try {
        return katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false
        });
      } catch (e) {
        console.error("数式レンダリングエラー:", e);
        return match; // レンダリングに失敗した場合は元の文字列を返す
      }
    });

    // ディスプレイモード数式 $$...$$ または \[...\] を検出
    rendered = rendered.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g, (match, p1, p2) => {
      const formula = p1 || p2;
      try {
        return `<div class="katex-display">${katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false
        })}</div>`;
      } catch (e) {
        console.error("数式レンダリングエラー:", e);
        return match; // レンダリングに失敗した場合は元の文字列を返す
      }
    });

    return rendered;
  };

  // メッセージコンテンツを段落と数式でレンダリングする関数
  const renderContent = (content) => {
    // テキストを段落に分割
    return content.split('\n\n').map((paragraph, i) => {
      // 段落内の数式をレンダリング
      const renderedParagraph = paragraph.split('\n').map((line, j) => {
        // 数式をHTMLに変換
        const renderedLine = renderMath(line);
        
        return (
          <React.Fragment key={j}>
            <span dangerouslySetInnerHTML={{ __html: renderedLine }} />
            {j < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        );
      });
      
      return (
        <p key={i} style={{ margin: i === 0 ? 0 : '8px 0' }}>
          {renderedParagraph}
        </p>
      );
    });
  };

  // 現在の復習ステップを表示
  const getCurrentReviewInfo = (quiz) => {
    if (!quiz.reviewSchedule || quiz.reviewSchedule.length === 0) {
      return '復習スケジュールなし';
    }
    
    const currentIndex = quiz.currentReviewIndex || 0;
    
    if (currentIndex >= quiz.reviewSchedule.length) {
      return '全ての復習完了';
    }
    
    const intervals = ['1日後', '3日後', '1週間後', '2週間後', '1ヶ月後'];
    const currentInterval = intervals[currentIndex] || '次の復習';
    
    return `${currentInterval}の復習`;
  };

  // 復習問題を削除する関数
  const handleDeleteQuiz = async (event, quizId) => {
    // イベントの伝播を停止して、カード自体がクリックされるのを防ぐ
    event.stopPropagation();
    
    // 削除確認ダイアログを表示
    setConfirmDelete(quizId);
  };

  // 削除を確定して実行する関数
  const confirmDeleteQuiz = async () => {
    if (!confirmDelete) return;
    
    try {
      // Firestoreから削除
      await deleteDoc(doc(db, 'reviewQuizzes', confirmDelete));
      
      // ローカルステートを更新
      setQuizzes(prev => prev.filter(quiz => quiz.id !== confirmDelete));
      
      // 確認ダイアログを閉じる
      setConfirmDelete(null);
      
      // 削除成功の警告は表示しない
    } catch (error) {
      console.error('復習問題の削除中にエラーが発生しました:', error);
      alert('エラーが発生しました。もう一度お試しください。');
      
      // 確認ダイアログを閉じる
      setConfirmDelete(null);
    }
  };

  // 削除をキャンセルする関数
  const cancelDeleteQuiz = () => {
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <Layout>
        <div style={styles.loading}>読み込み中...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={styles.error}>{error}</div>
      </Layout>
    );
  }

  if (selectedQuiz) {
    const isQuizDueToday = isDueToday(selectedQuiz);
    
    return (
      <Layout>
        <div style={styles.container}>
          <div style={styles.quizDetailHeader}>
            <button 
              style={styles.backButton}
              onClick={handleBackToList}
              className="back-button"
            >
              一覧に戻る
            </button>
            <h2 style={styles.quizTitle}>{selectedQuiz.studyTopic}</h2>
            <div style={styles.quizMeta}>
              <p style={styles.quizDate}>
                作成日: {selectedQuiz.createdAt.toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
          
          <div style={styles.questionsList}>
            {selectedQuiz.questions.map((question, index) => (
              <div key={index} style={styles.questionCard}>
                <h3 style={styles.questionNumber}>問題 {index + 1}</h3>
                <div style={styles.questionText}>
                  {renderContent(question.question)}
                </div>
                
                <button 
                  style={{
                    ...styles.toggleAnswerButton,
                    ...(showAnswers[index] ? styles.activeToggleButton : {})
                  }}
                  onClick={() => toggleAnswer(index)}
                  className="toggle-answer-button"
                >
                  {showAnswers[index] ? '解答を隠す' : '解答を表示'}
                </button>
                
                {showAnswers[index] && (
                  <div style={styles.answerContainer}>
                    <div style={styles.answerText}>
                      {renderContent(question.answer)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div style={styles.reviewActions}>
            <button 
              style={{
                ...styles.completeReviewButton,
                ...(isQuizDueToday ? {} : styles.disabledReviewButton)
              }}
              onClick={() => markReviewAsCompleted(selectedQuiz.id)}
              disabled={
                selectedQuiz.reviewStatus === 'completed' || 
                (selectedQuiz.currentReviewIndex >= 
                 (selectedQuiz.reviewSchedule?.length || 0)) ||
                !isQuizDueToday
              }
              title={!isQuizDueToday ? "今日の復習問題ではないため完了できません" : ""}
              className={isQuizDueToday ? "complete-review-button" : ""}
            >
              {isQuizDueToday 
                ? "この復習ステップを完了する" 
                : selectedQuiz.reviewStatus === 'completed'
                  ? "全ての復習ステップが完了しています"
                  : "まだ復習の時期ではありません"}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const filteredQuizzes = filterQuizzes();

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>復習問題一覧</h1>
        
        {/* 削除確認ダイアログ */}
        {confirmDelete && (
          <div style={styles.overlay}>
            <div style={styles.dialog}>
              <h3 style={styles.dialogTitle}>
                復習問題を削除しますか？
              </h3>
              <p style={styles.dialogText}>
                削除すると元に戻すことはできません。
              </p>
              <div style={styles.dialogButtons}>
                <button
                  onClick={cancelDeleteQuiz}
                  style={styles.cancelButton}
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmDeleteQuiz}
                  style={styles.confirmButton}
                >
                  削除する
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div style={styles.controlsContainer}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="トピックで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.filterContainer}>
            <button 
              style={{
                ...styles.filterButton, 
                ...(filterMode === 'due_today' ? styles.activeFilter : {})
              }}
              onClick={() => setFilterMode('due_today')}
              className={`filter-button ${filterMode === 'due_today' ? 'active-filter' : ''}`}
            >
              今日の復習
            </button>
            <button 
              style={{
                ...styles.filterButton, 
                ...(filterMode === 'all' ? styles.activeFilter : {})
              }}
              onClick={() => setFilterMode('all')}
              className={`filter-button ${filterMode === 'all' ? 'active-filter' : ''}`}
            >
              すべて
            </button>
            <button 
              style={{
                ...styles.filterButton, 
                ...(filterMode === 'completed' ? styles.activeFilter : {})
              }}
              onClick={() => setFilterMode('completed')}
              className={`filter-button ${filterMode === 'completed' ? 'active-filter' : ''}`}
            >
              復習完了
            </button>
          </div>
        </div>
        
        {filteredQuizzes.length === 0 ? (
          <div style={styles.noQuizzes}>
            <p>
              {filterMode === 'due_today' 
                ? '今日復習する問題はありません。' 
                : filterMode === 'completed'
                  ? '復習が完了した問題はありません。'
                  : '復習問題がまだありません。学習セッション終了時に作成できます。'}
            </p>
          </div>
        ) : (
          <div style={styles.quizList}>
            {filteredQuizzes.map(quiz => (
              <div 
                key={quiz.id} 
                style={getQuizCardStyle(quiz)}
                onClick={() => handleQuizSelect(quiz)}
                className="quiz-card"
              >
                <div style={styles.quizCardHeader}>
                  <h3 style={styles.quizTopicTitle}>{quiz.studyTopic}</h3>
                  <button
                    style={styles.deleteButton}
                    onClick={(e) => handleDeleteQuiz(e, quiz.id)}
                    title="この復習問題を削除"
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
                    ...(quiz.nextReviewDate && quiz.nextReviewDate < new Date() 
                      ? styles.overdueReview : {})
                  }}>
                    {quiz.reviewStatus === 'completed' 
                      ? '全ステップ完了' 
                      : formatDate(quiz.nextReviewDate)}
                  </span>
                  
                  <div style={styles.progressContainer}>
                    {quiz.reviewSchedule?.map((schedule, index) => (
                      <div 
                        key={index}
                        style={{
                          ...styles.progressDot,
                          ...(schedule.completed ? styles.completedDot : {}),
                          ...(index === quiz.currentReviewIndex ? styles.currentDot : {})
                        }}
                        title={`復習${index + 1}: ${schedule.completed ? '完了' : '未完了'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0.3rem',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    margin: '3rem 0',
    fontSize: '1.2rem',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    margin: '3rem 0',
    fontSize: '1.2rem',
    color: '#e74c3c',
  },
  searchContainer: {
    marginBottom: '2rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  noQuizzes: {
    textAlign: 'center',
    margin: '3rem 0',
    fontSize: '1.2rem',
    color: '#666',
  },
  quizList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  quizCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    position: 'relative', // 削除ボタンを配置するために追加
  },
  quizCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
  },
  quizTopicTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    margin: 0,
    flex: 1,
  },
  quizInfo: {
    fontSize: '0.9rem',
    color: '#666',
  },
  quizDetailHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#7f8c8d',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  quizTitle: {
    fontSize: '1.6rem',
    margin: '0',
    color: '#2c3e50',
    flex: '1',
    textAlign: 'center',
  },
  quizMeta: {
    display: 'flex',
    alignItems: 'center',
  },
  quizDate: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    margin: 0,
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  questionNumber: {
    fontSize: '1.2rem',
    marginBottom: '0.75rem',
    color: '#3498db',
  },
  questionText: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    lineHeight: '1.6',
    '& .katex': {
      fontSize: '1.1em',
    },
    '& .katex-display > .katex': {
      fontSize: '1.21em',
    },
  },
  toggleAnswerButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  activeToggleButton: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: 'none',
    boxShadow: 'inset 3px 0 0 #3498db',
  },
  answerContainer: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f5f9fc',
    borderRadius: '4px',
    borderLeft: '4px solid #3498db',
  },
  answerText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    '& .katex': {
      fontSize: '1.1em',
    },
    '& .katex-display > .katex': {
      fontSize: '1.21em',
    },
  },
  mathContainer: {
    overflowX: 'auto',
    padding: '5px 0',
  },
  controlsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '2rem',
  },
  filterContainer: {
    display: 'flex',
    gap: '10px',
  },
  filterButton: {
    padding: '8px 12px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  activeFilter: {
    backgroundColor: '#2196F3',
    color: 'white',
    borderColor: '#1976d2',
  },
  reviewStatus: {
    fontSize: '0.9rem',
    color: '#555',
    marginTop: '4px',
  },
  reviewLabel: {
    fontWeight: '600',
    marginRight: '6px',
  },
  reviewInfo: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '10px',
    fontSize: '0.9rem',
  },
  nextReviewLabel: {
    color: '#666',
    marginRight: '6px',
  },
  nextReviewDate: {
    fontWeight: '600',
    color: '#2196F3',
  },
  overdueReview: {
    color: '#f44336',
  },
  progressContainer: {
    display: 'flex',
    gap: '5px',
    marginLeft: 'auto',
  },
  progressDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
  },
  completedDot: {
    backgroundColor: '#4CAF50',
  },
  currentDot: {
    border: '2px solid #2196F3',
    width: '12px',
    height: '12px',
    margin: '-1px',
  },
  reviewActions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '25px',
    marginBottom: '20px',
  },
  completeReviewButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  disabledReviewButton: {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
    cursor: 'not-allowed',
  },
  nextReviewNote: {
    textAlign: 'center',
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '10px',
  },
  deleteButton: {
    backgroundColor: '#ffffff',
    color: '#666',
    border: '1px solid #e0e0e0',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '0',
    marginLeft: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f44336',
      color: 'white',
      borderColor: '#f44336',
    }
  },
  deleteIcon: {
    fontSize: '16px',
    lineHeight: 1,
  },
  // モーダルダイアログのスタイルを学習放棄のダイアログと統一
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(3px)",
  },
  dialog: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "30px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  },
  dialogTitle: {
    margin: "0 0 20px 0",
    fontSize: "22px",
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  dialogText: {
    fontSize: "15px",
    color: "#555",
    textAlign: "center",
    marginBottom: "30px",
    fontWeight: "500",
  },
  dialogButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  cancelButton: {
    padding: "12px 24px",
    backgroundColor: "#F5F5F5",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flex: "1",
  },
  confirmButton: {
    padding: "12px 24px",
    backgroundColor: "#f44336", // 赤色を使用
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 10px rgba(244, 67, 54, 0.3)",
    flex: "1",
  },
};

// KaTeX用のカスタムスタイルを追加
const addGlobalStyle = () => {
  // すでに追加されているかチェック
  if (!document.getElementById('review-katex-styles')) {
    const globalStyle = document.createElement('style');
    globalStyle.id = 'review-katex-styles';
    globalStyle.innerHTML = `
      .katex-display {
        margin: 1em 0;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 5px 0;
      }
      
      .katex {
        font-size: 1.1em;
      }
      
      .katex-display > .katex': {
        font-size: 1.21em;
      }
    `;
    document.head.appendChild(globalStyle);
  }
  
  // 削除ボタンのホバースタイルを追加
  if (!document.getElementById('delete-button-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'delete-button-styles';
    styleElement.innerHTML = `
      button[title="この復習問題を削除"]:hover {
        background-color: #f44336 !important;
        color: white !important;
        border-color: #f44336 !important;
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // フィルターボタンのホバースタイルを追加
  if (!document.getElementById('filter-button-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'filter-button-styles';
    styleElement.innerHTML = `
      .filter-button:not(.active-filter):hover {
        background-color: #e6e6e6 !important;
        transform: translateY(-2px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border-color: #d0d0d0 !important;
      }
      
      .filter-button.active-filter:hover {
        background-color: #1976d2 !important;
        transform: translateY(-2px);
        box-shadow: 0 2px 5px rgba(33, 150, 243, 0.3);
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // 詳細ページのボタンホバースタイルを追加
  if (!document.getElementById('detail-buttons-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'detail-buttons-styles';
    styleElement.innerHTML = `
      /* 一覧に戻るボタン */
      .back-button:hover {
        background-color: #6b7c7d !important;
        transform: translateY(-2px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
      
      /* 解答表示ボタン */
      .toggle-answer-button:not([style*="background-color: rgb(245, 245, 245)"]):hover {
        background-color: #2980b9 !important;
        transform: translateY(-2px);
        box-shadow: 0 2px 5px rgba(52, 152, 219, 0.3);
      }
      
      /* アクティブな解答表示ボタン */
      .toggle-answer-button[style*="background-color: rgb(245, 245, 245)"]:hover {
        background-color: #e8e8e8 !important;
        color: #2980b9 !important;
        transform: translateY(-2px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1), inset 3px 0 0 #2980b9 !important;
      }
      
      /* 復習完了ボタン */
      .complete-review-button:hover {
        background-color: #3d8b40 !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // 復習問題カードのホバースタイルを追加
  if (!document.getElementById('quiz-card-hover-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'quiz-card-hover-styles';
    styleElement.innerHTML = `
      .quiz-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
    `;
    document.head.appendChild(styleElement);
  }
};

// コンポーネントがマウントされたときにスタイルを追加
addGlobalStyle();

export default ReviewQuizzesPage; 