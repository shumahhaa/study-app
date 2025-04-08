import React from 'react';
import styles from './styles';
import { formatDateTime, formatDuration } from './utils';

/**
 * 学習セッション行コンポーネント
 */
const StudySessionRow = ({ session, deleteStudySession }) => {
  return (
    <tr key={session.id} style={styles.tableRow}>
      <td style={styles.tableCell}>
        <div style={styles.topicContainer}>
          <span style={styles.topicText}>{session.topic}</span>
        </div>
      </td>
      <td style={styles.tableCell}>
        <div style={styles.durationText}>
          {formatDuration(session.duration)}
        </div>
      </td>
      <td style={styles.tableCell}>
        <div style={styles.motivationText}>
          {session.motivation}/5
        </div>
      </td>
      <td style={styles.tableCell}>
        {formatDateTime(session.startTime)}
      </td>
      <td style={styles.tableCell}>
        <button
          onClick={() => deleteStudySession(session.id)}
          className="delete-button"
          title="削除"
          style={styles.deleteButton}
        >
          <span className="delete-icon" style={styles.deleteIcon}>×</span>
          <span className="delete-text" style={styles.deleteText}>削除</span>
        </button>
      </td>
    </tr>
  );
};

export default StudySessionRow; 