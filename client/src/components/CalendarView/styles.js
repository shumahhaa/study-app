// CalendarViewコンポーネントのスタイル定義
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  calendarSection: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: '10px',
  },
  calendarWrapper: {
    maxWidth: '800px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
  },
  calendarContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '10px 0',
    borderTop: '1px solid #eee',
  },
  legendTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '10px',
  },
  legendItems: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    width: '100%',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
    margin: '5px 0',
    padding: '5px 10px',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  legendColor: {
    width: '15px',
    height: '15px',
    borderRadius: '3px',
  },
  sessionsContainer: {
    width: '100%',
  },
  dateHeading: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    padding: '0 0 15px 0',
    borderBottom: '2px solid #eee',
    textAlign: 'center',
  },
  noSessions: {
    textAlign: 'center',
    padding: '50px 0',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px dashed #ddd',
  },
  noSessionsSubtext: {
    fontSize: '14px',
    color: '#888',
    marginTop: '10px',
  },
  sessionsSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: '30px',
    gap: '20px',
  },
  summaryCard: {
    flex: '1',
    minWidth: '300px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  summaryHeader: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    padding: '0 0 10px 0',
    borderBottom: '1px solid #ddd',
  },
  pieChartHeader: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    padding: '0 0 10px 0',
    borderBottom: '1px solid #ddd',
    textAlign: 'center',
  },
  statsSummary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  pieChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  pieChartLegend: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    maxWidth: '100%',
    width: '100%',
    marginTop: '10px',
  },
  legendText: {
    display: 'flex',
    flexDirection: 'column',
  },
  legendTopic: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  legendTime: {
    fontSize: '12px',
    color: '#666',
  },
  sessionsListContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  sessionsListTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    padding: '0 0 10px 0',
    borderBottom: '1px solid #ddd',
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  sessionCard: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  sessionRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '15px',
  },
  sessionItem: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '120px',
    flex: '1',
  },
  itemLabel: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '3px',
  },
  itemValue: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
  },
  motivationContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    minWidth: '150px',
  },
  motivationBadge: {
    display: 'inline-block',
    padding: '6px 10px',
    color: 'white',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  noDataMessage: {
    textAlign: 'center',
    padding: '50px 0',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px dashed #ddd',
  },
};

export default styles; 