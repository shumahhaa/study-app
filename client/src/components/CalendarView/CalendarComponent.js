import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './styles';
import CalendarLegend from './CalendarLegend';

const CalendarComponent = ({ selectedDate, handleDateChange, calendarData }) => {
  // 日付のコンテンツをカスタマイズ
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    // calendarDataがない場合は早期リターン
    if (!calendarData) return null;
    
    // 選択された日付をローカルタイムゾーンでYYYY-MM-DD形式に変換
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dateData = calendarData[dateStr];
    
    if (!dateData) return null;
    
    // 学習時間に応じた色の濃さを計算（4段階）
    const maxTime = 3 * 60 * 60; // 3時間を最大値とする（4段階目）
    let intensity;
    
    const totalMinutes = dateData.totalTime / 60; // 分単位に変換
    
    if (totalMinutes <= 60) { // 1時間以下
      intensity = 0.25;
    } else if (totalMinutes <= 120) { // 1-2時間
      intensity = 0.5;
    } else if (totalMinutes <= 180) { // 2-3時間
      intensity = 0.75;
    } else { // 3時間以上
      intensity = 1.0;
    }
    
    const backgroundColor = `rgba(76, 175, 80, ${intensity})`;
    
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
    
    // calendarDataがない場合は早期リターン
    if (!calendarData) return '';
    
    // 選択された日付をローカルタイムゾーンでYYYY-MM-DD形式に変換
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return calendarData[dateStr] ? 'has-study-session' : '';
  };

  // 日付変更ハンドラのラッパー - 同期処理を保証
  const onDateChange = (date) => {
    if (!date) return;
    
    // 同期的に処理
    if (handleDateChange) {
      handleDateChange(date);
    }
  };

  return (
    <div style={styles.calendarWrapper}>
      <div style={styles.calendarContainer}>
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
          tileContent={tileContent}
          tileClassName={tileClassName}
          locale="ja-JP"
          className="custom-calendar"
          showFixedNumberOfWeeks={false}
          showNeighboringMonth={false}
          maxDetail="month"
          tileDisabled={({ activeStartDate, date, view }) => false} // 無効化条件なし（同期処理）
        />
      </div>
      <CalendarLegend />
    </div>
  );
};

export default CalendarComponent; 