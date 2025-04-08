import React from "react";
import styles from "./styles";

const DayMotivationChart = ({ dayMotivation, formatTime }) => {
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

  return (
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
  );
};

export default DayMotivationChart; 