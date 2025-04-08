import React from 'react';
import styles from './styles';
import WarningIcon from './WarningIcon';
import MessageContent from './MessageContent';
import NoteBox from './NoteBox';

/**
 * メンテナンス中に表示するメッセージコンポーネント
 */
const MaintenanceMessage = ({ customStyles = {} }) => {
  return (
    <div style={{ ...styles.container, ...customStyles }}>
      <div style={styles.content}>
        <WarningIcon />
        <MessageContent />
        <NoteBox />
      </div>
    </div>
  );
};

export default MaintenanceMessage; 