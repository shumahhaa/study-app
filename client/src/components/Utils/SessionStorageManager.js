/**
 * チャット履歴に関連するセッションストレージを管理するユーティリティ
 */

/**
 * 特定のトピックのチャット履歴をリセットする
 * @param {string} topic - リセット対象の学習トピック
 */
export const resetChatHistory = (topic) => {
  if (!topic) return; // トピックがない場合は何もしない
  
  const chatStorageKey = `aiChat_${topic}`;
  sessionStorage.removeItem(chatStorageKey);
  console.log(`${topic}のチャット履歴をリセットしました`);
};

/**
 * 学習セッション開始時に関連するチャット履歴をクリアする
 * @param {string} previousTopic - 前回の学習トピック（あれば）
 * @param {string} newTopic - 新しい学習トピック
 */
export const clearSessionChats = (previousTopic, newTopic) => {
  // 前回のトピックのチャット履歴をクリア
  if (previousTopic) {
    const previousChatKey = `aiChat_${previousTopic}`;
    sessionStorage.removeItem(previousChatKey);
  }
  
  // 新しいトピックのチャット履歴も念のためクリア
  if (newTopic) {
    const newChatKey = `aiChat_${newTopic}`;
    sessionStorage.removeItem(newChatKey);
  }
};

/**
 * リロードフラグをリセットする
 */
export const resetReloadFlag = () => {
  sessionStorage.removeItem('pageReloaded');
}; 