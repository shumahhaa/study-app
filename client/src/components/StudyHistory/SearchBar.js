import React from 'react';
import styles from './styles';

/**
 * 検索バーコンポーネント
 */
const SearchBar = ({ filter, setFilter, advancedSearchOpen, setAdvancedSearchOpen, isMobile }) => {
  return (
    <div style={{
      ...styles.filterContainer,
      width: isMobile ? "100%" : "auto",
      justifyContent: isMobile ? "center" : "flex-start"
    }}>
      <input
        type="text"
        placeholder="学習内容で検索..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="search-input"
        style={{
          ...styles.searchInput,
          width: isMobile ? "60%" : "250px"
        }}
      />
      <button 
        onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
        className={`advanced-search-button ${advancedSearchOpen ? 'active' : ''}`}
        style={styles.advancedSearchButton}
      >
        {advancedSearchOpen ? '基本検索に戻る' : '高度な検索'}
      </button>
    </div>
  );
};

export default SearchBar; 