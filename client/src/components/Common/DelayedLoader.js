import React, { useState, useEffect } from "react";

/**
 * 遅延ローディング表示コンポーネント
 * 
 * 500ms以内に読み込みが完了した場合は何も表示せず、
 * 500ms以上かかる場合にローディングインジケータを表示します。
 * 
 * @param {Object} props
 * @param {boolean} props.loading - ローディング状態
 * @param {React.ReactNode} props.children - ローディング表示
 * @param {number} props.delay - 遅延時間（ミリ秒）
 * @returns {React.ReactNode}
 */
const DelayedLoader = ({ loading, children, delay = 500 }) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeoutId;
    
    if (loading) {
      // ローディング開始時、指定された遅延時間後にローダーを表示
      timeoutId = setTimeout(() => {
        setShowLoader(true);
      }, delay);
    } else {
      // ローディング終了時、ローダー表示フラグをリセット
      setShowLoader(false);
    }

    // クリーンアップ関数
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, delay]);

  // loading=trueでも、遅延時間内であればnullを返す
  if (loading && !showLoader) {
    return null;
  }

  // loading=falseの場合も何も表示しない
  if (!loading) {
    return null;
  }

  // 遅延時間を過ぎてもloadingがtrueの場合、渡された子要素を表示
  return children;
};

export default DelayedLoader; 