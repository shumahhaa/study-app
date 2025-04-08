import React, { useState, useEffect } from "react";
import styles from './styles';
import { getTimeInMilliseconds } from './utils';
import GlobalStyles from './GlobalStyles';
import SearchBar from './SearchBar';
import AdvancedSearch from './AdvancedSearch';
import StatsPanel from './StatsPanel';
import EmptyState from './EmptyState';
import StudyHistoryTable from './StudyHistoryTable';

const StudyHistory = ({ studyHistory, deleteStudySession, formatTime }) => {
  const [sortField, setSortField] = useState("startTime");
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
      comparison = getTimeInMilliseconds(a) - getTimeInMilliseconds(b);
    } else if (sortField === "topic") {
      comparison = a.topic.localeCompare(b.topic);
    } else {
      // デフォルトもstartTimeでソート
      comparison = getTimeInMilliseconds(a) - getTimeInMilliseconds(b);
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

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

  return (
    <div style={styles.container}>
      <GlobalStyles />
      
      <div style={styles.header}>
        <h2 style={styles.title}>学習履歴</h2>
        <SearchBar 
          filter={filter}
          setFilter={setFilter}
          advancedSearchOpen={advancedSearchOpen}
          setAdvancedSearchOpen={setAdvancedSearchOpen}
        />
      </div>

      {advancedSearchOpen && (
        <AdvancedSearch 
          advancedFilters={advancedFilters}
          handleAdvancedFilterChange={handleAdvancedFilterChange}
          resetFilters={resetFilters}
        />
      )}

      <StatsPanel 
        filteredHistory={filteredHistory}
        formatTime={formatTime}
      />

      {filteredHistory.length === 0 ? (
        <EmptyState 
          filter={filter}
          advancedFilters={advancedFilters}
          resetFilters={resetFilters}
        />
      ) : (
        <StudyHistoryTable 
          sortedHistory={sortedHistory}
          handleSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          deleteStudySession={deleteStudySession}
        />
      )}
    </div>
  );
};

export default StudyHistory; 