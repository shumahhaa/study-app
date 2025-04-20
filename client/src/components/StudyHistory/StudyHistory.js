import React, { useState, useEffect } from "react";
import styles from './styles';
import { getTimeInMilliseconds } from './utils';
import GlobalStyles from './GlobalStyles';
import SearchBar from './SearchBar';
import AdvancedSearch from './AdvancedSearch';
import StatsPanel from './StatsPanel';
import EmptyState from './EmptyState';
import StudyHistoryTable from './StudyHistoryTable';

// 画面サイズを取得するカスタムフック
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const StudyHistory = ({ studyHistory, deleteStudySession, formatTime }) => {
  const { width } = useWindowSize();
  const isMobile = width <= 768;
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
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

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
    setCurrentPage(1); // フィルタが変更されたら1ページ目に戻る
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

  // 現在のページのデータを取得
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedHistory.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedHistory.length / recordsPerPage);

  // ページ変更ハンドラ
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  // ページネーションコンポーネント
  const Pagination = () => {
    return (
      <div style={styles.pagination}>
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...styles.pageButton,
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          前へ
        </button>
        
        <div style={styles.pageInfo}>
          {totalPages > 0 ? `${currentPage} / ${totalPages}` : '0 / 0'}
        </div>
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{
            ...styles.pageButton,
            opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1,
            cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer'
          }}
        >
          次へ
        </button>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <GlobalStyles />
      
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? "column" : "row",
        justifyContent: isMobile ? "center" : "space-between",
        alignItems: "center"
      }}>
        <h2 style={{
          ...styles.title,
          marginBottom: isMobile ? "15px" : 0,
          textAlign: isMobile ? "center" : "left",
          width: isMobile ? "100%" : "auto"
        }}>学習履歴</h2>
        <SearchBar 
          filter={filter}
          setFilter={setFilter}
          advancedSearchOpen={advancedSearchOpen}
          setAdvancedSearchOpen={setAdvancedSearchOpen}
          isMobile={isMobile}
        />
      </div>

      {advancedSearchOpen && (
        <AdvancedSearch 
          advancedFilters={advancedFilters}
          handleAdvancedFilterChange={handleAdvancedFilterChange}
          resetFilters={resetFilters}
          isMobile={isMobile}
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
        <>
          <StudyHistoryTable 
            sortedHistory={currentRecords}
            handleSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            deleteStudySession={deleteStudySession}
            isMobile={isMobile}
          />
          <Pagination />
        </>
      )}
    </div>
  );
};

export default StudyHistory; 