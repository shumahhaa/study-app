const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
  },
  completionCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    padding: "25px",
    width: "100%",
    boxSizing: "border-box",
  },
  completionHeader: {
    textAlign: "center",
    marginBottom: "25px",
  },
  completionIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontWeight: "bold",
  },
  completionTitle: {
    fontSize: "24px",
    color: "#333",
    margin: "0 0 5px 0",
  },
  completionSubtitle: {
    fontSize: "16px",
    color: "#666",
    margin: 0,
  },
  summarySection: {
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "25px",
    overflowX: "auto",
  },
  summaryTable: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
    tableLayout: "fixed",
  },
  tableRow: {
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  tableLabel: {
    padding: "12px 15px",
    fontSize: "14px",
    color: "#666",
    fontWeight: "500",
    width: "140px",
    textAlign: "left",
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius: "8px",
    verticalAlign: "top",
    whiteSpace: "nowrap",
  },
  tableValue: {
    padding: "12px 15px",
    fontSize: "15px",
    color: "#333",
    fontWeight: "700",
    textAlign: "left",
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
    verticalAlign: "top",
    wordBreak: "break-word",
  },
  timelineArrow: {
    margin: "0 10px",
    color: "#2196F3",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  actionsSection: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "25px",  // マージンを追加
  },
  quizButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.2)',
    textDecoration: 'none',
    minWidth: '200px',  // 幅を調整
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  loadingIndicator: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 1s ease-in-out infinite',
    marginRight: '10px',
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    padding: '12px 16px',
    borderRadius: '6px',
    marginTop: '15px',  // マージンを上部に変更
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: '10px',
    fontSize: '18px',
  },
  homeButton: {
    padding: "12px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(33, 150, 243, 0.2)",
    letterSpacing: "0.5px",
    minWidth: '200px',  // 幅を調整
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: "8px",
    fontSize: "16px",
  }
};

// アニメーションを追加する関数
export const addAnimationStyles = () => {
  if (!document.getElementById('completed-study-animations')) {
    const globalStyle = document.createElement('style');
    globalStyle.id = 'completed-study-animations';
    globalStyle.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(globalStyle);
  }
};

export default styles; 