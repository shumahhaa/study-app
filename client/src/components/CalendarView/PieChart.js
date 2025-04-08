import React from 'react';
import styles from './styles';
import { pieChartColors } from './utils';

const PieChart = ({ topicDistribution, formatTime }) => {
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

export default PieChart; 