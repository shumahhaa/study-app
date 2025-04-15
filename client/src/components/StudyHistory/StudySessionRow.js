import React from 'react';
import styles from './styles';
import { formatDateTime, formatDuration, formatDateTimeShort } from './utils';

/**
 * 学習セッション行コンポーネント
 */
const StudySessionRow = ({ session, deleteStudySession, isMobile }) => {
  // スマホサイズでのセル表示用のスタイル
  const getMobileCellStyle = () => ({
    ...styles.tableCell,
    padding: isMobile ? "10px 4px" : "15px 10px",
    fontSize: isMobile ? "12px" : "15px",
    textAlign: "center",
    verticalAlign: "middle"
  });

  // 日付と時間を取得（スマホ表示用に短いフォーマット）
  const { date, time } = formatDateTimeShort(session.startTime);

  return (
    <tr key={session.id} style={{
      ...styles.tableRow,
      height: isMobile ? "60px" : "60px",
      borderBottom: "1px solid #e0e0e0"
    }}>
      <td style={getMobileCellStyle()}>
        <div style={{
          ...styles.topicContainer,
          justifyContent: "center"
        }}>
          <span style={{
            ...styles.topicText,
            fontSize: isMobile ? "12px" : "15px",
            maxWidth: isMobile ? "90%" : "auto",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
            display: "inline-block"
          }}>{session.topic}</span>
        </div>
      </td>
      <td style={getMobileCellStyle()}>
        <div style={{
          ...styles.durationText,
          fontSize: isMobile ? "13px" : "16px",
          fontWeight: "600",
          padding: isMobile ? "0 2px" : "0",
          width: "100%",
          display: "inline-block"
        }}>
          {formatDuration(session.duration)}
        </div>
      </td>
      {!isMobile && (
        <td style={getMobileCellStyle()}>
          <div style={styles.motivationText}>
            {session.motivation}/5
          </div>
        </td>
      )}
      <td style={getMobileCellStyle()}>
        {isMobile ? (
          <div>
            <div style={{ fontSize: "12px" }}>{date}</div>
            <div style={{ fontSize: "11px", color: "#666" }}>{time}</div>
          </div>
        ) : (
          formatDateTime(session.startTime)
        )}
      </td>
      <td style={getMobileCellStyle()}>
        <button
          onClick={() => deleteStudySession(session.id)}
          className="delete-button"
          title="削除"
          style={{
            ...styles.deleteButton,
            minWidth: isMobile ? "28px" : "80px",
            padding: isMobile ? "5px" : "8px 12px",
            height: isMobile ? "28px" : "auto",
            width: isMobile ? "28px" : "auto",
            borderRadius: isMobile ? "50%" : "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
            border: isMobile ? "1px solid #f44336" : "1px solid #f44336"
          }}
        >
          <span className="delete-icon" style={{
            ...styles.deleteIcon,
            fontSize: isMobile ? "14px" : "16px"
          }}>×</span>
          {!isMobile && (
            <span className="delete-text" style={styles.deleteText}>削除</span>
          )}
        </button>
      </td>
    </tr>
  );
};

export default StudySessionRow; 