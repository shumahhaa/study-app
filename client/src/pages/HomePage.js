import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import StudyInput from "../components/StudyInput";
import Layout from "../components/Layout";

const HomePage = ({
  studyTopic,
  setStudyTopic,
  motivation,
  setMotivation,
  isStudying,
  isPaused,
  pauseStudy,
  resumeStudy,
  startStudy,
  stopStudy,
  abandonStudy,
  studyDuration,
  recordedStudyTopic,
  recordedMotivation,
  formatTime,
  getStatus
}) => {
  const navigate = useNavigate();
  
  // 学習開始時に学習中ページに遷移
  const handleStartStudy = () => {
    startStudy();
    navigate("/active");
  };

  // 学習中の場合は自動的に学習中ページにリダイレクト
  React.useEffect(() => {
    if (isStudying) {
      navigate("/active");
    }
  }, [isStudying, navigate]);

  return (
    <Layout isStudying={isStudying}>
      <div style={styles.container}>
        {/* 学習開始セクション */}
        <div style={styles.startStudySection}>
          <div style={styles.startStudyCard}>
            <StudyInput
              studyTopic={studyTopic}
              setStudyTopic={setStudyTopic}
              motivation={motivation}
              setMotivation={setMotivation}
            />
            
            <div style={styles.startButtonContainer}>
              <button
                onClick={handleStartStudy}
                disabled={studyTopic.trim() === ""}
                className={`start-button ${studyTopic.trim() === "" ? "disabled" : ""}`}
              >
                学習開始
              </button>
            </div>
          </div>
          
          <div style={styles.featuresSection}>
            <Link to="/review-quizzes" className="feature-card-link">
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3 className="feature-title">復習問題</h3>
                <p className="feature-description">
                  生成された問題で理解を深める
                </p>
              </div>
            </Link>
            
            <Link to="/analytics" className="feature-card-link">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">学習分析</h3>
                <p className="feature-description">
                  学習パターンを分析
                </p>
              </div>
            </Link>
            
            <Link to="/calendar" className="feature-card-link">
              <div className="feature-card">
                <div className="feature-icon">📅</div>
                <h3 className="feature-title">カレンダー</h3>
                <p className="feature-description">
                  日別の学習状況を確認
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* 開発中のみ表示する管理ページへのリンク */}
        <div style={styles.devSection}>
          <Link to="/admin" style={styles.devLink}>
            管理ページ
          </Link>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: "970px",
    margin: "0 auto",
    padding: "20px",
  },
  startStudySection: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    alignItems: "center",
  },
  startStudyCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    padding: "22px",
    border: "1px solid #e0e0e0",
    maxWidth: "800px",
    width: "100%",
  },
  startButtonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "30px",
    marginBottom: "10px",
  },
  featuresSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "10px",
    width: "100%",
  },
  devSection: {
    marginTop: "40px",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    textAlign: "center",
    borderLeft: "4px solid #ff9800",
  },
  devLink: {
    color: "#ff9800",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "14px",
  },
};

export default HomePage;