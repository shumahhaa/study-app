import React from "react";
import PieChart from "../PieChart";
import styles from "./styles";

const TopicDistributionChart = ({ 
  filteredHistory, 
  topicDistribution, 
  pieChartColors, 
  mostStudiedTopic,
  formatTime 
}) => {
  // トピック分布データを円グラフ用に変換
  const getPieChartData = () => {
    return topicDistribution.map(topic => ({
      label: topic.topic,
      value: topic.time
    }));
  };

  return (
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
  );
};

export default TopicDistributionChart; 