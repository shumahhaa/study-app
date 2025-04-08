import React from 'react';
import styles from './styles';
import AIChat from '../../components/AIChat';
import MaintenanceMessage from '../../components/MaintenanceMessage';

// 右側のAIチャットパネル
const ChatPanel = ({ recordedStudyTopic, isMaintenanceMode }) => {
  if (!recordedStudyTopic) {
    return (
      <div style={styles.rightPanel}>
        <div style={styles.loadingChat}>学習トピックが設定されていません</div>
      </div>
    );
  }

  return (
    <div style={styles.rightPanel}>
      {isMaintenanceMode ? (
        <MaintenanceMessage 
          customStyles={{
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        />
      ) : (
        <AIChat 
          studyTopic={recordedStudyTopic}
          customStyles={{
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        />
      )}
    </div>
  );
};

export default ChatPanel; 