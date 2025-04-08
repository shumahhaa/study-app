import React from 'react';
import styles from './styles';
import StudySessionRow from './StudySessionRow';
import { getSortIcon } from './utils';

/**
 * 学習履歴テーブルコンポーネント
 */
const StudyHistoryTable = ({ sortedHistory, handleSort, sortField, sortDirection, deleteStudySession }) => {
  return (
    <div style={styles.tableContainer} className="table-container">
      <table style={styles.table} className="study-history-table">
        <thead>
          <tr>
            <th 
              style={{...styles.tableHeader, width: "25%"}} 
              onClick={() => handleSort("topic")}
            >
              学習内容 {getSortIcon("topic", sortField, sortDirection)}
            </th>
            <th 
              style={{...styles.tableHeader, width: "20%"}} 
              onClick={() => handleSort("duration")}
            >
              学習時間 {getSortIcon("duration", sortField, sortDirection)}
            </th>
            <th 
              style={{...styles.tableHeader, width: "20%"}} 
              onClick={() => handleSort("motivation")}
            >
              モチベーション {getSortIcon("motivation", sortField, sortDirection)}
            </th>
            <th 
              style={{...styles.tableHeader, width: "25%"}} 
              onClick={() => handleSort("startTime")}
            >
              開始時間 {getSortIcon("startTime", sortField, sortDirection)}
            </th>
            <th style={{...styles.tableHeader, width: "10%"}}></th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((session) => (
            <StudySessionRow 
              key={session.id}
              session={session}
              deleteStudySession={deleteStudySession}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudyHistoryTable; 