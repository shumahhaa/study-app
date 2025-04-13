// StudyHistoryコンポーネントのスタイル定義
const styles = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    padding: "20px",
    marginTop: "20px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap"
  },
  title: {
    margin: 0,
    color: "rgb(25, 118, 210)",
    fontSize: "24px",
    paddingLeft: "10px"
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap"
  },
  searchInput: {
    padding: "10px 15px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "250px",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  advancedSearchButton: {
    padding: "10px 15px",
    backgroundColor: "#f5f5f5",
    color: "#333",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  advancedSearchContainer: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  advancedSearchHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },
  advancedSearchTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#333"
  },
  resetButton: {
    padding: "8px 12px",
    backgroundColor: "#f5f5f5",
    color: "#666",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  },
  advancedSearchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "15px",
    marginBottom: "20px"
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  filterLabel: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "500"
  },
  filterInput: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px"
  },
  rangeInputs: {
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },
  rangeInput: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
    flex: 1
  },
  rangeSeparator: {
    color: "#666"
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 0",
    color: "#666",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    margin: "30px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px"
  },
  resetFiltersButton: {
    padding: "8px 15px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  },
  tableContainer: {
    overflowX: "auto",
    marginTop: "10px",
    marginBottom: "20px",
    width: "100%",
    minWidth: "0",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    backgroundColor: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderSpacing: "0",
    border: "1px solid #eaeaea",
    tableLayout: "auto",
    borderRadius: "12px",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "15px",
    textAlign: "left",
    color: "#333",
    fontWeight: "700",
    borderBottom: "2px solid #4CAF50",
    borderRight: "1px solid #eaeaea",
    cursor: "pointer",
    transition: "background-color 0.2s",
    backgroundColor: "#e8f5e9",
  },
  tableRow: {
    transition: "all 0.2s",
    height: "60px",
  },
  tableCell: {
    padding: "15px 10px",
    borderBottom: "1px solid #eaeaea",
    borderRight: "1px solid #eaeaea",
    color: "#333",
    fontSize: "15px",
    verticalAlign: "middle",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  topicContainer: {
    display: "flex",
    alignItems: "center",
    maxWidth: "100%",
    overflow: "hidden",
  },
  topicText: {
    fontWeight: '400',
    fontSize: '15px',
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  durationText: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#333',
  },
  motivationText: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#333',
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    padding: "8px 12px",
    backgroundColor: "transparent",
    color: "#f44336",
    border: "1px solid #f44336",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 2px 4px rgba(244, 67, 54, 0.1)",
    outline: "none",
    minWidth: "80px",
  },
  deleteIcon: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  deleteText: {
    fontSize: "14px",
  },
  statsCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  statsCard: {
    backgroundColor: "white",
    backgroundImage: "none",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsIcon: {
    fontSize: "36px",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  statsInfo: {
    flex: 1,
    textAlign: "center",
  },
  statsTitle: {
    color: "#666",
    fontSize: "14px",
    margin: "5px 0 0 0",
    fontWeight: "500",
  },
  statsValue: {
    color: "#333",
    fontSize: "24px",
    fontWeight: "700",
    textAlign: "center",
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px"
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 20px"
  },
  statLabel: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "5px"
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333"
  }
};

export default styles; 