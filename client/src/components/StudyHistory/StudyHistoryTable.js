import React from 'react';
import styles from './styles';
import StudySessionRow from './StudySessionRow';
import { getSortIcon } from './utils';

/**
 * 学習履歴テーブルコンポーネント
 */
const StudyHistoryTable = ({ sortedHistory, handleSort, sortField, sortDirection, deleteStudySession, isMobile }) => {
  // スマホサイズでのテーブル表示用のスタイル
  const getMobileTableHeaderStyle = (width) => ({
    ...styles.tableHeader,
    width: width,
    padding: isMobile ? "8px 4px" : "15px",
    fontSize: isMobile ? "13px" : "inherit",
    whiteSpace: isMobile ? "nowrap" : "normal",
    overflow: isMobile ? "hidden" : "visible",
    textOverflow: isMobile ? "ellipsis" : "clip",
    backgroundColor: isMobile ? "#e8f5e9" : "#e8f5e9",
    textAlign: "center"
  });

  return (
    <div style={{
      ...styles.tableContainer,
      overflowX: isMobile ? "hidden" : "auto",
      maxWidth: isMobile ? "100%" : "none",
      margin: "0 auto",
      display: "block"
    }} className="table-container">
      <table style={{
        ...styles.table,
        fontSize: isMobile ? "13px" : "inherit",
        width: isMobile ? "100%" : "100%"
      }} className="study-history-table">
        <thead>
          <tr>
            <th 
              style={getMobileTableHeaderStyle(isMobile ? "30%" : "25%")} 
              onClick={() => handleSort("topic")}
            >
              学習内容 {getSortIcon("topic", sortField, sortDirection)}
            </th>
            <th 
              style={getMobileTableHeaderStyle(isMobile ? "30%" : "20%")} 
              onClick={() => handleSort("duration")}
            >
              学習時間 {getSortIcon("duration", sortField, sortDirection)}
            </th>
            {!isMobile && (
              <th 
                style={getMobileTableHeaderStyle("20%")} 
                onClick={() => handleSort("motivation")}
              >
                モチベーション {getSortIcon("motivation", sortField, sortDirection)}
              </th>
            )}
            <th 
              style={getMobileTableHeaderStyle(isMobile ? "25%" : "25%")} 
              onClick={() => handleSort("startTime")}
            >
              開始時間 {getSortIcon("startTime", sortField, sortDirection)}
            </th>
            <th style={getMobileTableHeaderStyle(isMobile ? "15%" : "10%")}></th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((session) => (
            <StudySessionRow 
              key={session.id}
              session={session}
              deleteStudySession={deleteStudySession}
              isMobile={isMobile}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudyHistoryTable; 