import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CalendarView from '../components/CalendarView';
import { fetchStudySessions } from '../utils/api';
import { DelayedLoader } from '../components/Common';

const CalendarPage = ({ formatTime }) => {
  const [studyHistory, setStudyHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate] = useState(new Date()); // 今日の日付を確実に設定

  // APIから学習履歴を取得
  useEffect(() => {
    let isMounted = true; // マウント状態を追跡
    const controller = new AbortController(); // フェッチをキャンセルするためのコントローラー
    
    const fetchStudyHistory = async () => {
      try {
        setLoading(true);
        
        // AbortControllerのシグナルを使用
        const response = await fetchStudySessions();
        
        // コンポーネントがアンマウントされていない場合のみ状態を更新
        if (isMounted) {
          setStudyHistory(response || []);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        // リクエストのキャンセルエラーは無視
        if (err.name === 'AbortError') {
          console.log('フェッチリクエストがキャンセルされました');
          return;
        }
        
        console.error("学習履歴の取得エラー:", err);
        
        if (isMounted) {
          setError("データを読み込めませんでした。ネットワーク接続を確認してください。");
          setLoading(false);
        }
      }
    };
    
    fetchStudyHistory();
    
    // クリーンアップ関数: コンポーネントのアンマウント時に呼び出される
    return () => {
      isMounted = false; // マウント状態をfalseに設定
      controller.abort(); // 進行中のフェッチリクエストをキャンセル
    };
  }, []);

  return (
    <Layout>
      <div style={styles.container}>
        
        <DelayedLoader loading={loading}>
          <div style={styles.loadingContainer}>
            <div style={styles.loading}>データを読み込み中...</div>
          </div>
        </DelayedLoader>
        
        {!loading && error ? (
          <div style={styles.errorContainer}>
            <div style={styles.error}>{error}</div>
          </div>
        ) : !loading && (
          <CalendarView 
            studyHistory={studyHistory} 
            formatTime={formatTime} 
            initialDate={currentDate} // 初期値として今日の日付を渡す
          />
        )}
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0px',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  // ローディングとエラー表示用のスタイル
  loadingContainer: {
    padding: "40px 0",
    textAlign: "center"
  },
  loading: {
    fontSize: "16px",
    color: "#666"
  },
  errorContainer: {
    padding: "40px 0",
    textAlign: "center"
  },
  error: {
    fontSize: "16px",
    color: "#f44336",
    backgroundColor: "#ffebee",
    padding: "15px 20px",
    borderRadius: "8px",
    display: "inline-block"
  }
};

export default CalendarPage; 