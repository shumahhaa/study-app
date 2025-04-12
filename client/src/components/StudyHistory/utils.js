// StudyHistoryコンポーネントのユーティリティ関数

/**
 * 日時をフォーマット（完全表示）
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return "不明";
  
  let date;
  
  // タイムスタンプの型に応じた変換処理
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'object' && timestamp.toDate) {
    // Firestoreのタイムスタンプオブジェクトの場合
    date = timestamp.toDate();
  } else if (timestamp._seconds !== undefined) {
    // バックエンドから返されたJSONオブジェクトの場合
    date = new Date(timestamp._seconds * 1000);
  } else {
    // ISO文字列または数値タイムスタンプの場合
    date = new Date(timestamp);
  }
  
  // 曜日の配列
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];
  
  // 年月日
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 時刻
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}年${month}月${day}日(${weekday}) ${hour}:${minute}`;
};

/**
 * 学習時間のフォーマット
 */
export const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${Math.floor(seconds)}秒`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  let result = "";
  if (hours > 0) {
    result += `${hours}時間`;
  }
  if (minutes > 0 || hours > 0) {
    result += `${minutes}分`;
  }
  if (remainingSeconds > 0 && hours === 0) {
    result += `${remainingSeconds}秒`;
  }
  
  return result;
};

/**
 * モチベーションに応じた色を取得
 */
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

/**
 * ソートアイコンを表示
 */
export const getSortIcon = (currentField, sortField, sortDirection) => {
  if (currentField !== sortField) return "⇵";
  return sortDirection === "asc" ? "⬆" : "⬇";
};

/**
 * タイムスタンプからミリ秒を取得
 */
export const getTimeInMilliseconds = (obj) => {
  if (!obj || !obj.startTime) return 0;
  
  const timestamp = obj.startTime;
  
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  } else if (typeof timestamp === 'object' && timestamp.toDate) {
    // Firestoreのタイムスタンプオブジェクトの場合
    return timestamp.toDate().getTime();
  } else if (timestamp._seconds !== undefined) {
    // バックエンドから返されたJSONオブジェクトの場合
    return timestamp._seconds * 1000;
  } else {
    // ISO文字列または数値タイムスタンプの場合
    return new Date(timestamp).getTime();
  }
}; 