import React, { useState, useEffect } from 'react';

const PieChart = ({ data, colors, formatTime, legendColumns = 4 }) => {
  const [percentages, setPercentages] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!data || data.length === 0) {
      setReady(false);
      return;
    }
    
    // 初期化時にreadyをfalseにリセット
    setReady(false);
    
    // 0より大きい値を持つデータのみをフィルタリング
    const validData = data.filter(item => item.value > 0);
    
    // 有効なデータがある場合のみパーセンテージを計算
    if (validData.length > 0) {
      const total = validData.reduce((sum, item) => sum + item.value, 0);
      
      // データがあるが合計が0の場合（あり得ないが念のため）
      if (total <= 0) {
        setPercentages(data.map(() => 0));
        setReady(true);
        return;
      }
      
      // 各アイテムのパーセンテージを計算（小数点以下2桁まで保持）
      const rawPercentages = data.map(item => item.value > 0 ? (item.value / total) * 100 : 0);
      
      // 整数パーセンテージを計算（切り捨て）
      const intPercentages = rawPercentages.map(p => Math.floor(p));
      
      // パーセンテージの合計を計算
      const totalPercentage = intPercentages.reduce((sum, p) => sum + p, 0);
      
      // 100%に足りない分を、小数部分が大きい順に分配
      const remainder = 100 - totalPercentage;
      
      if (remainder > 0) {
        // 小数部分でソートするためのインデックス付き配列
        const fractionalParts = rawPercentages
          .map((p, i) => ({ index: i, value: p - Math.floor(p) }))
          .filter(item => item.value > 0) // 小数部分がある項目のみ
          .sort((a, b) => b.value - a.value); // 小数部分の大きい順にソート
        
        // 残りのパーセンテージを分配
        const finalPercentages = [...intPercentages];
        for (let i = 0; i < remainder && i < fractionalParts.length; i++) {
          finalPercentages[fractionalParts[i].index]++;
        }
        
        setPercentages(finalPercentages);
      } else {
        setPercentages(intPercentages);
      }
    } else {
      setPercentages(data.map(() => 0));
    }
    
    // パーセント計算が終わったことをマーク
    setReady(true);
  }, [data]);

  if (!data || data.length === 0) {
    return <div>データがありません</div>;
  }

  // 0より大きい値を持つデータのみをフィルタリング
  const validData = data.filter(item => item.value > 0);
  
  // 有効なデータがない場合
  if (validData.length === 0) {
    return <div>有効なデータがありません</div>;
  }
  
  // データの準備ができていない場合
  if (!ready) {
    return <div>グラフデータを準備中...</div>;
  }

  const renderPieChart = () => {
    const size = 200;
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