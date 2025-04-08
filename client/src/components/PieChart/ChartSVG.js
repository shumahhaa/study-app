import React from 'react';

/**
 * 円グラフのSVG部分を描画するコンポーネント
 */
const ChartSVG = ({ percentages, colors, data, size = 200 }) => {
  // 0より大きい値を持つデータのみをフィルタリング
  const validData = data.filter(item => item.value > 0);
  
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  // percentagesが空または不十分な場合のチェック
  if (!percentages || percentages.length === 0 || percentages.every(p => p === undefined)) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={centerX} cy={centerY} r={radius} fill="#f5f5f5" />
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#666"
          fontSize="14"
        >
          データ準備中...
        </text>
      </svg>
    );
  }
  
  // 単一要素（100%）の場合の特別処理
  if (validData.length === 1) {
    // 安全のためにインデックスを確認
    const index = data.indexOf(validData[0]);
    if (index === -1) {
      console.error('Valid data item not found in original data array');
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={centerX} cy={centerY} r={radius} fill="#ccc" />
          <text x={centerX} y={centerY} textAnchor="middle" fill="#666">エラー</text>
        </svg>
      );
    }

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={radius} 
          fill={colors[index % colors.length]} 
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
    // 開始角度がNaNの場合は0にリセット
    if (isNaN(startAngle)) {
      console.warn('startAngle was NaN, resetting to 0');
      startAngle = 0;
    }
    
    const index = data.indexOf(item);
    
    // パーセンテージが未定義の場合はスキップ
    if (percentages[index] === undefined) {
      console.warn('Percentage undefined for item', item);
      return; // この項目をスキップ
    }
    
    const percentage = percentages[index];
    
    // 角度計算
    const angle = (percentage / 100) * 360;
    
    // NaNチェック - 角度が無効な場合はスキップ
    if (isNaN(angle)) {
      console.warn('Invalid angle calculated', { item, percentage });
      return; // この項目をスキップ
    }
    
    const endAngle = startAngle + angle;
    
    // 円弧のパスを計算
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // NaN値のチェック
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
      console.warn('Invalid values detected in pie chart calculation', { item, percentage, angle, startAngle, endAngle });
      startAngle = endAngle;
      return; // この区分をスキップ
    }
    
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
      
      // NaN値のチェック
      if (isNaN(labelX) || isNaN(labelY)) {
        console.warn('Invalid label position detected', { midAngle, midRad, percentage });
      } else {
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

export default ChartSVG; 