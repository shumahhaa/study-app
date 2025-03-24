import React, { useState, useEffect } from 'react';

const PieChart = ({ data, colors, formatTime, legendColumns = 4 }) => {
  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // 0より大きい値を持つデータのみをフィルタリング
    const validData = data.filter(item => item.value > 0);
    
    // 有効なデータがある場合のみパーセンテージを計算
    if (validData.length > 0) {
      const total = validData.reduce((sum, item) => sum + item.value, 0);
      const newPercentages = data.map(item => item.value > 0 ? Math.round((item.value / total) * 100) : 0);
      setPercentages(newPercentages);
    } else {
      setPercentages(data.map(() => 0));
    }
  }, [data]);

  if (!data || data.length === 0) {
    return <div>データがありません</div>;
  }

  // 0より大きい値を持つデータのみをフィルタリング
  const validData = data.filter((item, index) => item.value > 0);
  
  // 有効なデータがない場合
  if (validData.length === 0) {
    return <div>有効なデータがありません</div>;
  }

  const renderPieChart = () => {
    const size = 200;
    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;
    
    // 単一要素（100%）の場合の特別処理
    if (validData.length === 1) {
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={radius} 
            fill={colors[data.indexOf(validData[0]) % colors.length]} 
            stroke="#fff"
            strokeWidth="1"
          />
          <text
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
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontWeight="bold"
            fontSize="14"
          >
            {validData[0].label}
          </text>
        </svg>
      );
    }
    
    let startAngle = 0;
    const paths = [];
    
    // 値が0より大きいデータのみを描画
    validData.forEach((item) => {
      const index = data.indexOf(item);
      const percentage = percentages[index];
      const angle = (percentage / 100) * 360;
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
          fill={colors[index % colors.length]}
          stroke="#fff"
          strokeWidth="1"
        />
      );
      
      // ラベルの位置を計算（スライスの中央）
      if (percentage >= 5) { // 5%以上のスライスにのみラベルを表示
        const midAngle = startAngle + (angle / 2);
        const midRad = (midAngle - 90) * (Math.PI / 180);
        
        // ラベルを円の中心から少し離す
        const labelRadius = radius * 0.7;
        const labelX = centerX + labelRadius * Math.cos(midRad);
        const labelY = centerY + labelRadius * Math.sin(midRad);
        
        paths.push(
          <text
            key={`label-${index}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontWeight="bold"
            fontSize="12"
          >
            {percentage}%
          </text>
        );
      }
      
      startAngle = endAngle;
    });
    
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={radius} 
          fill="#f5f5f5" 
        />
        {paths}
      </svg>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.chartContainer}>
        {renderPieChart()}
      </div>
      <div style={{
        ...styles.legend,
        gridTemplateColumns: `repeat(${legendColumns}, 1fr)`
      }}>
        {data.map((item, index) => (
          <div 
            key={index} 
            style={styles.legendItem}
          >
            <div 
              style={{
                ...styles.legendColor,
                backgroundColor: item.value > 0 ? colors[index % colors.length] : "#ddd"
              }}
            ></div>
            <div style={styles.legendText}>
              <span style={styles.legendLabel}>{item.label}</span>
              <span style={styles.legendValue}>
                {formatTime ? formatTime(item.value) : `${item.value}秒`}
                {percentages[index] ? ` (${percentages[index]}%)` : ' (0%)'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  chartContainer: {
    position: 'relative',
  },
  legend: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
    marginTop: '20px',
    width: '100%',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '14px',
  },
  legendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    marginRight: '8px',
    marginTop: '3px',
  },
  legendText: {
    display: 'flex',
    flexDirection: 'column',
  },
  legendLabel: {
    fontWeight: '500',
    color: '#333',
    marginBottom: '2px',
  },
  legendValue: {
    fontSize: '12px',
    color: '#666',
  },
};

export default PieChart; 