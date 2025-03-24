import React, { useState } from "react";
// Firestoreの直接インポートを削除
// import { db } from "../firebase";
// import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import Layout from "../components/Layout";
import { generateSampleData } from "../utils/sampleDataGenerator";

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dataCount, setDataCount] = useState(30);
  const [inputValue, setInputValue] = useState("30");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value !== "" && !isNaN(parseInt(value))) {
      setDataCount(parseInt(value));
    }
  };

  const addSampleData = async () => {
    const count = inputValue === "" ? 30 : dataCount;
    setDataCount(count);
    setInputValue(count.toString());
    
    setIsLoading(true);
    setMessage("サンプルデータを生成中...");
    
    try {
      const sampleData = generateSampleData(count);
      setMessage(`サンプルデータの生成が完了しました。管理者機能は現在バックエンドAPIに移行中です。`);
      
      // Firestoreへの直接アクセスは削除
      // let addedCount = 0;
      // 
      // for (const data of sampleData) {
      //   await addDoc(collection(db, "studySessions"), {
      //     ...data,
      //     timestamp: serverTimestamp(),
      //   });
      //   addedCount++;
      //   
      //   if (addedCount % 5 === 0 || addedCount === sampleData.length) {
      //     setMessage(`${addedCount}/${sampleData.length} 件のデータを追加中...`);
      //   }
      // }
      // 
      // setMessage(`${addedCount}件のサンプルデータを追加しました！`);
    } catch (error) {
      console.error("サンプルデータの追加中にエラーが発生しました:", error);
      setMessage(`エラーが発生しました: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // サンプルの復習問題を作成する関数
  const createSampleReviewQuizzes = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      setMessage(`サンプル復習問題の生成機能は現在バックエンドAPIに移行中です。`);
      
      // Firestoreへの直接アクセスは削除
      // const now = new Date();
      // const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // 
      // // 昨日、今日、明日の日付を取得
      // const yesterday = new Date(today);
      // yesterday.setDate(yesterday.getDate() - 1);
      // 
      // const tomorrow = new Date(today);
      // tomorrow.setDate(tomorrow.getDate() + 1);
      // 
      // // 一週間前の日付を取得（完了済み問題用）
      // const oneWeekAgo = new Date(today);
      // oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      // 
      // // サンプルの復習問題データ
      // const sampleQuizzes = [...];
      // 
      // // Firestoreにサンプルデータを追加
      // const results = await Promise.all(
      //   sampleQuizzes.map(quiz => addDoc(collection(db, 'reviewQuizzes'), quiz))
      // );
      // 
      // setMessage(`${results.length}件のサンプル復習問題を追加しました！`);
    } catch (error) {
      console.error("サンプル復習問題の追加中にエラーが発生しました:", error);
      setMessage(`エラーが発生しました: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>管理者ページ</h1>
        
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>サンプルデータの生成</h2>
          <p style={styles.cardDescription}>
            履歴や分析機能をテストするためのサンプルデータを生成します。
            実際のデータと混在しますので、テスト後は履歴ページから削除することをお勧めします。
          </p>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              生成するデータ数:
              <input
                type="number"
                min="1"
                max="100"
                value={inputValue}
                onChange={handleInputChange}
                style={styles.input}
                disabled={isLoading}
              />
            </label>
          </div>
          
          <button
            onClick={addSampleData}
            disabled={isLoading}
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "処理中..." : "サンプルデータを追加"}
          </button>
          
          {message && (
            <div style={{
              ...styles.message,
              backgroundColor: message.includes("エラー") ? "#ffebee" : "#e8f5e9"
            }}>
              {message}
            </div>
          )}
        </div>
        
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>サンプル復習問題を追加</h2>
          <p style={styles.cardDescription}>
            昨日、今日、明日の復習問題と、すべての復習ステップが完了した問題をデータベースに追加します。
            これはテスト・デモ用のサンプルデータです。
          </p>
          <button
            style={styles.button}
            onClick={createSampleReviewQuizzes}
            disabled={isLoading}
          >
            {isLoading ? 'データ追加中...' : 'サンプル復習問題を追加'}
          </button>
          
          {message && (
            <div style={
              message.startsWith('エラー') 
                ? styles.errorMessage 
                : styles.successMessage
            }>
              {message}
            </div>
          )}
        </div>
        
        <div style={styles.warningCard}>
          <h3 style={styles.warningTitle}>⚠️ 注意事項</h3>
          <p style={styles.warningText}>
            このページは開発・テスト目的のみに使用してください。
            生成されたサンプルデータは実際の学習記録と区別がつかないため、
            テスト完了後は不要なデータを削除することをお勧めします。
          </p>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    color: "#333",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  cardTitle: {
    color: "#333",
    fontSize: "20px",
    marginTop: 0,
    marginBottom: "15px",
  },
  cardDescription: {
    color: "#666",
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    color: "#333",
    fontSize: "16px",
    marginBottom: "8px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginTop: "5px",
  },
  button: {
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  message: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "4px",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  warningCard: {
    backgroundColor: "#fff8e1",
    borderRadius: "12px",
    padding: "20px",
    borderLeft: "4px solid #ffc107",
  },
  warningTitle: {
    color: "#f57c00",
    fontSize: "18px",
    marginTop: 0,
    marginBottom: "10px",
  },
  warningText: {
    color: "#666",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: 0,
  },
  successMessage: {
    marginTop: '1rem',
    padding: '0.8rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  errorMessage: {
    marginTop: '1rem',
    padding: '0.8rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
};

export default AdminPage; 