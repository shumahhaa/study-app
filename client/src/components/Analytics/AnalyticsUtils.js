// AnalyticsPage用のユーティリティ関数

// 日付型に変換するヘルパー関数
export const toDateObject = (dateValue) => {
  if (!dateValue) return new Date();
  
  // すでにDateオブジェクトの場合はそのまま返す
  if (dateValue instanceof Date) return dateValue;
  
  // Firestoreのtimestampオブジェクトの場合
  if (typeof dateValue === 'object' && dateValue.toDate) {
    return dateValue.toDate();
  }
  
  // バックエンドから返された通常のJSONオブジェクトの場合
  if (dateValue._seconds) {
    return new Date(dateValue._seconds * 1000);
  }
  
  // ISO文字列または数値タイムスタンプの場合
  return new Date(dateValue);
}; 