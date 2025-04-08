import React from 'react';
import styles from './styles';

/**
 * 検索バーコンポーネント
 */
const SearchBar = ({ filter, setFilter, advancedSearchOpen, setAdvancedSearchOpen }) => {
  return (
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
  );
};

export default SearchBar; 