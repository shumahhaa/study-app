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
  startStudy,
}) => {
  const navigate = useNavigate();
  // ホバー状態を管理するstate
  const [isHovered, setIsHovered] = useState(false);
  
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
                className="start-button"
                style={{
                  ...styles.startButton,
                  ...(studyTopic.trim() === "" ? styles.startButtonDisabled : {}),
                  ...(isHovered && studyTopic.trim() !== "" ? styles.startButtonHover : {})
                }}
                onMouseEnter={() => {
                  if(studyTopic.trim() !== "") {
                    setIsHovered(true);
                  }
                }}
                onMouseLeave={() => {
                  if(studyTopic.trim() !== "") {
                    setIsHovered(false);
                  }
                }}
              >
                学習開始
              </button>
            </div>
          </div>
          
          <div className="features-section" style={styles.featuresSection}>
            <Link to="/review-quizzes" className="feature-card-link">
              <div className="feature-card" style={styles.featureCard}>
                <div className="feature-icon" style={styles.featureIcon}>📝</div>
                <h3 className="feature-title" style={styles.featureTitle}>復習問題</h3>
                <p className="feature-description" style={styles.featureDescription}>
                  生成された問題で理解を深める
                </p>
              </div>
            </Link>
            
            <Link to="/analytics" className="feature-card-link">
              <div className="feature-card" style={styles.featureCard}>
                <div className="feature-icon" style={styles.featureIcon}>📊</div>
                <h3 className="feature-title" style={styles.featureTitle}>学習分析</h3>
                <p className="feature-description" style={styles.featureDescription}>
                  学習パターンを分析
                </p>
              </div>
            </Link>
            
            <Link to="/calendar" className="feature-card-link">
              <div className="feature-card" style={styles.featureCard}>
                <div className="feature-icon" style={styles.featureIcon}>📅</div>
                <h3 className="feature-title" style={styles.featureTitle}>カレンダー</h3>
                <p className="feature-description" style={styles.featureDescription}>
                  日別の学習状況を確認
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  startStudySection: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    alignItems: "center",
  },
  startStudyCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(32, 145, 249, 0.15), 0 8px 20px rgba(76, 175, 80, 0.08)",
    padding: "20px 30px",
    maxWidth: "800px",
    width: "100%",
    transition: "box-shadow 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    position: "relative",
    overflow: "hidden",
    background: "#fff",
  },
  startButtonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "25px",
    marginBottom: "10px",
  },
  startButton: {
    background: "linear-gradient(135deg, #2196F3 0%, #4CAF50 100%)",
    boxShadow: "0 6px 15px rgba(33, 150, 243, 0.2)",
    position: "relative",
    overflow: "hidden",
    border: "none",
    color: "white",
    fontWeight: "600",
    letterSpacing: "1px",
    padding: "0 20px",
    fontSize: "18px",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    width: "220px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "solid 1px rgba(255, 255, 255, 0.2)",
    outlineOffset: "-4px",
  },
  startButtonHover: {
    background: "linear-gradient(135deg, #1976D2 0%, #388E3C 100%)",
    boxShadow: "0 8px 20px rgba(33, 150, 243, 0.25)",
  },
  startButtonDisabled: {
    background: "#90a4ae",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: "0.7",
    outline: "none",
  },
  featuresSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    marginTop: "20px",
    width: "100%",
  },
  featureCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.06), 0 5px 15px rgba(0, 0, 0, 0.02)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "230px",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    transition: "box-shadow 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    border: "1px solid rgba(255, 255, 255, 0.7)",
  },
  featureIcon: {
    fontSize: "48px",
    marginBottom: "20px",
    position: "relative",
    zIndex: "1",
    transition: "filter 0.3s ease",
    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
  },
  featureTitle: {
    color: "#1565C0",
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "12px",
    transition: "color 0.3s ease",
    position: "relative",
    zIndex: "1",
    letterSpacing: "0.5px",
  },
  featureDescription: {
    color: "#546E7A",
    fontSize: "15px",
    lineHeight: "1.5",
    textAlign: "center",
    maxWidth: "220px",
    position: "relative",
    zIndex: "1",
  }
};

export default HomePage;