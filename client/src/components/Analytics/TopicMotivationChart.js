import React from "react";
import styles from "./styles";

const TopicMotivationChart = ({ topicMotivation, formatTime }) => {
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

  return (
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
  );
};

export default TopicMotivationChart; 