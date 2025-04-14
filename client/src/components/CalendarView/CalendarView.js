import React, { useState, useEffect } from 'react';
import styles from './styles';
import { toDateObject, formatDate } from './utils';
import CalendarComponent from './CalendarComponent';
import StatsPanel from './StatsPanel';
import SessionsList from './SessionsList';
import NoSessionsMessage from './NoSessionsMessage';
import { pieChartColors } from './utils';
import PieChart from './PieChart';

const CalendarView = ({ studyHistory, formatTime, initialDate }) => {
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [selectedDateSessions, setSelectedDateSessions] = useState([]);
  const [topicDistribution, setTopicDistribution] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // モバイル表示の検出
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // 初期チェック
    checkIfMobile();
    
    // リサイズ時にチェック
    window.addEventListener('resize', checkIfMobile);
    
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

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
      setTopicDistribution([]);
      return;
    }
    
    // dataが無効な場合も早期リターン
    if (!data || typeof data !== 'object') {
      console.log("カレンダーデータが無効です");
      setSelectedDateSessions([]);
      setTopicDistribution([]);
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
    
    try {
      setSelectedDate(date);
      
      // カレンダーデータが準備できている場合のみ処理
      if (calendarData && Object.keys(calendarData).length > 0) {
        updateSelectedDateSessions(date, calendarData);
      } else {
        // データがない場合は空のセッションを設定
        setSelectedDateSessions([]);
        setTopicDistribution([]);
      }
    } catch (error) {
      console.error("日付変更エラー:", error);
      // エラー時も状態をクリア
      setSelectedDateSessions([]);
      setTopicDistribution([]);
    }
  };

  // 初期日付が変更された場合に選択日を更新
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  return (
    <div style={{
      ...styles.container,
      ...(isMobile ? styles.containerMobile : {}),
      flexDirection: 'column',
      paddingTop: '20px',
    }}>
      {/* ヘッダー部分 */}
      <div style={{
        ...styles.calendarHeader,
        ...(isMobile ? styles.calendarHeaderMobile : {})
      }}>
        <h2 style={{
          ...styles.calendarTitle,
          ...(isMobile ? styles.calendarTitleMobile : {})
        }}>学習カレンダー</h2>
        {!isMobile && (
          <div style={{
            ...styles.calendarDate,
            ...(isMobile ? styles.calendarDateMobile : {})
          }}>{formatDate(selectedDate)}</div>
        )}
      </div>
      
      {/* コンテンツレイアウト */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%',
        gap: '30px',
      }}>
        {isMobile ? (
          /* モバイル表示時のレイアウト */
          <div style={{ width: '100%' }}>
            {/* カレンダー部分 */}
            <div style={{
              ...styles.calendarSection,
              width: '100%',
              marginTop: '0',
            }}>
              <CalendarComponent 
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                calendarData={calendarData}
              />
            </div>
            
            {/* 学習内容の分布 */}
            {selectedDateSessions.length > 0 && (
              <div style={{
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                marginTop: '20px',
                marginBottom: '10px',
                padding: '15px',
              }}>
                <div style={{...styles.pieChartHeader, fontSize: '18px', color: '#000000', textAlign: 'center'}}>学習内容の分布</div>
                <PieChart 
                  topicDistribution={topicDistribution} 
                  formatTime={formatTime} 
                />
              </div>
            )}
            
            {/* 分析カード（縦一列表示） */}
            {selectedDateSessions.length > 0 && (
              <div style={{
                width: '100%',
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}>
                {/* 合計学習時間カード */}
                <div style={{
                  ...styles.statsCard,
                  height: 'auto',
                  padding: '15px',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <img 
                    src="/total-study-time.png" 
                    alt="合計学習時間"
                    style={{...styles.statsCardIcon, width: '80px', height: '80px'}}
                  />
                  <div style={{
                    ...styles.statsCardContent,
                    alignItems: 'center',
                  }}>
                    <div style={{...styles.statsCardValue, fontSize: '22px'}}>{formatTime(selectedDateSessions.reduce((sum, session) => sum + session.duration, 0))}</div>
                  </div>
                </div>
                
                {/* 学習セッション数カード */}
                <div style={{
                  ...styles.statsCard,
                  height: 'auto',
                  padding: '15px',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <img 
                    src="/study-session.png" 
                    alt="学習セッション数"
                    style={{...styles.statsCardIcon, width: '80px', height: '80px'}}
                  />
                  <div style={{
                    ...styles.statsCardContent,
                    alignItems: 'center',
                  }}>
                    <div style={{...styles.statsCardValue, fontSize: '22px'}}>{selectedDateSessions.length}回</div>
                  </div>
                </div>
                
                {/* 平均モチベーションカード */}
                <div style={{
                  ...styles.statsCard,
                  height: 'auto',
                  padding: '15px',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <img 
                    src="/average-motivation.png" 
                    alt="平均モチベーション"
                    style={{...styles.statsCardIcon, width: '80px', height: '80px'}}
                  />
                  <div style={{
                    ...styles.statsCardContent,
                    alignItems: 'center',
                  }}>
                    <div style={{...styles.statsCardValue, fontSize: '22px'}}>
                      {(selectedDateSessions.reduce((sum, session) => sum + session.motivation, 0) / selectedDateSessions.length).toFixed(1)}/5
                    </div>
                  </div>
                </div>
                
                {/* 平均学習時間カード */}
                <div style={{
                  ...styles.statsCard,
                  height: 'auto',
                  padding: '15px',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <img 
                    src="/average-study-time.png" 
                    alt="平均学習時間"
                    style={{...styles.statsCardIcon, width: '80px', height: '80px'}}
                  />
                  <div style={{
                    ...styles.statsCardContent,
                    alignItems: 'center',
                  }}>
                    <div style={{...styles.statsCardValue, fontSize: '22px'}}>
                      {formatTime(Math.round(selectedDateSessions.reduce((sum, session) => sum + session.duration, 0) / selectedDateSessions.length))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 学習セッション詳細部分 */}
            {selectedDateSessions.length > 0 && (
              <div style={{
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                marginTop: '20px',
              }}>
                <SessionsList 
                  sessions={selectedDateSessions} 
                  formatTime={formatTime} 
                />
              </div>
            )}
            
            {/* セッションがない場合のメッセージ */}
            {selectedDateSessions.length === 0 && (
              <div style={{ marginTop: '20px' }}>
                <NoSessionsMessage />
              </div>
            )}
          </div>
        ) : (
          /* デスクトップ表示時の元のレイアウト */
          <>
            {/* 左側カラム（カレンダーとセッション詳細） */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              gap: '20px',
            }}>
              {/* カレンダー部分 */}
              <div style={{
                ...styles.calendarSection,
                width: '100%',
                marginTop: '0',
              }}>
                <CalendarComponent 
                  selectedDate={selectedDate}
                  handleDateChange={handleDateChange}
                  calendarData={calendarData}
                />
              </div>
              
              {/* 学習セッション詳細部分（カレンダーの下） */}
              {selectedDateSessions.length > 0 && (
                <div style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  marginTop: '10px',
                }}>
                  <SessionsList 
                    sessions={selectedDateSessions} 
                    formatTime={formatTime} 
                  />
                </div>
              )}
            </div>
            
            {/* 右側カラム（統計パネル） */}
            <div style={{
              ...styles.sessionsContainer,
              width: '50%',
              marginTop: '0',
            }}>
              {selectedDateSessions.length === 0 ? (
                <NoSessionsMessage />
              ) : (
                <StatsPanel 
                  selectedDateSessions={selectedDateSessions}
                  topicDistribution={topicDistribution}
                  formatTime={formatTime}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarView; 