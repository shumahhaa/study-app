import React from 'react';
import styles from './styles';

// フィルター操作のコンポーネント
const FilterControls = ({ 
  filterMode, 
  setFilterMode 
}) => {
  return (
    <div style={styles.filterContainer}>
      <button 
        style={filterMode === 'due_today' ? {
          ...styles.filterButton,
          color: '#4CAF50',
          fontWeight: '600',
          borderBottom: '2px solid #4CAF50'
        } : styles.filterButton}
        onClick={() => setFilterMode('due_today')}
        className={`filter-button ${filterMode === 'due_today' ? 'active-filter' : ''}`}
      >
        今日の復習
      </button>
      <button 
        style={filterMode === 'all' ? {
          ...styles.filterButton,
          color: '#4CAF50',
          fontWeight: '600',
          borderBottom: '2px solid #4CAF50'
        } : styles.filterButton}
        onClick={() => setFilterMode('all')}
        className={`filter-button ${filterMode === 'all' ? 'active-filter' : ''}`}
      >
        すべて
      </button>
      <button 
        style={filterMode === 'completed' ? {
          ...styles.filterButton,
          color: '#4CAF50',
          fontWeight: '600',
          borderBottom: '2px solid #4CAF50'
        } : styles.filterButton}
        onClick={() => setFilterMode('completed')}
        className={`filter-button ${filterMode === 'completed' ? 'active-filter' : ''}`}
      >
        復習完了
      </button>
    </div>
  );
};

export default FilterControls; 