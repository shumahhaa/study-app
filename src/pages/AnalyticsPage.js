import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PieChart from "../components/PieChart";

const AnalyticsPage = ({ studyHistory, formatTime }) => {
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [averageStudyTime, setAverageStudyTime] = useState(0);
  const [averageMotivation, setAverageMotivation] = useState(0);
  const [mostStudiedTopic, setMostStudiedTopic] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [topicDistribution, setTopicDistribution] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [filteredHistory, setFilteredHistory] = useState([]);

  // 円グラフの色
  const pieChartColors = [
    "#2196F3", "#4CAF50", "#FFC107", "#FF5722", "#9C27B0", 
    "#3F51B5", "#009688", "#FFEB3B", "#FF9800", "#E91E63",
    "#607D8B", "#795548", "#8BC34A", "#00BCD4", "#673AB7"
  ];

  // 期間に基づいて履歴をフィルタリング
  useEffect(() => {
    if (!studyHistory || studyHistory.length === 0) {
      setFilteredHistory([]);
      return;
    }

    const now = new Date();
    let filtered = [...studyHistory];

    if (selectedPeriod === "week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = studyHistory.filter(session => new Date(session.startTime) >= oneWeekAgo);
    } else if (selectedPeriod === "month") {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filtered = studyHistory.filter(session => new Date(session.startTime) >= oneMonthAgo);
    } else if (selectedPeriod === "year") {
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      filtered = studyHistory.filter(session => new Date(session.startTime) >= oneYearAgo);
    }

    setFilteredHistory(filtered);
  }, [studyHistory, selectedPeriod]);

  // 基本的な統計情報を計算
  useEffect(() => {
    if (filteredHistory.length === 0) {
      setTotalStudyTime(0);
      setAverageStudyTime(0);
      setAverageMotivation(0);
      setMostStudiedTopic("");
      return;
    }

    // 合計学習時間
    const total = filteredHistory.reduce((sum, session) => sum + session.duration, 0);
    setTotalStudyTime(total);

    // 平均学習時間
    setAverageStudyTime(total / filteredHistory.length);

    // 平均モチベーション
    const avgMotivation = filteredHistory.reduce((sum, session) => sum + session.motivation, 0) / filteredHistory.length;
    setAverageMotivation(avgMotivation);

    // 最も学習したトピック
    const topicCounts = {};
    filteredHistory.forEach(session => {
      topicCounts[session.topic] = (topicCounts[session.topic] || 0) + session.duration;
    });

    let maxTopic = "";
    let maxTime = 0;
    for (const [topic, time] of Object.entries(topicCounts)) {
      if (time > maxTime) {
        maxTopic = topic;
        maxTime = time;
      }
    }
    setMostStudiedTopic(maxTopic);

    // トピック分布データの作成
    const topicData = [];
    for (const [topic, time] of Object.entries(topicCounts)) {
      topicData.push({
        topic,
        time,
        percentage: Math.round((time / total) * 100)
      });
    }
    topicData.sort((a, b) => b.time - a.time);
    setTopicDistribution(topicData);

    // 週間データの作成
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
    const weeklyStats = Array(7).fill(0);
    const weeklyCount = Array(7).fill(0);

    filteredHistory.forEach(session => {
      const day = new Date(session.startTime).getDay();
      weeklyStats[day] += session.duration;
      weeklyCount[day]++;
    });

    const weeklyAvg = weeklyStats.map((time, index) => ({
      day: weekDays[index],
      totalTime: time,
      averageTime: weeklyCount[index] ? time / weeklyCount[index] : 0,
      count: weeklyCount[index]
    }));
    setWeeklyData(weeklyAvg);
  }, [filteredHistory]);

  // トピック分布データを円グラフ用に変換
  const getPieChartData = () => {
    return topicDistribution.map(topic => ({
      label: topic.topic,
      value: topic.time
    }));
  };

  // 棒グラフを描画する関数
  const renderBarChart = (data, valueKey, maxValue, colorStart, colorEnd) => {
    if (!data || data.length === 0) return <div style={styles.noDataMessage}>データがありません</div>;

    return (
      <div style={styles.barChart}>
        {data.map((item, index) => {
          const value = item[valueKey];
          const percentage = maxValue ? (value / maxValue) * 100 : 0;
          
          // グラデーションの色を計算
          const ratio = index / (data.length - 1 || 1);
          const r = Math.round(parseInt(colorStart.slice(1, 3), 16) * (1 - ratio) + parseInt(colorEnd.slice(1, 3), 16) * ratio);
          const g = Math.round(parseInt(colorStart.slice(3, 5), 16) * (1 - ratio) + parseInt(colorEnd.slice(3, 5), 16) * ratio);
          const b = Math.round(parseInt(colorStart.slice(5, 7), 16) * (1 - ratio) + parseInt(colorEnd.slice(5, 7), 16) * ratio);
          const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

          return (
            <div key={index} style={styles.barContainer}>
              <div style={styles.barLabel}>{item.day || item.name}</div>
              <div style={styles.barWrapper}>
                <div 
                  style={{
                    ...styles.bar,
                    width: `${percentage}%`,
                    backgroundColor: color
                  }}
                ></div>
                <span style={styles.barValue}>
                  {valueKey.includes("Time") ? formatTime(value) : value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>学習分析</h1>
          <div style={styles.periodSelector}>
            <button 
              onClick={() => setSelectedPeriod("week")}
              style={{
                ...styles.periodButton,
                backgroundColor: selectedPeriod === "week" ? "#2196F3" : "#e0e0e0",
                color: selectedPeriod === "week" ? "white" : "#333"
              }}
            >
              週間
            </button>
            <button 
              onClick={() => setSelectedPeriod("month")}
              style={{
                ...styles.periodButton,
                backgroundColor: selectedPeriod === "month" ? "#2196F3" : "#e0e0e0",
                color: selectedPeriod === "month" ? "white" : "#333"
              }}
            >
              月間
            </button>
            <button 
              onClick={() => setSelectedPeriod("year")}
              style={{
                ...styles.periodButton,
                backgroundColor: selectedPeriod === "year" ? "#2196F3" : "#e0e0e0",
                color: selectedPeriod === "year" ? "white" : "#333"
              }}
            >
              年間
            </button>
            <button 
              onClick={() => setSelectedPeriod("all")}
              style={{
                ...styles.periodButton,
                backgroundColor: selectedPeriod === "all" ? "#2196F3" : "#e0e0e0",
                color: selectedPeriod === "all" ? "white" : "#333"
              }}
            >
              全期間
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div style={styles.noDataContainer}>
            <div style={styles.noDataIcon}>📊</div>
            <h2 style={styles.noDataTitle}>分析データがありません</h2>
            <p style={styles.noDataText}>
              学習セッションを記録すると、ここに分析結果が表示されます。
            </p>
          </div>
        ) : (
          <>
            <div style={styles.statsCards}>
              <div style={styles.statsCard}>
                <div style={styles.statsIcon}>⏱️</div>
                <div style={styles.statsInfo}>
                  <h3 style={styles.statsTitle}>合計学習時間</h3>
                  <div style={styles.statsValue}>{formatTime(totalStudyTime)}</div>
                </div>
              </div>
              
              <div style={styles.statsCard}>
                <div style={styles.statsIcon}>📚</div>
                <div style={styles.statsInfo}>
                  <h3 style={styles.statsTitle}>学習セッション数</h3>
                  <div style={styles.statsValue}>{filteredHistory.length}回</div>
                </div>
              </div>
              
              <div style={styles.statsCard}>
                <div style={styles.statsIcon}>⚡</div>
                <div style={styles.statsInfo}>
                  <h3 style={styles.statsTitle}>平均モチベーション</h3>
                  <div style={styles.statsValue}>{averageMotivation.toFixed(1)}/5</div>
                </div>
              </div>
              
              <div style={styles.statsCard}>
                <div style={styles.statsIcon}>🔄</div>
                <div style={styles.statsInfo}>
                  <h3 style={styles.statsTitle}>平均学習時間</h3>
                  <div style={styles.statsValue}>{formatTime(averageStudyTime)}</div>
                </div>
              </div>
            </div>

            <div style={styles.chartSection}>
              <div style={styles.chartCard}>
                <h2 style={styles.chartTitle}>学習内容の分布</h2>
                <div style={styles.chartContent}>
                  {filteredHistory.length > 0 ? (
                    <PieChart 
                      data={getPieChartData()} 
                      colors={pieChartColors}
                    />
                  ) : (
                    <div style={styles.noDataMessage}>データがありません</div>
                  )}
                </div>
                <div style={styles.chartFooter}>
                  <div style={styles.chartHighlight}>
                    最も学習した内容: <strong>{mostStudiedTopic || "なし"}</strong>
                  </div>
                </div>
              </div>
              
              <div style={styles.chartCard}>
                <h2 style={styles.chartTitle}>曜日別の学習時間</h2>
                <div style={styles.chartContent}>
                  {renderBarChart(
                    weeklyData, 
                    "totalTime", 
                    Math.max(...weeklyData.map(d => d.totalTime)), 
                    "#2196F3", 
                    "#64B5F6"
                  )}
                </div>
                <div style={styles.chartFooter}>
                  <div style={styles.chartHighlight}>
                    最も学習した曜日: <strong>
                      {weeklyData.reduce((max, day) => day.totalTime > max.totalTime ? day : max, { totalTime: 0 }).day}曜日
                    </strong>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={styles.insightsSection}>
              <h2 style={styles.insightsTitle}>学習インサイト</h2>
              <div style={styles.insightsList}>
                {totalStudyTime > 0 && (
                  <div style={styles.insightItem}>
                    <div style={styles.insightIcon}>💡</div>
                    <div style={styles.insightText}>
                      {selectedPeriod === "week" ? "今週" : 
                       selectedPeriod === "month" ? "今月" : 
                       selectedPeriod === "year" ? "今年" : "全期間"}
                      の合計学習時間は <strong>{formatTime(totalStudyTime)}</strong> です。
                    </div>
                  </div>
                )}
                
                {mostStudiedTopic && (
                  <div style={styles.insightItem}>
                    <div style={styles.insightIcon}>🎯</div>
                    <div style={styles.insightText}>
                      最も学習している内容は <strong>{mostStudiedTopic}</strong> で、
                      全体の <strong>{Math.round((topicDistribution.find(t => t.topic === mostStudiedTopic)?.time || 0) / totalStudyTime * 100)}%</strong> を占めています。
                    </div>
                  </div>
                )}
                
                {weeklyData.length > 0 && (
                  <div style={styles.insightItem}>
                    <div style={styles.insightIcon}>📅</div>
                    <div style={styles.insightText}>
                      <strong>{weeklyData.reduce((max, day) => day.totalTime > max.totalTime ? day : max, { totalTime: 0 }).day}曜日</strong> に
                      最も多く学習する傾向があります。
                    </div>
                  </div>
                )}
                
                {averageMotivation > 0 && (
                  <div style={styles.insightItem}>
                    <div style={styles.insightIcon}>🔋</div>
                    <div style={styles.insightText}>
                      平均モチベーションは <strong>{averageMotivation.toFixed(1)}/5</strong> です。
                      {averageMotivation >= 4 ? "とても高いモチベーションで学習できています！" :
                       averageMotivation >= 3 ? "安定したモチベーションで学習できています。" :
                       "モチベーションを高める工夫をしてみましょう。"}
                    </div>
                  </div>
                )}
                
                {filteredHistory.length > 0 && (
                  <div style={styles.insightItem}>
                    <div style={styles.insightIcon}>⏱️</div>
                    <div style={styles.insightText}>
                      平均学習時間は <strong>{formatTime(averageStudyTime)}</strong> です。
                      {averageStudyTime > 3600 ? "長時間の集中力が素晴らしいです！" :
                       averageStudyTime > 1800 ? "良い集中力で学習できています。" :
                       "短時間でも継続的な学習が大切です。"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  title: {
    color: "#333",
    margin: 0,
    fontSize: "28px",
  },
  periodSelector: {
    display: "flex",
    gap: "10px",
  },
  periodButton: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  noDataContainer: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    marginTop: "20px",
  },
  noDataIcon: {
    fontSize: "60px",
    marginBottom: "20px",
    opacity: "0.5",
  },
  noDataTitle: {
    color: "#333",
    fontSize: "24px",
    margin: "0 0 10px 0",
  },
  noDataText: {
    color: "#666",
    fontSize: "16px",
    maxWidth: "400px",
    margin: "0 auto",
  },
  statsCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
  },
  statsIcon: {
    fontSize: "36px",
    marginRight: "15px",
  },
  statsInfo: {
    flex: 1,
  },
  statsTitle: {
    color: "#666",
    fontSize: "14px",
    margin: "0 0 5px 0",
    fontWeight: "500",
  },
  statsValue: {
    color: "#333",
    fontSize: "24px",
    fontWeight: "700",
  },
  chartSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  chartTitle: {
    color: "#333",
    fontSize: "18px",
    margin: "0 0 20px 0",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  chartContent: {
    minHeight: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chartFooter: {
    marginTop: "15px",
    textAlign: "center",
  },
  chartHighlight: {
    color: "#666",
    fontSize: "14px",
  },
  barChart: {
    width: "100%",
    padding: "10px 0",
  },
  barContainer: {
    marginBottom: "15px",
  },
  barLabel: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "5px",
  },
  barWrapper: {
    position: "relative",
    height: "30px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    transition: "width 1s ease-out",
  },
  barValue: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#333",
    fontSize: "14px",
    fontWeight: "500",
  },
  noDataMessage: {
    color: "#999",
    fontSize: "16px",
    textAlign: "center",
    padding: "40px 0",
  },
  insightsSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "30px",
  },
  insightsTitle: {
    color: "#333",
    fontSize: "20px",
    margin: "0 0 20px 0",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  insightsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  insightItem: {
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
  },
  insightIcon: {
    fontSize: "24px",
    marginRight: "15px",
  },
  insightText: {
    color: "#333",
    fontSize: "16px",
    lineHeight: "1.5",
  },
};

export default AnalyticsPage; 