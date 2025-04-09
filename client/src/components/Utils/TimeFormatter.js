/**
 * 秒数を読みやすい時間形式に変換する関数
 * @param {number} seconds - 変換する秒数
 * @returns {string} フォーマットされた時間文字列
 */
export const formatTime = (seconds) => {
  if (!seconds) return "0秒";
  
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