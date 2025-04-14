import React, { useState, useEffect } from 'react';
import styles from './styles';
import { formatDateTime } from './utils';

const SessionsList = ({ sessions, formatTime }) => {
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

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div style={styles.sessionsListContainer}>
      <h4 style={styles.sessionsListTitle}>学習セッション詳細</h4>
      <div style={styles.sessionsList}>
        {sessions.map(session => (
          <div key={session.id} style={isMobile ? styles.sessionCardMobile : styles.sessionCard}>
            {isMobile ? (
              // モバイル用レイアウト：2行3項目
              <>
                <div style={styles.sessionRowMobile}>
                  <div style={styles.sessionItemMobile}>
                    <span style={styles.itemLabelMobile}>学習内容</span>
                    <span style={styles.itemValueMobile}>{session.topic}</span>
                  </div>
                  
                  <div style={styles.sessionItemMobile}>
                    <span style={styles.itemLabelMobile}>学習時間</span>
                    <span style={styles.itemValueMobile}>{formatTime(session.duration)}</span>
                  </div>
                  
                  <div style={styles.sessionItemMobile}>
                    <span style={styles.itemLabelMobile}>モチベーション</span>
                    <span style={styles.itemValueMobile}>{session.motivation}/5</span>
                  </div>
                </div>
                
                <div style={styles.sessionRowMobile}>
                  <div style={styles.sessionItemMobile}>
                    <span style={styles.itemLabelMobile}>開始時間</span>
                    <span style={styles.itemValueMobile}>{formatDateTime(session.startTime)}</span>
                  </div>
                  
                  <div style={styles.sessionItemMobile}>
                    <span style={styles.itemLabelMobile}>終了時間</span>
                    <span style={styles.itemValueMobile}>{formatDateTime(session.endTime)}</span>
                  </div>
                  
                  <div style={styles.sessionItemMobile}>
                    <span style={styles.itemLabelMobile}>休憩時間</span>
                    <span style={styles.itemValueMobile}>{session.pausedtime > 0 ? formatTime(session.pausedtime) : "0秒"}</span>
                  </div>
                </div>
              </>
            ) : (
              // デスクトップ用レイアウト：従来のもの
              <>
                <div style={styles.sessionRow}>
                  <div style={styles.sessionItem}>
                    <span style={styles.itemLabel}>学習内容</span>
                    <span style={styles.itemValue}>{session.topic}</span>
                  </div>
                  
                  <div style={styles.sessionItem}>
                    <span style={styles.itemLabel}>学習時間</span>
                    <span style={styles.itemValue}>{formatTime(session.duration)}</span>
                  </div>
                  
                  <div style={styles.sessionItem}>
                    <span style={styles.itemLabel}>モチベーション</span>
                    <span style={styles.itemValue}>{session.motivation}/5</span>
                  </div>
                </div>
                
                <div style={{...styles.sessionRow, marginTop: '10px'}}>
                  <div style={styles.sessionItem}>
                    <span style={styles.itemLabel}>開始時間</span>
                    <span style={styles.itemValue}>{formatDateTime(session.startTime)}</span>
                  </div>
                  
                  <div style={styles.sessionItem}>
                    <span style={styles.itemLabel}>終了時間</span>
                    <span style={styles.itemValue}>{formatDateTime(session.endTime)}</span>
                  </div>
                  
                  <div style={styles.sessionItem}>
                    <span style={styles.itemLabel}>休憩時間</span>
                    <span style={styles.itemValue}>{session.pausedtime > 0 ? formatTime(session.pausedtime) : "0秒"}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionsList; 