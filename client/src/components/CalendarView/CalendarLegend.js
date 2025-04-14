import React, { useEffect, useState } from 'react';
import styles from './styles';

const CalendarLegend = () => {
  const [isMobile, setIsMobile] = useState(false);

  // モバイル表示の検出
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // 初期チェック
    checkIfMobile();
    
    // リサイズ時にチェック
    window.addEventListener('resize', checkIfMobile);
    
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div style={styles.legend}>
      <div style={styles.legendTitle}>学習時間の目安</div>
      <div style={{
        ...styles.legendItems,
        ...(isMobile && { 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          padding: '0 10px'
        })
      }}>
        <div style={{...styles.legendItem, ...(isMobile && { margin: '3px 0', justifyContent: 'flex-start' })}}>
          <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.25)'}}></div>
          <span>〜1時間</span>
        </div>
        <div style={{...styles.legendItem, ...(isMobile && { margin: '3px 0', justifyContent: 'flex-start' })}}>
          <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.5)'}}></div>
          <span>1〜2時間</span>
        </div>
        <div style={{...styles.legendItem, ...(isMobile && { margin: '3px 0', justifyContent: 'flex-start' })}}>
          <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 0.75)'}}></div>
          <span>2〜3時間</span>
        </div>
        <div style={{...styles.legendItem, ...(isMobile && { margin: '3px 0', justifyContent: 'flex-start' })}}>
          <div style={{...styles.legendColor, backgroundColor: 'rgba(76, 175, 80, 1.0)'}}></div>
          <span>3時間以上</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarLegend; 