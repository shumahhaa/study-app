/**
 * 現在の学習状態に基づいてステータスを取得する関数
 * @param {boolean} isStudying - 学習中かどうか
 * @param {boolean} isPaused - 一時停止中かどうか
 * @returns {Object} テキストと色情報を含むステータスオブジェクト
 */
export const getStudyStatus = (isStudying, isPaused) => {
  if (isStudying && isPaused) return { text: "一時停止中", color: "orange" };
  if (isStudying) return { text: "学習中", color: "green" };
  return { text: "未開始", color: "gray" };
}; 