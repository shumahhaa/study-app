import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PieChart from "../components/PieChart";
import { fetchStudySessions } from "../utils/api"; // APIをインポート

const AnalyticsPage = ({ formatTime }) => {
  const [studyHistory, setStudyHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [averageStudyTime, setAverageStudyTime] = useState(0);
  const [averageMotivation, setAverageMotivation] = useState(0);
  const [mostStudiedTopic, setMostStudiedTopic] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [topicDistribution, setTopicDistribution] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [topicMotivation, setTopicMotivation] = useState([]);
  const [dayMotivation, setDayMotivation] = useState([]);

  // APIから学習履歴を取得
  useEffect(() => {
    const fetchStudyHistory = async () => {
      try {
        setLoading(true);
        const response = await fetchStudySessions();
        setStudyHistory(response || []);
        setError(null);
      } catch (err) {
        console.error("学習履歴の取得エラー:", err);
        setError("データを読み込めませんでした。ネットワーク接続を確認してください。");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudyHistory();
  }, []);

  // 円グラフの色
  const pieChartColors = [
    "#2196F3", "#4CAF50", "#FFC107", "#FF5722", "#9C27B0", 
    "#3F51B5", "#009688", "#FFEB3B", "#FF9800", "#E91E63",
    "#607D8B", "#795548", "#8BC34A", "#00BCD4", "#673AB7"
  ];

  // 日付型に変換するヘルパー関数
  const toDateObject = (dateValue) => {
    if (!dateValue) return new Date();
    
    // すでにDateオブジェクトの場合はそのまま返す
    if (dateValue instanceof Date) return dateValue;
    
    // Firestoreのtimestampオブジェクトの場合
    if (typeof dateValue === 'object' && dateValue.toDate) {
      return dateValue.toDate();
    }
    
    // バックエンドから返された通常のJSONオブジェクトの場合
    if (dateValue._seconds) {
      return new Date(dateValue._seconds * 1000);
    }
    
    // ISO文字列または数値タイムスタンプの場合
    return new Date(dateValue);
  };

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
      filtered = studyHistory.filter(session => toDateObject(session.startTime) >= oneWeekAgo);
    } else if (selectedPeriod === "month") {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filtered = studyHistory.filter(session => toDateObject(session.startTime) >= oneMonthAgo);
    } else if (selectedPeriod === "year") {
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      filtered = studyHistory.filter(session => toDateObject(session.startTime) >= oneYearAgo);
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

  // 学習内容ごとのモチベーション分析を追加
  useEffect(() => {
    if (filteredHistory.length === 0) {
      setTopicMotivation([]);
      return;
    }

    // 学習内容ごとのモチベーションデータを集計
    const motivationByTopic = {};
    const sessionCountByTopic = {};

    filteredHistory.forEach(session => {
      if (!motivationByTopic[session.topic]) {
        motivationByTopic[session.topic] = 0;
        sessionCountByTopic[session.topic] = 0;
      }
      motivationByTopic[session.topic] += session.motivation;
      sessionCountByTopic[session.topic]++;
    });

    // 平均モチベーションを計算し、配列に変換
    const motivationData = Object.keys(motivationByTopic).map(topic => ({
      topic,
      averageMotivation: motivationByTopic[topic] / sessionCountByTopic[topic],
      sessionCount: sessionCountByTopic[topic],
      totalTime: topicDistribution.find(t => t.topic === topic)?.time || 0
    }));

    // モチベーション平均値で降順ソート
    motivationData.sort((a, b) => b.averageMotivation - a.averageMotivation);
    setTopicMotivation(motivationData);
  }, [filteredHistory, topicDistribution]);

  // 曜日ごとのモチベーション分析を追加
  useEffect(() => {
    if (filteredHistory.length === 0) {
      setDayMotivation([]);
      return;
    }

    // 曜日ごとのモチベーションデータを集計
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
    const motivationByDay = Array(7).fill(0);
    const sessionCountByDay = Array(7).fill(0);
    const studyTimeByDay = Array(7).fill(0);

    filteredHistory.forEach(session => {
      const day = toDateObject(session.startTime).getDay();
      motivationByDay[day] += session.motivation;
      sessionCountByDay[day]++;
      studyTimeByDay[day] += session.duration;
    });

    // 平均モチベーションを計算し、配列に変換
    const motivationData = weekDays.map((day, index) => ({
      day,
      averageMotivation: sessionCountByDay[index] ? motivationByDay[index] / sessionCountByDay[index] : 0,
      sessionCount: sessionCountByDay[index],
      totalTime: studyTimeByDay[index]
    }));

    setDayMotivation(motivationData);
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

  // モチベーション棒グラフを描画する関数
  const renderMotivationChart = () => {
    if (!topicMotivation || topicMotivation.length === 0) {
      return <div style={styles.noDataMessage}>データがありません</div>;
    }

    const maxMotivation = 5; // モチベーションの最大値は5

    return (
      <div style={styles.motivationChart}>
        {topicMotivation.map((item, index) => {
          const percentage = (item.averageMotivation / maxMotivation) * 100;
          
          // モチベーションレベルに応じた色を設定（低→高で赤→緑）
          let barColor;
          if (item.averageMotivation <= 1) barColor = "#F44336"; // 赤
          else if (item.averageMotivation <= 1.5) barColor = "#FF5722"; // 深いオレンジ
          else if (item.averageMotivation <= 2) barColor = "#FF9800"; // オレンジ
          else if (item.averageMotivation <= 2.5) barColor = "#FFC107"; // 琥珀色
          else if (item.averageMotivation <= 3) barColor = "#FFEB3B"; // 黄色
          else if (item.averageMotivation <= 3.5) barColor = "#CDDC39"; // ライム
          else if (item.averageMotivation <= 4) barColor = "#8BC34A"; // 薄緑
          else if (item.averageMotivation <= 4.5) barColor = "#4CAF50"; // 緑
          else barColor = "#2E7D32"; // 濃い緑

          return (
            <div key={index} style={styles.motivationBarContainer}>
              <div style={styles.motivationTopicContainer}>
                <div style={styles.motivationTopic} title={item.topic}>
                  {item.topic.length > 20 ? `${item.topic.substring(0, 18)}...` : item.topic}
                </div>
                <div style={styles.sessionCount}>
                  {item.sessionCount}回 / {formatTime(item.totalTime)}
                </div>
              </div>
              <div style={styles.barWrapper}>
                <div 
                  style={{
                    ...styles.bar,
                    width: `${percentage}%`,
                    backgroundColor: barColor
                  }}
                ></div>
                <span style={styles.barValue}>
                  {item.averageMotivation.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 曜日ごとのモチベーション棒グラフを描画する関数
  const renderDayMotivationChart = () => {
    if (!dayMotivation || dayMotivation.filter(d => d.sessionCount > 0).length === 0) {
      return <div style={styles.noDataMessage}>データがありません</div>;
    }

    const maxMotivation = 5; // モチベーションの最大値は5
    const daysWithData = dayMotivation.filter(d => d.sessionCount > 0);

    return (
      <div style={styles.motivationChart}>
        {daysWithData.map((item, index) => {
          const percentage = (item.averageMotivation / maxMotivation) * 100;
          
          // モチベーションレベルに応じた色を設定（低→高で赤→緑）
          let barColor;
          if (item.averageMotivation <= 1) barColor = "#F44336"; // 赤
          else if (item.averageMotivation <= 1.5) barColor = "#FF5722"; // 深いオレンジ
          else if (item.averageMotivation <= 2) barColor = "#FF9800"; // オレンジ
          else if (item.averageMotivation <= 2.5) barColor = "#FFC107"; // 琥珀色
          else if (item.averageMotivation <= 3) barColor = "#FFEB3B"; // 黄色
          else if (item.averageMotivation <= 3.5) barColor = "#CDDC39"; // ライム
          else if (item.averageMotivation <= 4) barColor = "#8BC34A"; // 薄緑
          else if (item.averageMotivation <= 4.5) barColor = "#4CAF50"; // 緑
          else barColor = "#2E7D32"; // 濃い緑

          return (
            <div key={index} style={styles.motivationBarContainer}>
              <div style={styles.motivationTopicContainer}>
                <div style={styles.motivationTopic}>
                  {item.day}曜日
                </div>
                <div style={styles.sessionCount}>
                  {item.sessionCount}回 / {formatTime(item.totalTime)}
                </div>
              </div>
              <div style={styles.barWrapper}>
                <div 
                  style={{
                    ...styles.bar,
                    width: `${percentage}%`,
                    backgroundColor: barColor
                  }}
                ></div>
                <span style={styles.barValue}>
                  {item.averageMotivation.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // グローバルスタイルを追加
  const addGlobalStyles = () => {
    // 期間ボタンのスタイルを追加
    if (!document.getElementById('period-button-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'period-button-styles';
      styleElement.innerHTML = `
        .period-button {
          padding: 8px 16px;
          border: none;
          background-color: #f5f5f5;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .period-button:hover {
          background-color: #e0e0e0;
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .period-button-active {
          background-color: #2196F3;
          color: white;
        }
        
        .period-button-active:hover {
          background-color: #1976D2;
          box-shadow: 0 2px 5px rgba(33, 150, 243, 0.3);
        }
      `;
      document.head.appendChild(styleElement);
    }
  };

  // コンポーネントがマウントされたときにスタイルを追加
  useEffect(() => {
    addGlobalStyles();
  }, []);

  return (
    <Layout>
      <div style={styles.container}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loading}>データを読み込み中...</div>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <div style={styles.error}>{error}</div>
          </div>
        ) : studyHistory.length === 0 ? (
          <div style={styles.noDataContainer}>
            <p style={styles.noDataMessage}>まだ学習履歴がありません。学習を開始してデータを作成しましょう。</p>
          </div>
        ) : (
          <>
            {/* ヘッダー部分を修正 */}
            <div style={styles.header}>
              <h1 style={styles.title}>学習分析</h1>
              <div style={styles.periodSelector}>
                <button 
                  onClick={() => setSelectedPeriod("week")}
                  className={`period-button ${selectedPeriod === "week" ? "period-button-active" : ""}`}
                >
                  直近7日間
                </button>
                <button 
                  onClick={() => setSelectedPeriod("month")}
                  className={`period-button ${selectedPeriod === "month" ? "period-button-active" : ""}`}
                >
                  直近30日間
                </button>
                <button 
                  onClick={() => setSelectedPeriod("year")}
                  className={`period-button ${selectedPeriod === "year" ? "period-button-active" : ""}`}
                >
                  直近1年間
                </button>
                <button 
                  onClick={() => setSelectedPeriod("all")}
                  className={`period-button ${selectedPeriod === "all" ? "period-button-active" : ""}`}
                >
                  全期間
                </button>
              </div>
            </div>

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
                <div style={styles.statsIcon}>⚡</div>
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
                      legendColumns={4}
                      formatTime={formatTime}
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
            
            <div style={styles.chartSection}>
              <div style={styles.chartCard}>
                <h2 style={styles.chartTitle}>学習内容ごとのモチベーション分析</h2>
                <div style={styles.chartContent}>
                  {renderMotivationChart()}
                </div>
                <div style={styles.chartFooter}>
                  <div style={styles.chartHighlight}>
                    最もモチベーションが高い学習内容: <strong>{topicMotivation[0]?.topic || "なし"}</strong> 
                    {topicMotivation[0] ? ` (${topicMotivation[0].averageMotivation.toFixed(1)}/5)` : ""}
                  </div>
                </div>
              </div>
              
              <div style={styles.chartCard}>
                <h2 style={styles.chartTitle}>曜日ごとのモチベーション分析</h2>
                <div style={styles.chartContent}>
                  {renderDayMotivationChart()}
                </div>
                <div style={styles.chartFooter}>
                  <div style={styles.chartHighlight}>
                    最もモチベーションが高い曜日: <strong>
                      {dayMotivation.filter(d => d.sessionCount > 0)
                        .reduce((max, day) => day.averageMotivation > max.averageMotivation ? day : max, 
                          { averageMotivation: 0 }).day || "なし"}曜日
                    </strong>
                    {dayMotivation.filter(d => d.sessionCount > 0).length > 0 ? 
                      ` (${dayMotivation.filter(d => d.sessionCount > 0)
                        .reduce((max, day) => day.averageMotivation > max.averageMotivation ? day : max, 
                          { averageMotivation: 0 }).averageMotivation.toFixed(1)}/5)` : ""}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={styles.insightsSection}>
              <h2 style={styles.insightsTitle}>学習インサイト</h2>
              <div style={styles.insightsList}>
                {totalStudyTime > 0 && (
                  <div style={styles.insightItem}>
                    <div style={styles.insightIcon}>📊</div>
                    <div style={styles.insightText}>
                      {selectedPeriod === "week" ? "直近7日間" : 
                       selectedPeriod === "month" ? "直近30日間" : 
                       selectedPeriod === "year" ? "直近1年間" : "全期間"}
                      の合計学習時間: <strong>{formatTime(totalStudyTime)}</strong>
                    </div>
                  </div>
                )}
                
                {mostStudiedTopic && (
                  <div style={styles.insightItem}>
                    <div style={styles.insightIcon}>📚</div>
                    <div style={styles.insightText}>
                      最も学習した内容: <strong>{mostStudiedTopic}</strong> 
                      （全体の <strong>{Math.round((topicDistribution.find(t => t.topic === mostStudiedTopic)?.time || 0) / totalStudyTime * 100)}%</strong>）
                    </div>
                  </div>
                )}
                
                {weeklyData.length > 0 && weeklyData.some(d => d.totalTime > 0) && (
                  <div style={styles.insightItem}>
                    <div style={styles.insightIcon}>📅</div>
                    <div style={styles.insightText}>
                      最も学習時間が長い曜日: <strong>
                        {weeklyData.reduce((max, day) => day.totalTime > max.totalTime ? day : max, { totalTime: 0 }).day}曜日
                      </strong>
                    </div>
                  </div>
                )}
                
                {topicMotivation.length > 0 && (
                  <div style={styles.insightItem}>
                    <div style={styles.insightIcon}>🔍</div>
                    <div style={styles.insightText}>
                      モチベーションが最も高い学習内容: <strong>{topicMotivation[0]?.topic}</strong>
                      （平均 <strong>{topicMotivation[0]?.averageMotivation.toFixed(1)}/5</strong>）
                    </div>
                  </div>
                )}
                
                {dayMotivation.filter(d => d.sessionCount > 0).length > 0 && (
                  <div style={styles.insightItem}>
                    <div style={styles.insightIcon}>📆</div>
                    <div style={styles.insightText}>
                      モチベーションが最も高い曜日: <strong>
                        {dayMotivation.filter(d => d.sessionCount > 0)
                          .reduce((max, day) => day.averageMotivation > max.averageMotivation ? day : max, 
                            { averageMotivation: 0 }).day}曜日
                      </strong>
                      （平均 <strong>
                        {dayMotivation.filter(d => d.sessionCount > 0)
                          .reduce((max, day) => day.averageMotivation > max.averageMotivation ? day : max, 
                            { averageMotivation: 0 }).averageMotivation.toFixed(1)}/5
                      </strong>）
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
    textAlign: 'center',
    padding: '40px',
    margin: '20px 0',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
    fontSize: '16px',
    color: '#666',
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
  motivationChart: {
    width: '100%',
    padding: '10px 0',
  },
  motivationBarContainer: {
    marginBottom: '20px',
  },
  motivationTopicContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  motivationTopic: {
    color: '#333',
    fontSize: '15px',
    fontWeight: '500',
  },
  sessionCount: {
    color: '#666',
    fontSize: '13px',
  },
  topicSection: {
    marginTop: "30px"
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

export default AnalyticsPage; 