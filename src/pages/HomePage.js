import React from "react";
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
  studyDuration,
  recordedStudyTopic,
  recordedMotivation,
  formatTime,
  getStatus
}) => {
  const navigate = useNavigate();
  const status = getStatus();

  // 学習開始時に学習中ページに遷移
  const handleStartStudy = () => {
    startStudy();
    navigate("/active");
  };

  // 時間帯別に学習時間を分割する関数
  const distributeStudyTimeByHour = (startTime, endTime, duration, pausedTime) => {
    // 開始時間と終了時間をDate型に変換
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // 実際の学習時間（秒）
    const actualStudySeconds = duration;
    
    // 開始時刻から終了時刻までの時間（ミリ秒）
    const totalTimeSpan = end.getTime() - start.getTime();
    
    // 休憩時間を除いた実際の学習時間（ミリ秒）
    const actualStudyMillis = actualStudySeconds * 1000;
    
    // 各時間の配列（0-23時）
    const hourlyDistribution = Array(24).fill(0);
    
    // 開始時間の時と分
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    
    // 現在の時間（計算用）
    let currentTime = new Date(start);
    currentTime.setSeconds(0, 0); // 秒とミリ秒をリセット
    
    // 次の時間の境界
    let nextHourBoundary = new Date(currentTime);
    nextHourBoundary.setHours(startHour + 1, 0, 0, 0);
    
    // 終了時間に達するまで繰り返す
    while (currentTime < end) {
      // この時間帯の終了時刻（次の時間の境界か終了時刻の早い方）
      const slotEnd = nextHourBoundary < end ? nextHourBoundary : end;
      
      // この時間帯の時間（ミリ秒）
      const slotDuration = slotEnd.getTime() - currentTime.getTime();
      
      // 全体に対する比率
      const ratio = slotDuration / totalTimeSpan;
      
      // この時間帯に割り当てる学習時間（秒）
      const allocatedStudyTime = actualStudySeconds * ratio;
      
      // 時間帯のインデックス
      const hourIndex = currentTime.getHours();
      
      // 学習時間を加算
      hourlyDistribution[hourIndex] += allocatedStudyTime;
      
      // 次の時間帯へ
      currentTime = new Date(nextHourBoundary);
      nextHourBoundary = new Date(currentTime);
      nextHourBoundary.setHours(currentTime.getHours() + 1, 0, 0, 0);
    }
    
    return hourlyDistribution;
  };

  // 全セッションの時間帯別分布を計算
  const calculateHourlyDistribution = (sessions) => {
    // 24時間の配列を初期化
    const hourlyTotals = Array(24).fill(0);
    
    sessions.forEach(session => {
      // 各セッションの時間帯別分布を計算
      const distribution = distributeStudyTimeByHour(
        session.startTime,
        session.endTime,
        session.duration,
        session.pausedTime || 0
      );
      
      // 合計に加算
      distribution.forEach((time, hour) => {
        hourlyTotals[hour] += time;
      });
    });
    
    return hourlyTotals.map((total, hour) => ({
      hour,
      value: total
    }));
  };

  // 時間帯をグループ化する関数
  const groupHourlyData = (hourlyData) => {
    // 時間帯グループの定義
    const timeGroups = [
      { name: "深夜 (0-5時)", hours: [0, 1, 2, 3, 4, 5] },
      { name: "朝 (6-11時)", hours: [6, 7, 8, 9, 10, 11] },
      { name: "昼 (12-17時)", hours: [12, 13, 14, 15, 16, 17] },
      { name: "夜 (18-23時)", hours: [18, 19, 20, 21, 22, 23] }
    ];
    
    // 各グループの合計を計算
    return timeGroups.map(group => {
      const groupData = hourlyData.filter(d => group.hours.includes(d.hour));
      const totalTime = groupData.reduce((sum, d) => sum + d.value, 0);
      
      return {
        ...group,
        totalTime
      };
    });
  };

  return (
    <Layout>
      <div style={styles.container}>
        {isStudying ? (
          <div style={styles.activeStudyCard}>
            <div style={styles.activeStudyHeader}>
              <div style={styles.pulsingDot}></div>
              <h2 style={styles.activeStudyTitle}>学習セッション進行中</h2>
            </div>
            
            <div style={styles.activeStudyContent}>
              <div style={styles.activeStudyInfo}>
                <div style={styles.activeStudyTopic}>
                  <span style={styles.activeStudyLabel}>学習内容:</span>
                  <span style={styles.activeStudyValue}>{recordedStudyTopic}</span>
                </div>
                <div style={styles.activeStudyTime}>
                  <span style={styles.activeStudyLabel}>経過時間:</span>
                  <span style={styles.activeStudyValue}>{formatTime(studyDuration)}</span>
                </div>
                <div style={styles.activeStudyStatus}>
                  <span style={styles.activeStudyLabel}>状態:</span>
                  <span 
                    style={{
                      ...styles.activeStudyStatusBadge,
                      backgroundColor: isPaused ? "#ff9800" : "#4CAF50"
                    }}
                  >
                    {isPaused ? "一時停止中" : "学習中"}
                  </span>
                </div>
              </div>
              
              <Link to="/active" style={styles.continueButton}>
                <span style={styles.continueButtonIcon}>▶</span>
                <span>セッションを管理</span>
              </Link>
            </div>
          </div>
        ) : (
          <div style={styles.startStudySection}>
            <div style={styles.startStudyCard}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>新しい学習を始める</h2>
                <p style={styles.cardSubtitle}>
                  学習内容とモチベーションを設定して、効率的な学習を記録しましょう
                </p>
              </div>
              
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
                  style={{
                    ...styles.startButton,
                    opacity: studyTopic.trim() === "" ? 0.6 : 1,
                    cursor: studyTopic.trim() === "" ? "not-allowed" : "pointer",
                  }}
                >
                  <span style={styles.startButtonIcon}>▶</span>
                  学習を開始する
                </button>
              </div>
            </div>
            
            <div style={styles.featuresSection}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>⏱️</div>
                <h3 style={styles.featureTitle}>時間管理</h3>
                <p style={styles.featureDescription}>
                  学習時間を正確に記録し、効率的な時間管理をサポートします
                </p>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📊</div>
                <h3 style={styles.featureTitle}>学習分析</h3>
                <p style={styles.featureDescription}>
                  学習パターンを分析し、最適な学習習慣を見つけられます
                </p>
                <Link to="/analytics" style={styles.featureLink}>分析を見る</Link>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📋</div>
                <h3 style={styles.featureTitle}>学習履歴</h3>
                <p style={styles.featureDescription}>
                  過去の学習記録を確認して、学習の進捗を把握できます
                </p>
                <Link to="/history" style={styles.featureLink}>履歴を見る</Link>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📅</div>
                <h3 style={styles.featureTitle}>カレンダービュー</h3>
                <p style={styles.featureDescription}>
                  カレンダーで学習履歴を視覚的に確認できます。日々の学習パターンを把握しましょう。
                </p>
                <Link to="/calendar" style={styles.featureLink}>
                  カレンダーを見る
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 開発中のみ表示する管理ページへのリンク */}
        <div style={styles.devSection}>
          <Link to="/admin" style={styles.devLink}>
            管理ページ（サンプルデータ生成）
          </Link>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
  },
  heroSection: {
    textAlign: "center",
    marginBottom: "40px",
    position: "relative",
  },
  heroTitle: {
    color: "#2196F3",
    margin: 0,
    fontSize: "48px",
    fontWeight: "800",
    letterSpacing: "1px",
  },
  heroSubtitle: {
    color: "#666",
    fontSize: "18px",
    maxWidth: "600px",
    margin: "10px auto 30px",
    lineHeight: "1.5",
  },
  heroImageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  heroImage: {
    fontSize: "80px",
    animation: "float 3s ease-in-out infinite",
  },
  activeStudyCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    padding: "25px",
    marginBottom: "30px",
    border: "1px solid #e0e0e0",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
    },
  },
  activeStudyHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  pulsingDot: {
    width: "12px",
    height: "12px",
    backgroundColor: "#4CAF50",
    borderRadius: "50%",
    marginRight: "10px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  activeStudyTitle: {
    margin: 0,
    color: "#333",
    fontSize: "22px",
    fontWeight: "600",
  },
  activeStudyContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  activeStudyInfo: {
    flex: "1",
    minWidth: "250px",
  },
  activeStudyTopic: {
    marginBottom: "12px",
  },
  activeStudyTime: {
    marginBottom: "12px",
  },
  activeStudyStatus: {
    display: "flex",
    alignItems: "center",
  },
  activeStudyLabel: {
    color: "#666",
    fontSize: "14px",
    marginRight: "8px",
    fontWeight: "500",
  },
  activeStudyValue: {
    color: "#333",
    fontSize: "16px",
    fontWeight: "600",
  },
  activeStudyStatusBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "14px",
    fontWeight: "500",
  },
  continueButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    backgroundColor: "#2196F3",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    boxShadow: "0 2px 5px rgba(33,150,243,0.3)",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#1976D2",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(33,150,243,0.4)",
    },
  },
  continueButtonIcon: {
    marginRight: "8px",
    fontSize: "16px",
  },
  startStudySection: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  startStudyCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    padding: "25px",
    border: "1px solid #e0e0e0",
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: "20px",
  },
  cardTitle: {
    color: "#333",
    fontSize: "24px",
    margin: 0,
    marginBottom: "10px",
  },
  cardSubtitle: {
    color: "#666",
    fontSize: "16px",
    margin: 0,
    lineHeight: "1.5",
  },
  startButtonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "30px",
  },
  startButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "15px 40px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "30px",
    fontSize: "18px",
    fontWeight: "600",
    boxShadow: "0 4px 10px rgba(33,150,243,0.3)",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#1976D2",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(33,150,243,0.4)",
    },
  },
  startButtonIcon: {
    marginRight: "10px",
    fontSize: "18px",
  },
  startButtonHelp: {
    color: "#f44336",
    fontSize: "14px",
    marginTop: "10px",
  },
  featuresSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "10px",
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "transform 0.3s ease",
    ":hover": {
      transform: "translateY(-5px)",
    },
  },
  featureIcon: {
    fontSize: "40px",
    marginBottom: "15px",
  },
  featureTitle: {
    color: "#333",
    fontSize: "18px",
    margin: "0 0 10px 0",
  },
  featureDescription: {
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: 0,
  },
  featureLink: {
    display: "inline-block",
    marginTop: "10px",
    padding: "6px 12px",
    backgroundColor: "#2196F3",
    color: "white",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#1976D2",
    }
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(0.95)",
      boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)",
    },
    "70%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 10px rgba(76, 175, 80, 0)",
    },
    "100%": {
      transform: "scale(0.95)",
      boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)",
    },
  },
  "@keyframes float": {
    "0%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-10px)",
    },
    "100%": {
      transform: "translateY(0px)",
    },
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