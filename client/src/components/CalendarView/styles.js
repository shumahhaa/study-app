// CalendarViewコンポーネントのスタイル定義
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  containerMobile: {
    flexDirection: 'column',
  },
  // カレンダーヘッダーのスタイル
  calendarHeader: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '15px',
    marginBottom: '0',
    borderBottom: '1px solid #eaeaea',
    width: '100%',
  },
  calendarTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'rgb(25, 118, 210)',
    margin: 0,
    textAlign: 'left',
    paddingLeft: '20px',
  },
  calendarDate: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#000000',
    textAlign: 'right',
    paddingRight: '30px',
  },
  calendarSection: {
    display: 'flex',
    justifyContent: 'center',
    width: '50%',
    alignItems: 'flex-start',
    marginTop: '60px',
  },
  calendarSectionMobile: {
    width: '100%',
  },
  calendarWrapper: {
    maxWidth: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
  },
  legendColor: {
    width: '15px',
    height: '15px',
    borderRadius: '3px',
  },
  sessionsContainer: {
    width: '50%',
    marginTop: '60px',
  },
  sessionsContainerMobile: {
    width: '100%',
    marginTop: '20px',
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
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  noSessionsSubtext: {
    fontSize: '14px',
    color: '#888',
    marginTop: '10px',
  },
  sessionsSummary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px',
  },
  summaryCard: {
    width: '100%',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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
    color: '#000000',
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
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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
    gap: '15px',
    maxWidth: '100%',
  },
  pieChartLegend: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    maxWidth: '100%',
    width: '100%',
    marginTop: '10px',
    justifyContent: 'start',
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
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '0 20px 20px 20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  sessionsListTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000000',
    marginTop: '0',
    marginBottom: '20px',
    padding: '10px 0 10px 0',
    borderBottom: '1px solid #ddd',
    textAlign: 'center',
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
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  noDataMessage: {
    textAlign: 'center',
    padding: '50px 0',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px dashed #ddd',
  },
  // 学習概要カードのグリッドレイアウト
  statsCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '15px',
    width: '100%',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
    height: '120px',
  },
  statsCardIcon: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    marginRight: 'auto',
  },
  statsCardContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCardLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  statsCardValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
};

export default styles; 