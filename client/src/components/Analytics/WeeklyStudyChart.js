import React from "react";
import styles from "./styles";

const WeeklyStudyChart = ({ weeklyData, formatTime }) => {
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
  );
};

export default WeeklyStudyChart; 