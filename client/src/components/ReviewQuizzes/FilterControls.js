import React from 'react';
import styles from './styles';

// フィルター操作のコンポーネント
const FilterControls = ({ 
  searchTerm, 
  setSearchTerm, 
  filterMode, 
  setFilterMode 
}) => {
  return (
    <div style={styles.controlsContainer}>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="トピックで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      
      <div style={styles.filterContainer}>
        <button 
          style={filterMode === 'due_today' ? {
            ...styles.filterButton,
            backgroundColor: '#2196F3',
            color: 'white',
            border: '1px solid #1976d2',
            fontWeight: '500',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          } : styles.filterButton}
          onClick={() => setFilterMode('due_today')}
          className={`filter-button ${filterMode === 'due_today' ? 'active-filter' : ''}`}
        >
          今日の復習
        </button>
        <button 
          style={filterMode === 'all' ? {
            ...styles.filterButton,
            backgroundColor: '#2196F3',
            color: 'white',
            border: '1px solid #1976d2',
            fontWeight: '500',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          } : styles.filterButton}
          onClick={() => setFilterMode('all')}
          className={`filter-button ${filterMode === 'all' ? 'active-filter' : ''}`}
        >
          すべて
        </button>
        <button 
          style={filterMode === 'completed' ? {
            ...styles.filterButton,
            backgroundColor: '#2196F3',
            color: 'white',
            border: '1px solid #1976d2',
            fontWeight: '500',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          } : styles.filterButton}
          onClick={() => setFilterMode('completed')}
          className={`filter-button ${filterMode === 'completed' ? 'active-filter' : ''}`}
        >
          復習完了
        </button>
      </div>
    </div>
  );
};

export default FilterControls; 