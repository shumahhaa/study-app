import React from 'react';

/**
 * 円グラフのSVGを描画するコンポーネント
 */
const ChartSVG = ({ percentages, colors, data }) => {
  const size = 220;
  const radius = size / 2;
  const center = size / 2;
  
  // 円グラフのセグメントを生成
  const generateSegments = () => {
    let segments = [];
    
    // 有効なデータ数をカウント
    const validDataCount = data.filter((item, index) => 
      item && item.value > 0 && percentages[index] > 0
    ).length;
    
    // 単一アイテムで100%の場合は完全な円を描画
    if (validDataCount === 1) {
      const index = data.findIndex(item => item && item.value > 0);
      if (index !== -1) {
        // 完全な円を描画
        segments.push(
          <circle
            key="full-circle"
            cx={center}
            cy={center}
            r={radius}
            fill={colors[index % colors.length]}
            stroke="#fff"
            strokeWidth="1"
          />
        );
        
        // 中央にパーセンテージラベルを表示
        segments.push(
          <text
            key="center-label"
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontWeight="bold"
            fontSize="16"
          >
            100%
          </text>
        );
        
        return segments;
      }
    }
    
    // 複数アイテムの場合は通常の円グラフを描画
    let currentAngle = 0;
    
    percentages.forEach((percentage, index) => {
      if (!data[index] || data[index].value === 0) return;
      
      // パーセンテージが0の場合はスキップ
      if (percentage <= 0) return;
      
      const angle = (percentage / 100) * 360;
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // 角度をラジアンに変換
      const startAngle = (currentAngle - 90) * (Math.PI / 180);
      const endAngle = (currentAngle + angle - 90) * (Math.PI / 180);
      
      // 座標を計算
      const startX = center + radius * Math.cos(startAngle);
      const startY = center + radius * Math.sin(startAngle);
      const endX = center + radius * Math.cos(endAngle);
      const endY = center + radius * Math.sin(endAngle);
      
      // SVGパスを生成
      const path = [
        `M ${center},${center}`,
        `L ${startX},${startY}`,
        `A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`,
        'Z'
      ].join(' ');
      
      // セグメントを追加
      segments.push(
        <path
          key={index}
          d={path}
          fill={colors[index % colors.length]}
          stroke="#fff"
          strokeWidth="1"
        />
      );
      
      // パーセンテージが5%以上の場合、ラベルを表示
      if (percentage >= 5) {
        const labelAngle = currentAngle + (angle / 2) - 90;
        const labelRadius = radius * 0.65;
        const labelX = center + labelRadius * Math.cos(labelAngle * (Math.PI / 180));
        const labelY = center + labelRadius * Math.sin(labelAngle * (Math.PI / 180));
        
        segments.push(
          <text
            key={`label-${index}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontWeight="bold"
            fontSize="14"
          >
            {percentage}%
          </text>
        );
      }
      
      // 現在の角度を更新
      currentAngle += angle;
    });
    
    return segments;
  };
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ margin: 'auto', display: 'block' }}>
      {generateSegments()}
    </svg>
  );
};

export default ChartSVG; 