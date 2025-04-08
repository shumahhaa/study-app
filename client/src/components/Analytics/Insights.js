import React from "react";
import styles from "./styles";

const Insights = ({ 
  selectedPeriod, 
  totalStudyTime, 
  mostStudiedTopic, 
  topicDistribution, 
  weeklyData, 
  topicMotivation, 
  dayMotivation,
  formatTime 
}) => {
  return (
    <div style={styles.insightsSection}>
      <h2 style={styles.insightsTitle}>学習インサイト</h2>
      <div style={styles.insightsList}>
        {totalStudyTime > 0 && (
          <div style={styles.insightItem}>
            <div style={styles.insightIcon}>📊</div>
            <div style={styles.insightText}>
              {selectedPeriod === "week" ? "直近7日間" : 
               selectedPeriod === "month" ? "直近30日間" : 
               selectedPeriod === "year" ? "直近1年間" : "全期間"}
              の合計学習時間: <strong>{formatTime(totalStudyTime)}</strong>
            </div>
          </div>
        )}
        
        {mostStudiedTopic && (
          <div style={styles.insightItem}>
            <div style={styles.insightIcon}>📚</div>
            <div style={styles.insightText}>
              最も学習した内容: <strong>{mostStudiedTopic}</strong> 
              （全体の <strong>{Math.round((topicDistribution.find(t => t.topic === mostStudiedTopic)?.time || 0) / totalStudyTime * 100)}%</strong>）
            </div>
          </div>
        )}
        
        {weeklyData.length > 0 && weeklyData.some(d => d.totalTime > 0) && (
          <div style={styles.insightItem}>
            <div style={styles.insightIcon}>📅</div>
            <div style={styles.insightText}>
              最も学習時間が長い曜日: <strong>
                {weeklyData.reduce((max, day) => day.totalTime > max.totalTime ? day : max, { totalTime: 0 }).day}曜日
              </strong>
            </div>
          </div>
        )}
        
        {topicMotivation.length > 0 && (
          <div style={styles.insightItem}>
            <div style={styles.insightIcon}>🔍</div>
            <div style={styles.insightText}>
              モチベーションが最も高い学習内容: <strong>{topicMotivation[0]?.topic}</strong>
              （平均 <strong>{topicMotivation[0]?.averageMotivation.toFixed(1)}/5</strong>）
            </div>
          </div>
        )}
        
        {dayMotivation.filter(d => d.sessionCount > 0).length > 0 && (
          <div style={styles.insightItem}>
            <div style={styles.insightIcon}>📆</div>
            <div style={styles.insightText}>
              モチベーションが最も高い曜日: <strong>
                {dayMotivation.filter(d => d.sessionCount > 0)
                  .reduce((max, day) => day.averageMotivation > max.averageMotivation ? day : max, 
                    { averageMotivation: 0 }).day}曜日
              </strong>
              （平均 <strong>
                {dayMotivation.filter(d => d.sessionCount > 0)
                  .reduce((max, day) => day.averageMotivation > max.averageMotivation ? day : max, 
                    { averageMotivation: 0 }).averageMotivation.toFixed(1)}/5
              </strong>）
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights; 