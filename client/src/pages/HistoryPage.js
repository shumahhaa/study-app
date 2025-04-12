import React, { useState, useEffect } from "react";
import StudyHistory from "../components/StudyHistory";
import Layout from "../components/Layout";
import { fetchStudySessions, deleteStudySession } from "../utils/api"; // APIをインポート
import { DelayedLoader } from "../components/Common"; // 遅延ローディングコンポーネントをインポート

const HistoryPage = ({ formatTime }) => {
  const [studyHistory, setStudyHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // APIを使用して学習履歴を取得
  useEffect(() => {
    const fetchStudyHistory = async () => {
      try {
        setLoading(true);
        const response = await fetchStudySessions();
        setStudyHistory(response || []);
        setError(null);
      } catch (err) {
        console.error("学習履歴の取得エラー:", err);
        setError("学習履歴を読み込めませんでした。ネットワーク接続を確認してください。");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudyHistory();
  }, []);
  
  // 学習履歴を削除する関数
  const handleDeleteStudySession = async (id) => {
    if (window.confirm("この学習履歴を削除しますか？")) {
      try {
        await deleteStudySession(id);
        
        // 成功した場合は、UIから削除
        setStudyHistory(prevHistory => 
          prevHistory.filter(session => session.id !== id)
        );
      } catch (err) {
        console.error("学習履歴の削除エラー:", err);
        alert("削除に失敗しました。もう一度お試しください。");
      }
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <DelayedLoader loading={loading}>
          <div style={styles.loadingContainer}>
            <p>学習履歴を読み込み中...</p>
          </div>
        </DelayedLoader>
        
        {!loading && error ? (
          <div style={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : !loading && (
          <StudyHistory
            studyHistory={studyHistory}
            deleteStudySession={handleDeleteStudySession}
            formatTime={formatTime}
          />
        )}
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  title: {
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "40px",
    fontSize: "16px",
    color: "#666",
  },
  errorContainer: {
    textAlign: "center",
    padding: "40px",
    fontSize: "16px",
    color: "#f44336",
    backgroundColor: "#ffebee",
    borderRadius: "8px",
  }
};

export default HistoryPage; 