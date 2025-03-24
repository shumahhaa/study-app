import React, { useState, useEffect } from "react";

const StudyHistory = ({ studyHistory, deleteStudySession, formatTime }) => {
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filter, setFilter] = useState("");
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    topic: "",
    minDuration: "",
    maxDuration: "",
    minMotivation: "",
    maxMotivation: "",
    startDate: "",
    endDate: "",
  });
  const [filteredHistory, setFilteredHistory] = useState([]);

  // フィルタリングされたデータを取得
  useEffect(() => {
    let filtered = [...studyHistory];
    
    // 基本検索（トピック）
    if (filter) {
      filtered = filtered.filter(session => 
        session.topic.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    // 高度な検索フィルタリング
    if (advancedSearchOpen) {
      // トピックフィルタ
      if (advancedFilters.topic) {
        filtered = filtered.filter(session => 
          session.topic.toLowerCase().includes(advancedFilters.topic.toLowerCase())
        );
      }
      
      // 学習時間フィルタ（最小）
      if (advancedFilters.minDuration) {
        const minSeconds = parseFloat(advancedFilters.minDuration) * 60;
        filtered = filtered.filter(session => session.duration >= minSeconds);
      }
      
      // 学習時間フィルタ（最大）
      if (advancedFilters.maxDuration) {
        const maxSeconds = parseFloat(advancedFilters.maxDuration) * 60;
        filtered = filtered.filter(session => session.duration <= maxSeconds);
      }
      
      // モチベーションフィルタ（最小）
      if (advancedFilters.minMotivation) {
        filtered = filtered.filter(session => 
          session.motivation >= parseInt(advancedFilters.minMotivation)
        );
      }
      
      // モチベーションフィルタ（最大）
      if (advancedFilters.maxMotivation) {
        filtered = filtered.filter(session => 
          session.motivation <= parseInt(advancedFilters.maxMotivation)
        );
      }
      
      // 日付フィルタ（開始日）
      if (advancedFilters.startDate) {
        const startDate = new Date(advancedFilters.startDate);
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(session => 
          new Date(session.startTime) >= startDate
        );
      }
      
      // 日付フィルタ（終了日）
      if (advancedFilters.endDate) {
        const endDate = new Date(advancedFilters.endDate);
        endDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(session => 
          new Date(session.startTime) <= endDate
        );
      }
    }
    
    setFilteredHistory(filtered);
  }, [studyHistory, filter, advancedFilters, advancedSearchOpen]);

  // ソートされたデータを取得
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === "duration") {
      comparison = a.duration - b.duration;
    } else if (sortField === "motivation") {
      comparison = a.motivation - b.motivation;
    } else if (sortField === "startTime") {
      comparison = a.startTime - b.startTime;
    } else if (sortField === "topic") {
      comparison = a.topic.localeCompare(b.topic);
    } else {
      // デフォルトはtimestamp - バックエンドAPIの形式に対応
      // Firestoreのtimestampオブジェクトとネイティブの日付オブジェクト両方に対応
      const getTimestamp = (obj) => {
        if (!obj || !obj.timestamp) return 0;
        if (typeof obj.timestamp === 'object' && obj.timestamp.toMillis) {
          return obj.timestamp.toMillis();
        }
        // バックエンドから返された通常のJSONオブジェクトの場合
        if (obj.timestamp._seconds) {
          return obj.timestamp._seconds * 1000;
        }
        // ISO文字列または数値タイムスタンプの場合
        return new Date(obj.timestamp).getTime();
      };
      
      comparison = getTimestamp(b) - getTimestamp(a);
    }
    
    return sortDirection === "asc" ? -comparison : comparison;
  });

  // ソートアイコンを表示
  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // ソート機能
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // 高度な検索フィルタの変更ハンドラ
  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 検索条件をリセット
  const resetFilters = () => {
    setFilter("");
    setAdvancedFilters({
      topic: "",
      minDuration: "",
      maxDuration: "",
      minMotivation: "",
      maxMotivation: "",
      startDate: "",
      endDate: "",
    });
  };

  // 日時をフォーマット（完全表示）
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "不明";
    
    const date = new Date(timestamp);
    
    // 曜日の配列
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdays[date.getDay()];
    
    // 年月日
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 時刻
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}年${month}月${day}日(${weekday}) ${hour}:${minute}`;
  };

  // 学習時間のフォーマット
  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${Math.floor(seconds)}秒`;
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    let result = "";
    if (hours > 0) {
      result += `${hours}時間`;
    }
    if (minutes > 0 || hours > 0) {
      result += `${minutes}分`;
    }
    if (remainingSeconds > 0 && hours === 0) {
      result += `${remainingSeconds}秒`;
    }
    
    return result;
  };

  // モチベーションに応じた色を取得
  const getMotivationColor = (level) => {
    const colors = {
      1: "#ff6b6b",
      2: "#ffa06b",
      3: "#ffd06b",
      4: "#9be36b",
      5: "#4CAF50"
    };
    return colors[level] || "#ddd";
  };

  // グローバルスタイルを追加
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .study-history-table tr:hover {
        background-color: #f5f5f5;
      }
      
      .delete-button:hover {
        background-color: #f44336 !important;
        color: white !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(244, 67, 54, 0.2);
      }
      
      @media (max-width: 768px) {
        .table-container {
          margin: 0 -15px;
          width: calc(100% + 30px);
          border-radius: 0;
        }
        
        .study-history-table {
          font-size: 14px;
        }
        
        .study-history-table th,
        .study-history-table td {
          padding: 10px 8px;
        }
        
        .delete-text {
          display: none;
        }
        
        .delete-button {
          padding: 5px !important;
          min-width: 30px !important;
          width: 30px;
          height: 30px;
        }
        
        .advanced-search-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>学習履歴</h2>
        <div style={styles.filterContainer}>
          <input
            type="text"
            placeholder="学習内容で検索..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
            className={`advanced-search-button ${advancedSearchOpen ? 'active' : ''}`}
          >
            {advancedSearchOpen ? '基本検索に戻る' : '高度な検索'}
          </button>
        </div>
      </div>

      {advancedSearchOpen && (
        <div style={styles.advancedSearchContainer}>
          <div style={styles.advancedSearchHeader}>
            <h3 style={styles.advancedSearchTitle}>高度な検索</h3>
            <button 
              onClick={resetFilters}
              className="reset-button"
            >
              リセット
            </button>
          </div>
          
          <div style={styles.advancedSearchGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>学習内容</label>
              <input
                type="text"
                placeholder="キーワードを入力"
                value={advancedFilters.topic}
                onChange={(e) => handleAdvancedFilterChange('topic', e.target.value)}
                style={styles.filterInput}
              />
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>学習時間（分）</label>
              <div style={styles.rangeInputs}>
                <input
                  type="number"
                  placeholder="最小"
                  value={advancedFilters.minDuration}
                  onChange={(e) => handleAdvancedFilterChange('minDuration', e.target.value)}
                  style={styles.rangeInput}
                  min="0"
                />
                <span style={styles.rangeSeparator}>〜</span>
                <input
                  type="number"
                  placeholder="最大"
                  value={advancedFilters.maxDuration}
                  onChange={(e) => handleAdvancedFilterChange('maxDuration', e.target.value)}
                  style={styles.rangeInput}
                  min="0"
                />
              </div>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>モチベーション</label>
              <div style={styles.rangeInputs}>
                <select
                  value={advancedFilters.minMotivation}
                  onChange={(e) => handleAdvancedFilterChange('minMotivation', e.target.value)}
                  style={styles.rangeInput}
                >
                  <option value="">最小</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <span style={styles.rangeSeparator}>〜</span>
                <select
                  value={advancedFilters.maxMotivation}
                  onChange={(e) => handleAdvancedFilterChange('maxMotivation', e.target.value)}
                  style={styles.rangeInput}
                >
                  <option value="">最大</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>期間</label>
              <div style={styles.rangeInputs}>
                <input
                  type="date"
                  value={advancedFilters.startDate}
                  onChange={(e) => handleAdvancedFilterChange('startDate', e.target.value)}
                  style={styles.rangeInput}
                />
                <span style={styles.rangeSeparator}>〜</span>
                <input
                  type="date"
                  value={advancedFilters.endDate}
                  onChange={(e) => handleAdvancedFilterChange('endDate', e.target.value)}
                  style={styles.rangeInput}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 統計情報 */}
      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>合計学習時間</span>
          <span style={styles.statValue}>
            {formatTime(filteredHistory.reduce((total, session) => total + session.duration, 0))}
          </span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>学習回数</span>
          <span style={styles.statValue}>{filteredHistory.length}回</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>平均モチベーション</span>
          <span style={styles.statValue}>
            {filteredHistory.length > 0 
              ? (filteredHistory.reduce((sum, session) => sum + session.motivation, 0) / filteredHistory.length).toFixed(1)
              : "-"
            }/5
          </span>
        </div>
      </div>

      {/* 検索結果 */}
      {filteredHistory.length === 0 ? (
        <div style={styles.emptyState}>
          <p>条件に一致する学習履歴はありません。</p>
          {(filter || Object.values(advancedFilters).some(v => v)) && (
            <button 
              onClick={resetFilters}
              className="reset-filters-button"
            >
              検索条件をリセット
            </button>
          )}
        </div>
      ) : (
        <div style={styles.tableContainer} className="table-container">
          <table style={styles.table} className="study-history-table">
            <thead>
              <tr>
                <th 
                  style={{...styles.tableHeader, width: "25%"}} 
                  onClick={() => handleSort("topic")}
                >
                  学習内容 {getSortIcon("topic")}
                </th>
                <th 
                  style={{...styles.tableHeader, width: "20%"}} 
                  onClick={() => handleSort("duration")}
                >
                  学習時間 {getSortIcon("duration")}
                </th>
                <th 
                  style={{...styles.tableHeader, width: "20%"}} 
                  onClick={() => handleSort("motivation")}
                >
                  モチベーション {getSortIcon("motivation")}
                </th>
                <th 
                  style={{...styles.tableHeader, width: "25%"}} 
                  onClick={() => handleSort("startTime")}
                >
                  開始時間 {getSortIcon("startTime")}
                </th>
                <th style={{...styles.tableHeader, width: "10%"}}></th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((session) => (
                <tr key={session.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <div style={styles.topicContainer}>
                      <span style={styles.topicText}>{session.topic}</span>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.durationText}>
                      {formatDuration(session.duration)}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.motivationText}>
                      {session.motivation}/5
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    {formatDateTime(session.startTime)}
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      onClick={() => deleteStudySession(session.id)}
                      className="delete-button"
                      title="削除"
                      style={styles.deleteButton}
                    >
                      <span className="delete-icon" style={styles.deleteIcon}>×</span>
                      <span className="delete-text" style={styles.deleteText}>削除</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

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
    color: "#333",
    fontSize: "24px"
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
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
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
    margin: "20px 0",
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
    marginBottom: "20px",
    width: "100%",
    minWidth: "0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderSpacing: "0",
    border: "1px solid #eaeaea",
    tableLayout: "auto",
  },
  tableHeader: {
    padding: "15px",
    textAlign: "left",
    color: "#555",
    fontWeight: "600",
    borderBottom: "2px solid #eaeaea",
    borderRight: "1px solid #eaeaea",
    cursor: "pointer",
    transition: "background-color 0.2s",
    backgroundColor: "#fff",
  },
  tableRow: {
    transition: "all 0.2s",
    height: "60px",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    }
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
    fontWeight: '500',
    fontSize: '15px',
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  durationText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
  },
  motivationText: {
    fontSize: '16px',
    fontWeight: '500',
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
    transition: "all 0.3s ease",
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

export default StudyHistory;