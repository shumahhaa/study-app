import React from 'react';
import styles from './styles';
import { formatDuration, formatDateTime } from './utils';

const StudySummary = ({ 
  recordedStudyTopic, 
  recordedMotivation, 
  studyDuration, 
  pausedTime, 
  studyStartTime
}) => {
  const endTime = studyStartTime ? studyStartTime + (studyDuration * 1000) + pausedTime : null;

  return (
    <div style={styles.summarySection}>
      <table style={styles.summaryTable}>
        <tbody>
          <tr style={styles.tableRow}>
            <td style={styles.tableLabel}>学習内容:</td>
            <td style={styles.tableValue}>{recordedStudyTopic}</td>
          </tr>
          
          <tr style={styles.tableRow}>
            <td style={styles.tableLabel}>モチベーション:</td>
            <td style={styles.tableValue}>
              <span>{recordedMotivation}/5</span>
            </td>
          </tr>
          
          <tr style={styles.tableRow}>
            <td style={styles.tableLabel}>学習時間:</td>
            <td style={styles.tableValue}>{formatDuration(studyDuration)}</td>
          </tr>
          
          <tr style={styles.tableRow}>
            <td style={styles.tableLabel}>休憩時間:</td>
            <td style={styles.tableValue}>{formatDuration(pausedTime / 1000)}</td>
          </tr>
          
          <tr style={styles.tableRow}>
            <td style={styles.tableLabel}>時間:</td>
            <td style={styles.tableValue}>
              <span>{formatDateTime(studyStartTime)}</span>
              <span style={styles.timelineArrow}>→</span>
              <span>{formatDateTime(endTime)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudySummary; 