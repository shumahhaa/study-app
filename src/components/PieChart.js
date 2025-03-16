import React, { useState } from "react";

const PieChart = ({ data, colors }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) return null;

  // データの合計を計算
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // 円グラフのサイズとセンター位置
  const size = 200;
  const radius = size / 2;
  const center = size / 2;
  
  // 円グラフのスライスを生成
  let startAngle = 0;
  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    // SVGのパスを計算
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ');
    
    // ラベルの位置を計算（スライスの中央）
    const labelRad = (startAngle + angle / 2 - 90) * Math.PI / 180;
    const labelDistance = radius * 0.7; // 中心からの距離
    const labelX = center + labelDistance * Math.cos(labelRad);
    const labelY = center + labelDistance * Math.sin(labelRad);
    
    // スライスの情報を返す
    const slice = {
      path: pathData,
      color: colors[index % colors.length],
      percentage,
      labelX,
      labelY,
      label: item.label,
      value: item.value,
      startAngle,
      endAngle
    };
    
    startAngle = endAngle;
    return slice;
  });

  // アニメーション用のスタイルを追加
  const animatedPath = {
    animation: "fillPath 1s ease-out forwards",
    transformOrigin: "center",
  };

  return (
    <div style={styles.container}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* スライス */}
        {slices.map((slice, index) => (
          <path
            key={`slice-${index}`}
            d={slice.path}
            fill={slice.color}
            stroke="#fff"
            strokeWidth="1"
            style={{
              ...animatedPath,
              animationDelay: `${index * 0.1}s`,
              transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.3s ease",
              opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.7 : 1,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <title>{`${slice.label}: ${slice.percentage.toFixed(1)}%`}</title>
          </path>
        ))}
        
        {/* パーセンテージラベル（5%以上のスライスのみ） */}
        {slices.filter(slice => slice.percentage >= 5).map((slice, index) => (
          <text
            key={`percent-${index}`}
            x={slice.labelX}
            y={slice.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="12"
            fontWeight="bold"
          >
            {Math.round(slice.percentage)}%
          </text>
        ))}
      </svg>
      
      {/* 凡例 */}
      <div style={styles.legend}>
        {slices.map((slice, index) => (
          <div 
            key={`legend-${index}`} 
            style={{
              ...styles.legendItem,
              backgroundColor: hoveredIndex === index ? "#e3f2fd" : "#f5f5f5",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              style={{
                ...styles.legendColor,
                backgroundColor: slice.color
              }}
            ></div>
            <div style={styles.legendText}>
              <div style={styles.legendLabel}>{slice.label}</div>
              <div style={styles.legendValue}>
                {slice.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  legend: {
    marginTop: "20px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    maxWidth: "400px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    padding: "5px 10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    minWidth: "120px",
  },
  legendColor: {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
    marginRight: "8px",
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    color: "#333",
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  legendValue: {
    color: "#666",
    fontSize: "12px",
  },
};

export default PieChart; 