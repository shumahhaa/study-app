import React from 'react';
import styles from './styles';

const NoSessionsMessage = () => {
  return (
    <div style={styles.noSessions}>
      <p>この日の学習記録はありません。</p>
    </div>
  );
};

export default NoSessionsMessage; 