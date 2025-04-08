import React, { useState, useEffect } from 'react';
import styles from './styles';
import { toDateObject, formatDate } from './utils';
import CalendarComponent from './CalendarComponent';
import StatsPanel from './StatsPanel';
import SessionsList from './SessionsList';
import NoSessionsMessage from './NoSessionsMessage';
import { pieChartColors } from './utils';

const CalendarView = ({ studyHistory, formatTime, initialDate }) => {
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [selectedDateSessions, setSelectedDateSessions] = useState([]);
  const [topicDistribution, setTopicDistribution] = useState([]);

  // 日付ごとの学習データを集計
  useEffect(() => {
    const data = {};
    
    studyHistory.forEach(session => {
      try {
        // タイムゾーンを考慮した日付の取得
        const date = toDateObject(session.startTime);
        // 現地時間でのYYYY-MM-DD形式に変換
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        if (!data[dateStr]) {
          data[dateStr] = {
            totalTime: 0,
            sessions: []
          };
        }
        
        data[dateStr].totalTime += session.duration;
        data[dateStr].sessions.push(session);
      } catch (err) {
        console.error("セッションデータ処理エラー:", err, session);
      }
    });
    
    setCalendarData(data);
    
    // 選択中の日付のセッションを更新（selectedDateとdataが正しい場合のみ）
    if (selectedDate) {
      updateSelectedDateSessions(selectedDate, data);
    }
  }, [studyHistory]);

  // 選択された日付が変更されたとき
  useEffect(() => {
    if (selectedDate && Object.keys(calendarData).length > 0) {
      updateSelectedDateSessions(selectedDate, calendarData);
    }
  }, [selectedDate, calendarData]);

  // 選択された日付のセッションを更新
  const updateSelectedDateSessions = (date, data) => {
    // dateがnullまたはundefinedの場合は処理を中止
    if (!date) {
      console.log("日付が指定されていません");
      setSelectedDateSessions([]);
      return;
    }
    
    try {
      // 選択された日付をローカルタイムゾーンでYYYY-MM-DD形式に変換
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const sessions = data[dateStr]?.sessions || [];
      setSelectedDateSessions(sessions);
      
      // トピック分布データを計算
      calculateTopicDistribution(sessions);
    } catch (err) {
      console.error("日付処理エラー:", err, date);
      setSelectedDateSessions([]);
      setTopicDistribution([]);
    }
  };

  // トピック分布を計算
  const calculateTopicDistribution = (sessions) => {
    if (sessions.length === 0) {
      setTopicDistribution([]);
      return;
    }
    
    const topicMap = {};
    let totalDuration = 0;
    
    // 各トピックの学習時間を集計
    sessions.forEach(session => {
      if (!topicMap[session.topic]) {
        topicMap[session.topic] = 0;
      }
      topicMap[session.topic] += session.duration;
      totalDuration += session.duration;
    });
    
    // 分布データを作成
    const distribution = Object.keys(topicMap).map((topic, index) => {
      return {
        topic,
        duration: topicMap[topic],
        percentage: Math.round((topicMap[topic] / totalDuration) * 100),
        color: pieChartColors[index % pieChartColors.length]
      };
    });
    
    // 学習時間の降順でソート
    distribution.sort((a, b) => b.duration - a.duration);
    
    setTopicDistribution(distribution);
  };

  // 日付が変更されたときの処理
  const handleDateChange = (date) => {
    if (!date) return;
    
    setSelectedDate(date);
    if (calendarData) {
      updateSelectedDateSessions(date, calendarData);
    }
  };

  // 初期日付が変更された場合に選択日を更新
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  return (
    <div style={styles.container}>
      <div style={styles.calendarSection}>
        <CalendarComponent 
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          calendarData={calendarData}
        />
      </div>
      
      <div style={styles.sessionsContainer}>
        <h3 style={styles.dateHeading}>{formatDate(selectedDate)}</h3>
        
        {selectedDateSessions.length === 0 ? (
          <NoSessionsMessage />
        ) : (
          <>
            <StatsPanel 
              selectedDateSessions={selectedDateSessions}
              topicDistribution={topicDistribution}
              formatTime={formatTime}
            />
            
            <SessionsList 
              sessions={selectedDateSessions} 
              formatTime={formatTime} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarView; 