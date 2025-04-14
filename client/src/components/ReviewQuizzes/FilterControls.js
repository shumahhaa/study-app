import React from 'react';
import styles from './styles';

// フィルター操作のコンポーネント
const FilterControls = ({ 
  filterMode, 
  setFilterMode 
}) => {
  return (
    <div style={styles.filterContainer} className="filter-controls">
      <button 
        className={`green-nav-link ${filterMode === 'due_today' ? 'green-active-link' : ''}`}
        onClick={() => setFilterMode('due_today')}
      >
        今日の復習
      </button>
      <button 
        className={`green-nav-link ${filterMode === 'all' ? 'green-active-link' : ''}`}
        onClick={() => setFilterMode('all')}
      >
        すべて
      </button>
      <button 
        className={`green-nav-link ${filterMode === 'completed' ? 'green-active-link' : ''}`}
        onClick={() => setFilterMode('completed')}
      >
        復習完了
      </button>
    </div>
  );
};

export default FilterControls; 