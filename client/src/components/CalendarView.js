import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link } from 'react-router-dom';

const CalendarView = ({ studyHistory, formatTime }) => {
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateSessions, setSelectedDateSessions] = useState([]);
  const [topicDistribution, setTopicDistribution] = useState([]);

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
    if (dateValue && typeof dateValue === 'object' && dateValue._seconds !== undefined) {
      return new Date(dateValue._seconds * 1000);
    }
    
    // ISO文字列の場合
    try {
      return new Date(dateValue);
    } catch (e) {
      console.error("日付変換エラー:", e, dateValue);
      return new Date(); // エラーの場合は現在の日付を返す
    }
  };

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
    
    // 選択中の日付のセッションを更新
    updateSelectedDateSessions(selectedDate, data);
  }, [studyHistory, selectedDate]);

  // 選択された日付のセッションを更新
  const updateSelectedDateSessions = (date, data) => {
    // 選択された日付をローカルタイムゾーンでYYYY-MM-DD形式に変換
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const sessions = data[dateStr]?.sessions || [];
    setSelectedDateSessions(sessions);
    
    // トピック分布データを計算
    calculateTopicDistribution(sessions);
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
    setSelectedDate(date);
    updateSelectedDateSessions(date, calendarData);
  };

  // 日付のコンテンツをカスタマイズ
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    // 選択された日付をローカルタイムゾーンでYYYY-MM-DD形式に変換
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dateData = calendarData[dateStr];
    
    if (!dateData) return null;
    
    // 学習時間に応じた色の濃さを計算
    const maxTime = 4 * 60 * 60; // 4時間を最大値とする
    const intensity = Math.min(dateData.totalTime / maxTime, 1);
    const backgroundColor = `rgba(76, 175, 80, ${intensity * 0.8})`;
    
    return (
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0,
        height: '4px', 
        backgroundColor,
        borderRadius: '2px'
      }}></div>
    );
  };

  // 日付のクラス名をカスタマイズ
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    
    // 選択された日付をローカルタイムゾーンでYYYY-MM-DD形式に変換
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return calendarData[dateStr] ? 'has-study-session' : '';
  };

  // 日付をフォーマット
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdays[date.getDay()];
    
    return `${year}年${month}月${day}日(${weekday})`;
  };

  // モチベーションに応じた色を取得
  const getMotivationColor = (level) => {
    const colors = {
      1: "#ff6b6b",
      2: "#ffa06b",
      3: "#ffd06b",
      4: "#9be36b",
      5: "#4CAF50"
    };
    return colors[level] || "#ddd";
  };

  // 日時をフォーマット
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "不明";
    
    try {
      const date = toDateObject(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${hours}:${minutes}`;
    } catch (e) {
      console.error("日時フォーマットエラー:", e, timestamp);
      return "不明";
    }
  };

  // 円グラフをレンダリング
  const renderPieChart = () => {
    if (topicDistribution.length === 0) return null;
    
    // 0より大きい値を持つデータのみをフィルタリング
    const validDistribution = topicDistribution.filter(item => item.duration > 0);
    
    // 有効なデータがない場合
    if (validDistribution.length === 0) {
      return <div style={styles.noDataMessage}>有効なデータがありません</div>;
    }
    
    const size = 200;
    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;
    
    let startAngle = 0;
    const paths = [];
    const labels = [];
    
    // 単一トピックの場合（100%）の特別処理
    if (validDistribution.length === 1) {
      const item = validDistribution[0];
      
      paths.push(
        <circle
          key="full-circle"
          cx={centerX}
          cy={centerY}
          r={radius}
          fill={item.color}
          stroke="#fff"
          strokeWidth="1"
        />
      );
      
      // 中央にラベルを表示
      labels.push(
        <text
          key="center-label"
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontWeight="bold"
          fontSize="16"
        >
          100%
        </text>
      );
      
      // トピック名を表示
      labels.push(
        <text
          key="topic-label"
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontWeight="bold"
          fontSize="12"
        >
          {item.topic}
        </text>
      );
    } else {
      // 複数トピックの場合は通常の円グラフを描画
      validDistribution.forEach((item, index) => {
        const angle = (item.percentage / 100) * 360;
        const endAngle = startAngle + angle;
        
        // 円弧のパスを計算
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);
        
        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);
        
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        const pathData = [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');
        
        paths.push(
          <path
            key={index}
            d={pathData}
            fill={item.color}
            stroke="#fff"
            strokeWidth="1"
          />
        );
        
        // スライスが十分な大きさの場合にのみラベルを表示
        if (item.percentage >= 8) { // 8%以上のスライスにラベルを表示
          const midAngle = startAngle + (angle / 2);
          const midRad = (midAngle - 90) * (Math.PI / 180);
          
          // パーセンテージラベルの位置（円の中心から少し離す）
          const percentLabelRadius = radius * 0.6;
          const percentLabelX = centerX + percentLabelRadius * Math.cos(midRad);
          const percentLabelY = centerY + percentLabelRadius * Math.sin(midRad);
          
          // トピック名ラベルの位置（パーセンテージラベルの下）
          const topicLabelRadius = radius * 0.6;
          const topicLabelX = centerX + topicLabelRadius * Math.cos(midRad);
          const topicLabelY = centerY + topicLabelRadius * Math.sin(midRad) + 15;
          
          // パーセンテージラベル
          labels.push(
            <text
              key={`percent-${index}`}
              x={percentLabelX}
              y={percentLabelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontWeight="bold"
              fontSize="12"
            >
              {item.percentage}%
            </text>
          );
          
          // トピック名ラベル（短縮表示）
          const shortTopicName = item.topic.length > 8 ? item.topic.substring(0, 7) + '...' : item.topic;
          
          labels.push(
            <text
              key={`topic-${index}`}
              x={topicLabelX}
              y={topicLabelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontWeight="bold"
              fontSize="10"
            >
              {shortTopicName}
            </text>
          );
        }
        
        startAngle = endAngle;
      });
    }
    
    return (
      <div style={styles.pieChartContainer}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={radius} 
            fill="#f5f5f5" 
          />
          {paths}
          {labels}
        </svg>
        <div style={styles.pieChartLegend}>
          {validDistribution.map((item, index) => (
            <div 
              key={index} 
              style={styles.legendItem}
            >
              <div 
                style={{ 
                  ...styles.legendColor, 
                  backgroundColor: item.color
                }}
              ></div>
              <div style={styles.legendText}>
                <span style={styles.legendTopic}>{item.topic}</span>
                <span style={styles.legendTime}>{formatTime(item.duration)} ({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.calendarSection}>
        <div style={styles.calendarWrapper}>
          <div style={styles.calendarContainer}>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              locale="ja-JP"
              className="custom-calendar"
            />
          </div>
          
          <div style={styles.legend}>
            <div style={styles.legendTitle}>学習時間の目安</div>
            <div style={styles.legendItems}>
              <div style={styles.legendItem}>
                <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.2)'}}></div>
                <span>〜1時間</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.4)'}}></div>
                <span>1〜2時間</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.6)'}}></div>
                <span>2〜3時間</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.8)'}}></div>
                <span>3〜4時間</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 1.0)'}}></div>
                <span>4時間以上</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.sessionsContainer}>
        <h3 style={styles.dateHeading}>{formatDate(selectedDate)}</h3>
        
        {selectedDateSessions.length === 0 ? (
          <div style={styles.noSessions}>
            <p>この日の学習記録はありません。</p>
            <p style={styles.noSessionsSubtext}>別の日を選択するか、新しい学習セッションを記録してください。</p>
          </div>
        ) : (
          <>
            <div style={styles.sessionsSummary}>
              <div style={styles.summaryCard}>
                <div style={styles.statsSummary}>
                  <div style={styles.summaryHeader}>学習概要</div>
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>合計学習時間</span>
                    <span style={styles.summaryValue}>
                      {formatTime(selectedDateSessions.reduce((sum, session) => sum + session.duration, 0))}
                    </span>
                  </div>
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>学習セッション数</span>
                    <span style={styles.summaryValue}>{selectedDateSessions.length}回</span>
                  </div>
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>平均モチベーション</span>
                    <span style={styles.summaryValue}>
                      {(selectedDateSessions.reduce((sum, session) => sum + session.motivation, 0) / selectedDateSessions.length).toFixed(1)}/5
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={styles.summaryCard}>
                <div style={styles.pieChartHeader}>学習内容の分布</div>
                {/* 円グラフを表示 */}
                {renderPieChart()}
              </div>
            </div>
            
            <div style={styles.sessionsListContainer}>
              <h4 style={styles.sessionsListTitle}>学習セッション詳細</h4>
              <div style={styles.sessionsList}>
                {selectedDateSessions.map(session => (
                  <div key={session.id} style={styles.sessionCard}>
                    <div style={styles.sessionRow}>
                      <div style={styles.sessionItem}>
                        <span style={styles.itemLabel}>学習内容</span>
                        <span style={styles.itemValue}>{session.topic}</span>
                      </div>
                      
                      <div style={styles.sessionItem}>
                        <span style={styles.itemLabel}>学習時間</span>
                        <span style={styles.itemValue}>{formatTime(session.duration)}</span>
                      </div>
                      
                      <div style={styles.sessionItem}>
                        <span style={styles.itemLabel}>開始時間</span>
                        <span style={styles.itemValue}>{formatDateTime(session.startTime)}</span>
                      </div>
                      
                      <div style={styles.sessionItem}>
                        <span style={styles.itemLabel}>終了時間</span>
                        <span style={styles.itemValue}>{formatDateTime(session.endTime)}</span>
                      </div>
                      
                      <div style={styles.sessionItem}>
                        <span style={styles.itemLabel}>休憩時間</span>
                        <span style={styles.itemValue}>{session.pausedTime > 0 ? formatTime(session.pausedTime) : "0秒"}</span>
                      </div>
                      
                      <div style={styles.motivationContainer}>
                        <div 
                          style={{
                            ...styles.motivationBadge,
                            backgroundColor: getMotivationColor(session.motivation)
                          }}
                        >
                          モチベーション: {session.motivation}/5
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  calendarSection: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: '10px',
  },
  calendarWrapper: {
    maxWidth: '800px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
  },
  calendarContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '10px 0',
    borderTop: '1px solid #eee',
  },
  legendTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '10px',
  },
  legendItems: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    width: '100%',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
    margin: '5px 0',
    padding: '5px 10px',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  legendColor: {
    width: '15px',
    height: '15px',
    borderRadius: '3px',
  },
  sessionsContainer: {
    width: '100%',
  },
  dateHeading: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    padding: '0 0 15px 0',
    borderBottom: '2px solid #eee',
    textAlign: 'center',
  },
  noSessions: {
    textAlign: 'center',
    padding: '50px 0',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px dashed #ddd',
  },
  noSessionsSubtext: {
    fontSize: '14px',
    color: '#888',
    marginTop: '10px',
  },
  sessionsSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: '30px',
    gap: '20px',
  },
  summaryCard: {
    flex: '1',
    minWidth: '300px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  summaryHeader: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    padding: '0 0 10px 0',
    borderBottom: '1px solid #ddd',
  },
  pieChartHeader: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    padding: '0 0 10px 0',
    borderBottom: '1px solid #ddd',
    textAlign: 'center',
  },
  statsSummary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  pieChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  pieChartLegend: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    maxWidth: '100%',
    width: '100%',
    marginTop: '10px',
  },
  legendText: {
    display: 'flex',
    flexDirection: 'column',
  },
  legendTopic: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  legendTime: {
    fontSize: '12px',
    color: '#666',
  },
  sessionsListContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  sessionsListTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    padding: '0 0 10px 0',
    borderBottom: '1px solid #ddd',
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  sessionCard: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  sessionRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '15px',
  },
  sessionItem: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '120px',
    flex: '1',
  },
  itemLabel: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '3px',
  },
  itemValue: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
  },
  motivationContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    minWidth: '150px',
  },
  motivationBadge: {
    display: 'inline-block',
    padding: '6px 10px',
    color: 'white',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  noDataMessage: {
    textAlign: 'center',
    padding: '50px 0',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px dashed #ddd',
  },
};

export default CalendarView; 