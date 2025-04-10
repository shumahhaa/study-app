import React from 'react';
import styles from './styles';

const CalendarLegend = () => {
  return (
    <div style={styles.legend}>
      <div style={styles.legendTitle}>学習時間の目安</div>
      <div style={styles.legendItems}>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.2)'}}></div>
          <span>〜1時間</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.4)'}}></div>
          <span>1〜2時間</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.6)'}}></div>
          <span>2〜3時間</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.8)'}}></div>
          <span>3〜4時間</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 1.0)'}}></div>
          <span>4時間以上</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarLegend; 