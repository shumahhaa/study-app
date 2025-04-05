import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, getUserChatLimitInfo, incrementUserChatCount, resetUserChatCount } from '../firebase';
import { useAuth } from './AuthContext';

// チャット制限のコンテキスト
const ChatLimitContext = createContext();

// 制限の設定
const DAILY_CHAT_LIMIT = 100; // 1日の制限回数

// プロバイダーコンポーネント
export const ChatLimitProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [chatCount, setChatCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [lastResetDate, setLastResetDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Firestoreからチャット制限情報を取得する
  useEffect(() => {
    const fetchChatLimitInfo = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const limitInfo = await getUserChatLimitInfo(currentUser.uid);
        
        setChatCount(limitInfo.count || 0);
        
        if (limitInfo.lastReset) {
          const resetTimestamp = limitInfo.lastReset.toDate ? 
            limitInfo.lastReset.toDate() : new Date(limitInfo.lastReset);
          setLastResetDate(resetTimestamp);
          
          // 日付が変わっていれば自動リセット
          checkAndResetIfNewDay(resetTimestamp);
        } else {
          // 初めて使用する場合、今日の日付をセット
          const today = new Date();
          setLastResetDate(today);
        }
        
        // 制限に達しているかチェック
        checkIfLimitReached(limitInfo.count || 0);
      } catch (error) {
        console.error("チャット制限情報の取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatLimitInfo();
  }, [currentUser]);

  // 日付が変わっていれば自動リセット
  const checkAndResetIfNewDay = (resetDate) => {
    const today = new Date();
    const resetDay = new Date(resetDate);
    
    // 日本時間の0時でリセット（UTCで15時）
    if (today.getDate() !== resetDay.getDate() || 
        today.getMonth() !== resetDay.getMonth() || 
        today.getFullYear() !== resetDay.getFullYear()) {
      resetChatCount();
    }
  };

  // チャットカウントを増やす
  const incrementChatCount = async () => {
    if (!currentUser) return false;
    if (isLimitReached) return false;
    
    try {
      const updatedLimit = await incrementUserChatCount(currentUser.uid);
      setChatCount(updatedLimit.count);
      
      // 制限に達しているかチェック
      const reached = checkIfLimitReached(updatedLimit.count);
      return !reached; // 制限に達していなければtrue、達していればfalse
    } catch (error) {
      console.error("チャットカウント増加エラー:", error);
      return false;
    }
  };
  
  // チャットカウントをリセット
  const resetChatCount = async () => {
    if (!currentUser) return;
    
    try {
      const resetData = await resetUserChatCount(currentUser.uid);
      setChatCount(0);
      setIsLimitReached(false);
      setLastResetDate(resetData.lastReset);
    } catch (error) {
      console.error("チャットカウントリセットエラー:", error);
    }
  };
  
  // 制限に達しているかチェック
  const checkIfLimitReached = (count) => {
    const reached = count >= DAILY_CHAT_LIMIT;
    setIsLimitReached(reached);
    return reached;
  };
  
  // 残りの使用回数を計算
  const getRemainingChats = () => {
    return DAILY_CHAT_LIMIT - chatCount;
  };

  // 次回リセット時刻を取得（日本時間の0時）
  const getNextResetTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  // 提供する値
  const value = {
    chatCount,
    isLimitReached,
    lastResetDate,
    nextResetTime: getNextResetTime(),
    incrementChatCount,
    resetChatCount,
    dailyLimit: DAILY_CHAT_LIMIT,
    remainingChats: getRemainingChats(),
    isLoading
  };

  return (
    <ChatLimitContext.Provider value={value}>
      {children}
    </ChatLimitContext.Provider>
  );
};

// カスタムフック
export const useChatLimit = () => {
  return useContext(ChatLimitContext);
}; 