import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { fetchStudySessions } from "../utils/api"; // APIをインポート
import { 
  StatCards, 
  TopicDistributionChart, 
  WeeklyStudyChart, 
  TopicMotivationChart, 
  DayMotivationChart,
  Insights,
  PeriodSelector,
  styles
} from "../components/Analytics";
import { toDateObject } from "../components/Analytics/AnalyticsUtils";

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
      const day = toDateObject(session.startTime).getDay();
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
              <PeriodSelector 
                selectedPeriod={selectedPeriod} 
                setSelectedPeriod={setSelectedPeriod} 
              />
            </div>

            <StatCards 
              totalStudyTime={totalStudyTime}
              filteredHistory={filteredHistory}
              averageMotivation={averageMotivation}
              averageStudyTime={averageStudyTime}
              formatTime={formatTime}
            />

            <div style={styles.chartSection}>
              <TopicDistributionChart 
                filteredHistory={filteredHistory}
                topicDistribution={topicDistribution}
                pieChartColors={pieChartColors}
                mostStudiedTopic={mostStudiedTopic}
                formatTime={formatTime}
              />
              
              <WeeklyStudyChart 
                weeklyData={weeklyData}
                formatTime={formatTime}
              />
            </div>
            
            <div style={styles.chartSection}>
              <TopicMotivationChart 
                topicMotivation={topicMotivation}
                formatTime={formatTime}
              />
              
              <DayMotivationChart 
                dayMotivation={dayMotivation}
                formatTime={formatTime}
              />
            </div>
            
            <Insights 
              selectedPeriod={selectedPeriod}
              totalStudyTime={totalStudyTime}
              mostStudiedTopic={mostStudiedTopic}
              topicDistribution={topicDistribution}
              weeklyData={weeklyData}
              topicMotivation={topicMotivation}
              dayMotivation={dayMotivation}
              formatTime={formatTime}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default AnalyticsPage; 