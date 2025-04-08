import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './styles';
import CalendarLegend from './CalendarLegend';

const CalendarComponent = ({ selectedDate, handleDateChange, calendarData }) => {
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

  return (
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
      <CalendarLegend />
    </div>
  );
};

export default CalendarComponent; 