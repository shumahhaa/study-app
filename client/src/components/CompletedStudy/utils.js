// 学習完了ページ用のユーティリティ関数

// モチベーションに応じた色を取得する関数
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

// 学習時間のフォーマット関数
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

// 日時をフォーマット（完全表示）する関数
export const formatDateTime = (timestamp) => {
  if (!timestamp) return "不明";
  
  const date = new Date(timestamp);
  
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