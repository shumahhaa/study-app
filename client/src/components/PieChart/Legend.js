import React from 'react';
import styles from './styles';

/**
 * 円グラフの凡例コンポーネント
 */
const Legend = ({ data, colors, percentages, formatTime, legendColumns }) => {
  return (
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
  );
};

export default Legend; 