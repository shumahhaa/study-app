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
 * 特定のトピックのチャット使用回数をリセットする
 * @param {string} topic - リセット対象の学習トピック
 */
export const resetChatUsageCount = (topic) => {
  if (!topic) return; // トピックがない場合は何もしない
  
  const usageCountKey = `aiChatUsage_${topic}`;
  sessionStorage.removeItem(usageCountKey);
  console.log(`${topic}のチャット使用回数をリセットしました`);
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
    
    // 使用回数もリセット
    const previousUsageKey = `aiChatUsage_${previousTopic}`;
    sessionStorage.removeItem(previousUsageKey);
  }
  
  // 新しいトピックのチャット履歴も念のためクリア
  if (newTopic) {
    const newChatKey = `aiChat_${newTopic}`;
    sessionStorage.removeItem(newChatKey);
    
    // 使用回数もリセット
    const newUsageKey = `aiChatUsage_${newTopic}`;
    sessionStorage.removeItem(newUsageKey);
  }
};

/**
 * リロードフラグをリセットする
 */
export const resetReloadFlag = () => {
  sessionStorage.removeItem('isReloading');
}; 