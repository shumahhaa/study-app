const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  title: {
    color: "rgb(25, 118, 210)",
    margin: 0,
    fontSize: "28px",
  },
  periodSelector: {
    display: "flex",
    gap: "10px",
  },
  periodButton: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  noDataContainer: {
    textAlign: 'center',
    padding: '40px',
    margin: '20px 0',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  noDataIcon: {
    fontSize: "60px",
    marginBottom: "20px",
    opacity: "0.5",
  },
  noDataTitle: {
    color: "#333",
    fontSize: "24px",
    margin: "0 0 10px 0",
  },
  noDataText: {
    color: "#666",
    fontSize: "16px",
    maxWidth: "400px",
    margin: "0 auto",
  },
  statsCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
  },
  statsIcon: {
    fontSize: "36px",
    marginRight: "15px",
  },
  statsInfo: {
    flex: 1,
  },
  statsTitle: {
    color: "#666",
    fontSize: "14px",
    margin: "0 0 5px 0",
    fontWeight: "500",
  },
  statsValue: {
    color: "#333",
    fontSize: "24px",
    fontWeight: "700",
  },
  chartSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  chartTitle: {
    color: "#333",
    fontSize: "18px",
    margin: "0 0 20px 0",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  chartContent: {
    minHeight: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chartFooter: {
    marginTop: "15px",
    textAlign: "center",
  },
  chartHighlight: {
    color: "#666",
    fontSize: "14px",
  },
  barChart: {
    width: "100%",
    padding: "10px 0",
  },
  barContainer: {
    marginBottom: "15px",
  },
  barLabel: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "5px",
  },
  barWrapper: {
    position: "relative",
    height: "30px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    transition: "width 1s ease-out",
  },
  barValue: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#333",
    fontSize: "14px",
    fontWeight: "500",
  },
  noDataMessage: {
    fontSize: '16px',
    color: '#666',
  },
  insightsSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "30px",
  },
  insightsTitle: {
    color: "#333",
    fontSize: "20px",
    margin: "0 0 20px 0",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  insightsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  insightItem: {
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
  },
  insightIcon: {
    fontSize: "24px",
    marginRight: "15px",
  },
  insightText: {
    color: "#333",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  motivationChart: {
    width: '100%',
    padding: '10px 0',
  },
  motivationBarContainer: {
    marginBottom: '20px',
  },
  motivationTopicContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  motivationTopic: {
    color: '#333',
    fontSize: '15px',
    fontWeight: '500',
  },
  sessionCount: {
    color: '#666',
    fontSize: '13px',
  },
  topicSection: {
    marginTop: "30px"
  },
  
  // ローディングとエラー表示用のスタイル
  loadingContainer: {
    padding: "40px 0",
    textAlign: "center"
  },
  loading: {
    fontSize: "16px",
    color: "#666"
  },
  errorContainer: {
    padding: "40px 0",
    textAlign: "center"
  },
  error: {
    fontSize: "16px",
    color: "#f44336",
    backgroundColor: "#ffebee",
    padding: "15px 20px",
    borderRadius: "8px",
    display: "inline-block"
  }
};

export default styles; 