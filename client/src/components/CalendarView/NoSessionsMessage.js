import React from 'react';
import styles from './styles';

const NoSessionsMessage = () => {
  return (
    <div style={styles.noSessions}>
      <p>この日の学習記録はありません。</p>
      <p style={styles.noSessionsSubtext}>別の日を選択するか、新しい学習セッションを記録してください。</p>
    </div>
  );
};

export default NoSessionsMessage; 