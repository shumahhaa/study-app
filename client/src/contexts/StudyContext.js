import { createContext, useContext, useState, useEffect } from "react";
import { saveStudySession } from "../utils/api";
import { formatTime } from "../components/Utils/TimeFormatter";
import { getStudyStatus } from "../components/Utils/StatusIndicator";
import { resetChatHistory as resetChat, clearSessionChats, resetReloadFlag } from "../components/Utils/SessionStorageManager";

const StudyContext = createContext();

export const useStudy = () => useContext(StudyContext);

export const StudyProvider = ({ children }) => {
  const [studyTopic, setStudyTopic] = useState("");
  const [recordedStudyTopic, setRecordedStudyTopic] = useState(null);
  const [isStudying, setIsStudying] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState(null);
  const [studyDuration, setStudyDuration] = useState(0);
  const [motivation, setMotivation] = useState(3);
  const [recordedMotivation, setRecordedMotivation] = useState(null);
  const [studyHistory, setStudyHistory] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState(null);

  useEffect(() => {
    let interval;
    if (isStudying && !isPaused) {
      interval = setInterval(() => {
        setStudyDuration((Date.now() - studyStartTime - pausedTime) / 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isStudying, isPaused, studyStartTime, pausedTime]);

  const startStudy = () => {
    // 新しい学習セッション開始時にチャット履歴をクリア
    clearSessionChats(recordedStudyTopic, studyTopic);
    
    setStudyStartTime(Date.now());
    setStudyDuration(null);
    setIsStudying(true);
    setRecordedMotivation(motivation);
    setRecordedStudyTopic(studyTopic);
    setPausedTime(0);
    setPauseStartTime(null);
    setIsPaused(false);
  };

  const pauseStudy = () => {
    setIsPaused(true);
    setPauseStartTime(Date.now());
  };

  const resumeStudy = () => {
    if (pauseStartTime) {
      const pausedDuration = Date.now() - pauseStartTime;
      setPausedTime(prev => prev + pausedDuration);
    }
    setIsPaused(false);
    setPauseStartTime(null);
  };

  const stopStudy = async () => {
    if (!studyStartTime) return;
  
    let totalPausedTime = pausedTime;
    if (isPaused) {
      totalPausedTime += Date.now() - pauseStartTime;
    }

    const endTime = Date.now();
    const totalDuration = (endTime - studyStartTime - totalPausedTime) / 1000;
    setStudyDuration(totalDuration);
    setIsStudying(false);
    setIsPaused(false);
    setPauseStartTime(null);

    try {
      // 保存するデータをログに出力
      const sessionData = {
        topic: studyTopic,
        motivation: recordedMotivation,
        duration: totalDuration,
        startTime: studyStartTime,
        endTime: endTime,
        pausedtime: totalPausedTime / 1000,
      };
      console.log('学習セッションを保存します:', sessionData);
      
      const result = await saveStudySession(sessionData);
      console.log('学習セッション保存結果:', result);
    } catch (error) {
      console.error("学習セッション保存エラー:", error);
    }
  };

  const abandonStudy = () => {
    setIsStudying(false);
    setIsPaused(false);
    setPauseStartTime(null);
    setStudyDuration(0);
    setStudyStartTime(null);
    setRecordedStudyTopic(null);
    setRecordedMotivation(null);
  };

  const deleteStudySession = async (id) => {
    // if (window.confirm("この学習履歴を削除しますか？")) {
    //   await deleteDoc(doc(db, "studySessions", id));
    // }
  };

  // リロードや閉じる操作時の警告を設定
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isStudying) {
        // 標準的なメッセージ（ブラウザによって上書きされる場合があります）
        const message = "学習中です。ページを離れると学習データが保存されません。本当に離れますか？";
        e.returnValue = message; // Chrome では必要
        return message; // 他のブラウザ用
      }
    };

    // イベントリスナーを追加
    window.addEventListener('beforeunload', handleBeforeUnload);

    // クリーンアップ関数
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isStudying]);

  // アプリ初期化時にリロードフラグをリセット
  useEffect(() => {
    // アプリが正常に起動した時点でリロードフラグをリセット
    resetReloadFlag();
  }, []);

  const getStatus = () => getStudyStatus(isStudying, isPaused);

  const value = {
    studyTopic,
    setStudyTopic,
    recordedStudyTopic,
    isStudying,
    studyStartTime,
    studyDuration,
    motivation,
    setMotivation,
    recordedMotivation,
    studyHistory,
    isPaused,
    pausedTime,
    pauseStartTime,
    startStudy,
    pauseStudy,
    resumeStudy,
    stopStudy,
    abandonStudy,
    deleteStudySession,
    resetChatHistory: resetChat,
    formatTime,
    getStatus
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
}; 