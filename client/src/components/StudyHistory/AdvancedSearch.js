import React from 'react';
import styles from './styles';

/**
 * 高度な検索コンポーネント
 */
const AdvancedSearch = ({ advancedFilters, handleAdvancedFilterChange, resetFilters, isMobile }) => {
  return (
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
      
      <div style={{
        ...styles.advancedSearchGrid,
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))"
      }}>
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
          <div style={{
            ...styles.rangeInputs,
            flexDirection: isMobile ? "row" : "row",
            flexWrap: isMobile ? "nowrap" : "nowrap"
          }}>
            <input
              type="number"
              placeholder="最小"
              value={advancedFilters.minDuration}
              onChange={(e) => handleAdvancedFilterChange('minDuration', e.target.value)}
              style={{
                ...styles.rangeInput,
                width: isMobile ? "45%" : "auto"
              }}
              min="0"
            />
            <span style={styles.rangeSeparator}>〜</span>
            <input
              type="number"
              placeholder="最大"
              value={advancedFilters.maxDuration}
              onChange={(e) => handleAdvancedFilterChange('maxDuration', e.target.value)}
              style={{
                ...styles.rangeInput,
                width: isMobile ? "45%" : "auto"
              }}
              min="0"
            />
          </div>
        </div>
        
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>モチベーション</label>
          <div style={{
            ...styles.rangeInputs,
            flexDirection: isMobile ? "row" : "row",
            flexWrap: isMobile ? "nowrap" : "nowrap"
          }}>
            <select
              value={advancedFilters.minMotivation}
              onChange={(e) => handleAdvancedFilterChange('minMotivation', e.target.value)}
              style={{
                ...styles.rangeInput,
                width: isMobile ? "45%" : "auto"
              }}
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
              style={{
                ...styles.rangeInput,
                width: isMobile ? "45%" : "auto"
              }}
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
          <div style={{
            ...styles.rangeInputs,
            flexDirection: isMobile ? "row" : "row",
            flexWrap: isMobile ? "nowrap" : "nowrap"
          }}>
            <input
              type="date"
              value={advancedFilters.startDate}
              onChange={(e) => handleAdvancedFilterChange('startDate', e.target.value)}
              style={{
                ...styles.rangeInput,
                width: isMobile ? "45%" : "auto"
              }}
            />
            <span style={styles.rangeSeparator}>〜</span>
            <input
              type="date"
              value={advancedFilters.endDate}
              onChange={(e) => handleAdvancedFilterChange('endDate', e.target.value)}
              style={{
                ...styles.rangeInput,
                width: isMobile ? "45%" : "auto"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch; 