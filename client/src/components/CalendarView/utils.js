// 日付処理と補助関数

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
  if (dateValue && typeof dateValue === 'object' && dateValue._seconds !== undefined) {
    return new Date(dateValue._seconds * 1000);
  }
  
  // ISO文字列の場合
  try {
    return new Date(dateValue);
  } catch (e) {
    console.error("日付変換エラー:", e, dateValue);
    return new Date(); // エラーの場合は現在の日付を返す
  }
};

// 日付をフォーマット
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];
  
  return `${year}年${month}月${day}日(${weekday})`;
};

// 日時をフォーマット
export const formatDateTime = (timestamp) => {
  if (!timestamp) return "不明";
  
  try {
    const date = toDateObject(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (e) {
    console.error("日時フォーマットエラー:", e, timestamp);
    return "不明";
  }
};

// モチベーションに応じた色を取得
export const getMotivationColor = (level) => {
  const colors = {
    1: "#ff6b6b",
    2: "#ffa06b",
    3: "#ffd06b",
    4: "#9be36b",
    5: "#4CAF50"
  };
  return colors[level] || "#ddd";
};

// 円グラフの色
export const pieChartColors = [
  "#2196F3", "#4CAF50", "#FFC107", "#FF5722", "#9C27B0", 
  "#3F51B5", "#009688", "#FFEB3B", "#FF9800", "#E91E63",
  "#607D8B", "#795548", "#8BC34A", "#00BCD4", "#673AB7"
]; 