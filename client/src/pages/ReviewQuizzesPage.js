import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import { fetchReviewQuizzes, updateReviewQuiz, deleteReviewQuiz } from '../utils/api';

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
    } catch (error) {
      console.error('復習更新エラー:', error);
      setError('復習記録の更新に失敗しました。再度お試しください。');
    }
  };

  // 日付型に変換するヘルパー関数を追加
  const toDateObject = (dateValue) => {
    if (!dateValue) return null;
    
    // すでにDateオブジェクトの場合はそのまま返す
    if (dateValue instanceof Date) return dateValue;
    
    // Firestoreのtimestampオブジェクトの場合
    if (typeof dateValue === 'object' && dateValue.toDate) {
      return dateValue.toDate();
    }
    
    // バックエンドから返された通常のJSONオブジェクトの場合
    if (dateValue && typeof dateValue === 'object' && dateValue._seconds !== undefined) {
      return new Date(dateValue._seconds * 1000);
    }
    
    // ISO文字列または数値の場合
    try {
      return new Date(dateValue);
    } catch (e) {
      console.error("日付変換エラー:", e, dateValue);
      return null; // エラーの場合はnullを返す
    }
  };

  // 日付を安全にフォーマットする関数
  const formatDateSafe = (dateValue, formatType = "short") => {
    try {
      const date = toDateObject(dateValue);
      if (!date) return "不明な日付";
      
      if (formatType === "full") {
        return date.toLocaleDateString('ja-JP', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        return date.toLocaleDateString('ja-JP', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (e) {
      console.error("日付フォーマットエラー:", e, dateValue);
      return "不明な日付";
    }
  };

  // 日付をフォーマットする関数
  const formatDate = (dateValue) => {
    if (!dateValue) return '不明';
    
    try {
      const date = toDateObject(dateValue);
      if (!date) return '不明';
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dateDay = new Date(date);
      dateDay.setHours(0, 0, 0, 0);
      
      if (dateDay < today) {
        return '期限切れ';
      } else if (isSameDay(dateDay, today)) {
        return '今日';
      } else if (isSameDay(dateDay, tomorrow)) {
        return '明日';
      } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
    } catch (e) {
      console.error("日付フォーマットエラー:", e, dateValue);
      return "不明";
    }
  };

  // 同じ日かどうかを判定する関数
  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    
    // すでにDate型であることを確認
    date1 = date1 instanceof Date ? date1 : toDateObject(date1);
    date2 = date2 instanceof Date ? date2 : toDateObject(date2);
    
    if (!date1 || !date2) return false;
    
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
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
        if (!quiz.nextReviewDate || quiz.reviewStatus === 'completed') {
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
      filtered = filtered.filter(quiz => quiz.reviewStatus === 'completed');
    }
    
    return filtered;
  };

  // カードのスタイルを取得する関数
  const getQuizCardStyle = (quiz) => {
    if (!quiz) return styles.quizCard;
    
    const baseStyle = { ...styles.quizCard };
    
    // 完了済みの場合は緑色の線
    if (quiz.reviewStatus === 'completed') {
      return { 
        ...baseStyle, 
        borderLeft: '5px solid #4CAF50',
        paddingLeft: '1.2rem'
      };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextReviewDate = toDateObject(quiz.nextReviewDate);
    
    // 次の復習日が過去の場合（期限切れ）は赤色の線
    if (nextReviewDate && nextReviewDate < today) {
      return { 
        ...baseStyle, 
        borderLeft: '5px solid #f44336',
        paddingLeft: '1.2rem'
      };
    }
    
    // 今日が復習日の場合は青色の線
    if (nextReviewDate && isSameDay(nextReviewDate, today)) {
      return { 
        ...baseStyle, 
        borderLeft: '5px solid #2196F3',
        paddingLeft: '1.2rem' 
      };
    }
    
    // それ以外（未来の復習予定）は灰色の線
    return { 
      ...baseStyle, 
      borderLeft: '5px solid #9e9e9e',
      paddingLeft: '1.2rem'
    };
  };

  // 今日が復習日かどうかを判定する関数
  const isDueToday = (quiz) => {
    if (!quiz || !quiz.nextReviewDate || quiz.reviewStatus === 'completed') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextReviewDate = toDateObject(quiz.nextReviewDate);
    if (!nextReviewDate) return false;
    
    // 次の復習日が今日以前の場合は復習日とする
    const nextReviewDay = new Date(nextReviewDate);
    nextReviewDay.setHours(0, 0, 0, 0);
    return nextReviewDay <= today;
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

  // Markdownコンテンツをレンダリングするコンポーネント
  const MarkdownContent = ({ content }) => {
    if (!content) return null;
    
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // コードブロックのカスタムレンダリング
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span>{match[1]}</span>
                </div>
                <pre className={`language-${match[1]}`}>
                  <code className={`language-${match[1]}`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  // グローバルスタイルを追加
  const addGlobalStyle = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* ホバー効果のアニメーション */
      @keyframes buttonPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .quiz-card {
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                    box-shadow 0.3s ease !important;
        will-change: transform, box-shadow !important;
      }
      
      .quiz-card:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
      }
      
      .quiz-card:active {
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1) !important;
        transition: transform 0.1s, box-shadow 0.1s !important;
      }
      
      .back-button {
        transition: all 0.3s ease !important;
      }
      
      .back-button:hover {
        background-color: #666 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2) !important;
      }
      
      .toggle-answer-button {
        transition: all 0.3s ease !important;
      }
      
      .toggle-answer-button:hover {
        background-color: #2980b9 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2) !important;
      }
      
      .complete-review-button {
        transition: all 0.3s ease !important;
      }
      
      .complete-review-button:hover {
        background-color: #388e3c !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 10px rgba(76, 175, 80, 0.3) !important;
        animation: buttonPulse 1s infinite !important;
      }
      
      .filter-button {
        transition: all 0.2s ease !important;
      }
      
      .filter-button:hover {
        background-color: #e0e0e0 !important;
        transform: translateY(-1px) !important;
      }
      
      .filter-button.active-filter:hover {
        background-color: #1976d2 !important;
      }
      
      .delete-button {
        transition: all 0.2s ease !important;
      }
      
      .delete-button:hover {
        background-color: #f44336 !important;
        color: white !important;
        border-color: #f44336 !important;
      }
      
      .katex-display {
        margin: 1em 0;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 5px 0;
      }
      
      .katex {
        font-size: 1.1em;
      }
      
      .katex-display > .katex {
        font-size: 1.21em;
      }
      
      /* コードブロックのスタイル */
      .code-block-wrapper {
        margin: 16px 0;
        border-radius: 6px;
        overflow: hidden;
        background-color: #f6f8fa;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      
      .code-block-header {
        background-color: #e1e4e8;
        padding: 6px 16px;
        font-size: 12px;
        font-family: monospace;
        color: #24292e;
        font-weight: 500;
        border-bottom: 1px solid #d1d5da;
      }
      
      pre {
        margin: 0;
        padding: 16px;
        overflow-x: auto;
        font-size: 14px;
        line-height: 1.45;
      }
      
      code {
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        font-size: 0.9em;
        padding: 0.2em 0.4em;
        margin: 0;
        background-color: rgba(27, 31, 35, 0.05);
        border-radius: 3px;
      }
      
      pre code {
        background-color: transparent;
        padding: 0;
        margin: 0;
        font-size: 100%;
        word-break: normal;
        white-space: pre;
        overflow: visible;
      }
      
      /* マークダウンの表スタイル */
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 16px 0;
        display: block;
        overflow-x: auto;
      }
      
      th, td {
        border: 1px solid #dfe2e5;
        padding: 6px 13px;
      }
      
      th {
        background-color: #f6f8fa;
        font-weight: 600;
      }
      
      tr:nth-child(2n) {
        background-color: #f6f8fa;
      }
      
      /* Markdownのリスト調整 */
      ul, ol {
        padding-left: 20px;
      }
      
      blockquote {
        margin-left: 0;
        padding-left: 16px;
        border-left: 4px solid #dfe2e5;
        color: #6a737d;
      }
      
      a {
        color: #0366d6;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
      
      /* その他のスタイル */
      .completed-mark {
        color: #4CAF50;
        margin-left: 8px;
      }
      
      .review-status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        margin-left: 10px;
      }
      
      .status-due, .status-overdue {
        background-color: #ffebee;
        color: #d32f2f;
      }
      
      .status-today {
        background-color: #e3f2fd;
        color: #1976d2;
      }
      
      .status-scheduled {
        background-color: #e0f2f1;
        color: #00897b;
      }
      
      .status-completed {
        background-color: #e8f5e9;
        color: #388e3c;
      }
      
      .confirm-delete-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      
      .confirm-delete-dialog {
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  };

  // コンポーネントがマウントされたときにスタイルを追加
  useEffect(() => {
    addGlobalStyle();
  }, []);

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
                作成日: {formatDateSafe(selectedQuiz.createdAt)}
              </p>
            </div>
          </div>
          
          <div style={styles.questionsList}>
            {selectedQuiz.questions.map((question, index) => (
              <div key={index} style={styles.questionCard}>
                <h3 style={styles.questionNumber}>問題 {index + 1}</h3>
                <div style={styles.questionText}>
                  <MarkdownContent content={question.question} />
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
                      <MarkdownContent content={question.answer} />
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
                  onClick={() => setConfirmDelete(null)}
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
                ? '今日復習する問題はありません。まだ復習の時期に達していない問題があるか確認するには「すべて」を選択してください。' 
                : filterMode === 'completed'
                  ? '復習が完了した問題はありません。復習サイクルを完了するとここに表示されます。'
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
                    style={{
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
                      transition: 'all 0.2s ease'
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // イベント伝播を防止
                      promptDeleteQuiz(quiz.id);
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
                    ...(quiz.reviewStatus === 'completed' 
                      ? styles.completedReview 
                      : isDueToday(quiz) 
                        ? styles.todayReview 
                        : (quiz.nextReviewDate && toDateObject(quiz.nextReviewDate) < new Date()) 
                          ? styles.overdueReview 
                          : styles.futureReview)
                  }}>
                    {quiz.reviewStatus === 'completed' 
                      ? '全ステップ完了' 
                      : formatDate(quiz.nextReviewDate)}
                  </span>
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
    willChange: 'transform', // パフォーマンス向上のため
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
    fontWeight: '500',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
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
  completedReview: {
    color: '#4CAF50',
  },
  todayReview: {
    color: '#2196F3',
  },
  overdueReview: {
    color: '#f44336',
  },
  futureReview: {
    color: '#9e9e9e',
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
  }
};

export default ReviewQuizzesPage;