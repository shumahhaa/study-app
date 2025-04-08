import React from 'react';
import styles from './styles';

/**
 * 検索結果が空の場合のメッセージコンポーネント
 */
const EmptyState = ({ filter, advancedFilters, resetFilters }) => {
  const hasFilters = filter || Object.values(advancedFilters).some(v => v);
  
  return (
    <div style={styles.emptyState}>
      <p>条件に一致する学習履歴はありません。</p>
      {hasFilters && (
        <button 
          onClick={resetFilters}
          className="reset-filters-button"
        >
          検索条件をリセット
        </button>
      )}
    </div>
  );
};

export default EmptyState; 