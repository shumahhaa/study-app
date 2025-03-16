import React from 'react';
import Layout from '../components/Layout';
import CalendarView from '../components/CalendarView';

const CalendarPage = ({ studyHistory, formatTime }) => {
  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>学習カレンダー</h1>
        <p style={styles.description}>
          カレンダーで学習履歴を確認できます。日付をクリックすると、その日の学習セッションが表示されます。
        </p>
        <CalendarView studyHistory={studyHistory} formatTime={formatTime} />
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
};

export default CalendarPage; 