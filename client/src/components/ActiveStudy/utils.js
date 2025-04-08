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

// 時間フォーマット関数
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