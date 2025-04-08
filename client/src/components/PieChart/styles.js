// PieChartコンポーネントのスタイル定義
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  chartContainer: {
    position: 'relative',
  },
  legend: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
    marginTop: '20px',
    width: '100%',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '14px',
  },
  legendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    marginRight: '8px',
    marginTop: '3px',
  },
  legendText: {
    display: 'flex',
    flexDirection: 'column',
  },
  legendLabel: {
    fontWeight: '500',
    color: '#333',
    marginBottom: '2px',
  },
  legendValue: {
    fontSize: '12px',
    color: '#666',
  },
};

export default styles; 