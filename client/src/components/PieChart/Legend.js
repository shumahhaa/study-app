import React, { useEffect, useState } from 'react';
import styles from './styles';

/**
 * 円グラフの凡例コンポーネント
 */
const Legend = ({ data, colors, percentages, formatTime, legendColumns }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // モバイル表示時は2列、それ以外は指定された列数
  const columns = isMobile ? 2 : legendColumns;

  return (
    <div style={{
      ...styles.legend,
      gridTemplateColumns: `repeat(${columns}, 1fr)`
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
  );
};

export default Legend; 