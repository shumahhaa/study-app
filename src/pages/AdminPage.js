import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
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
      let addedCount = 0;
      
      for (const data of sampleData) {
        await addDoc(collection(db, "studySessions"), {
          ...data,
          timestamp: serverTimestamp(),
        });
        addedCount++;
        
        if (addedCount % 5 === 0 || addedCount === sampleData.length) {
          setMessage(`${addedCount}/${sampleData.length} 件のデータを追加中...`);
        }
      }
      
      setMessage(`${addedCount}件のサンプルデータを追加しました！`);
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

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // 昨日、今日、明日の日付を取得
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // 一週間前の日付を取得（完了済み問題用）
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // サンプルの復習問題データ
      const sampleQuizzes = [
        {
          studyTopic: '昨日の復習問題：微分と積分の基礎',
          createdAt: Timestamp.fromDate(yesterday),
          nextReviewDate: Timestamp.fromDate(yesterday),
          currentReviewIndex: 0,
          reviewStatus: 'scheduled',
          questions: [
            {
              question: '微分の定義を説明し、$f(x) = x^2$ の導関数を求めよ。',
              answer: '微分とは関数の瞬間的な変化率を求める操作です。\n\n$f(x) = x^2$ の導関数は\n$f\'(x) = 2x$ です。'
            },
            {
              question: '積分と微分の関係を説明せよ。',
              answer: '積分は微分の逆操作です。関数 $f(x)$ の不定積分 $F(x)$ は $F\'(x) = f(x)$ を満たす関数です。'
            }
          ],
          reviewSchedule: [
            {
              dueDate: Timestamp.fromDate(yesterday),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)),
              completed: false
            }
          ]
        },
        {
          studyTopic: '今日の復習問題：線形代数の基本概念',
          createdAt: Timestamp.fromDate(today),
          nextReviewDate: Timestamp.fromDate(today),
          currentReviewIndex: 0,
          reviewStatus: 'scheduled',
          questions: [
            {
              question: '行列の定義と、2×2行列の例を挙げよ。',
              answer: '行列は数や記号を長方形の配列に並べたものです。\n\n2×2行列の例：\n$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$'
            },
            {
              question: '線形独立性とは何か説明せよ。',
              answer: 'ベクトルの集合 {v₁, v₂, ..., vₙ} が線形独立であるとは、\n$c₁v₁ + c₂v₂ + ... + cₙvₙ = 0$ となるような $c₁, c₂, ..., cₙ$（すべて0ではない）が存在しないことを意味します。'
            },
            {
              question: '行列式の幾何学的な意味を説明せよ。',
              answer: '2次元の場合、2×2行列の行列式は、行列の列ベクトルが張る平行四辺形の面積を表します。\n\n3次元の場合、3×3行列の行列式は、列ベクトルが張る平行六面体の体積を表します。'
            }
          ],
          reviewSchedule: [
            {
              dueDate: Timestamp.fromDate(today),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)),
              completed: false
            }
          ]
        },
        {
          studyTopic: '明日の復習問題：確率統計の基礎',
          createdAt: Timestamp.fromDate(tomorrow),
          nextReviewDate: Timestamp.fromDate(tomorrow),
          currentReviewIndex: 0,
          reviewStatus: 'scheduled',
          questions: [
            {
              question: '確率変数と確率分布の違いを説明せよ。',
              answer: '確率変数は、取りうる値とその確率を対応させる関数です。\n\n確率分布は、確率変数が取りうる値とその確率の対応関係を表したものです。'
            },
            {
              question: '正規分布の特徴を3つ挙げよ。',
              answer: '1. 釣り鐘型の対称な分布\n2. 平均値、中央値、最頻値が一致する\n3. 平均 $\\mu$ と標準偏差 $\\sigma$ の2つのパラメータで完全に特徴づけられる'
            },
            {
              question: 'ベイズの定理を述べよ。',
              answer: 'ベイズの定理：\n$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$\n\nここで、$P(A|B)$ は事象 $B$ が与えられたときの事象 $A$ の条件付き確率です。'
            }
          ],
          reviewSchedule: [
            {
              dueDate: Timestamp.fromDate(tomorrow),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000)),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(tomorrow.getTime() + 7 * 24 * 60 * 60 * 1000)),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(tomorrow.getTime() + 14 * 24 * 60 * 60 * 1000)),
              completed: false
            },
            {
              dueDate: Timestamp.fromDate(new Date(tomorrow.getTime() + 30 * 24 * 60 * 60 * 1000)),
              completed: false
            }
          ]
        },
        // 完了済み問題
        {
          studyTopic: '完了済み復習問題：プログラミング基礎',
          createdAt: Timestamp.fromDate(oneWeekAgo),
          nextReviewDate: null, // 次の復習日はない
          currentReviewIndex: 5, // インデックスが復習スケジュールの長さを超えている
          reviewStatus: 'completed', // 完了ステータス
          lastReviewedAt: Timestamp.fromDate(today), // 最後の復習は今日
          questions: [
            {
              question: 'プログラミングにおける変数とは何か説明せよ。',
              answer: '変数とは、データを格納するためのメモリ上の場所に名前を付けたものです。変数には値を代入したり、変数から値を取り出したりすることができます。'
            },
            {
              question: '関数型プログラミングの特徴を述べよ。',
              answer: '関数型プログラミングの特徴：\n1. 関数を第一級オブジェクトとして扱う\n2. 副作用を避け、純粋関数を重視する\n3. 不変性（イミュータビリティ）を重視する\n4. 宣言的なスタイルでコードを記述する'
            },
            {
              question: 'オブジェクト指向プログラミングの3つの基本概念を説明せよ。',
              answer: 'オブジェクト指向プログラミングの3つの基本概念：\n\n1. カプセル化：関連するデータと機能を一つのオブジェクトにまとめ、外部からの不正アクセスを防ぐ\n\n2. 継承：既存のクラスの特性を新しいクラスに引き継ぎ、コードの再利用性を高める\n\n3. ポリモーフィズム：同じインターフェースを持つ異なるオブジェクトが、それぞれ異なる振る舞いをすることを可能にする'
            }
          ],
          reviewSchedule: [
            {
              dueDate: Timestamp.fromDate(new Date(oneWeekAgo.getTime() + 1 * 24 * 60 * 60 * 1000)),
              completed: true // 完了としてマーク
            },
            {
              dueDate: Timestamp.fromDate(new Date(oneWeekAgo.getTime() + 3 * 24 * 60 * 60 * 1000)),
              completed: true
            },
            {
              dueDate: Timestamp.fromDate(new Date(oneWeekAgo.getTime() + 7 * 24 * 60 * 60 * 1000)),
              completed: true
            },
            {
              dueDate: Timestamp.fromDate(new Date(oneWeekAgo.getTime() + 14 * 24 * 60 * 60 * 1000)),
              completed: true
            },
            {
              dueDate: Timestamp.fromDate(new Date(oneWeekAgo.getTime() + 30 * 24 * 60 * 60 * 1000)),
              completed: true
            }
          ]
        }
      ];

      // Firestoreにサンプルデータを追加
      const results = await Promise.all(
        sampleQuizzes.map(quiz => addDoc(collection(db, 'reviewQuizzes'), quiz))
      );

      setMessage(`成功: ${results.length}つのサンプル復習問題を追加しました。 IDs: ${results.map(res => res.id).join(', ')}`);
    } catch (error) {
      console.error('サンプル復習問題の追加中にエラーが発生しました:', error);
      setMessage(`エラー: ${error.message}`);
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