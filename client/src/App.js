import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { saveStudySession } from "./utils/api";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import ActiveStudyPage from "./pages/ActiveStudyPage";
import CompletedStudyPage from "./pages/CompletedStudyPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CalendarPage from "./pages/CalendarPage";
import ReviewQuizzesPage from "./pages/ReviewQuizzesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// 認証が必要なルートを保護するためのコンポーネント
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
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
    // 新しい学習セッション開始時に前回のチャット履歴をクリア
    if (recordedStudyTopic) {
      const previousChatKey = `aiChat_${recordedStudyTopic}`;
      sessionStorage.removeItem(previousChatKey);
    }
    
    // 新しいトピックのチャット履歴も念のためクリア
    const newChatKey = `aiChat_${studyTopic}`;
    sessionStorage.removeItem(newChatKey);
    
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

  useEffect(() => {
    // const unsubscribe = onSnapshot(collection(db, "studySessions"), (snapshot) => {
    //   const historyData = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   historyData.sort((a, b) => b.timestamp - a.timestamp);
    //   setStudyHistory(historyData);
    // });
    // return () => unsubscribe();
  }, []);

  const deleteStudySession = async (id) => {
    // if (window.confirm("この学習履歴を削除しますか？")) {
    //   await deleteDoc(doc(db, "studySessions", id));
    // }
  };

  const formatTime = (seconds) => {
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

  const getStatus = () => {
    if (isStudying && isPaused) return { text: "一時停止中", color: "orange" };
    if (isStudying) return { text: "学習中", color: "green" };
    return { text: "未開始", color: "gray" };
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
    sessionStorage.removeItem('pageReloaded');
  }, []);

  // チャット履歴をリセットする関数
  const resetChatHistory = (topic) => {
    if (!topic) return; // トピックがない場合は何もしない
    
    const chatStorageKey = `aiChat_${topic}`;
    sessionStorage.removeItem(chatStorageKey);
    console.log(`${topic}のチャット履歴をリセットしました`);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* 認証が必要なルート */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage
                    studyTopic={studyTopic}
                    setStudyTopic={setStudyTopic}
                    motivation={motivation}
                    setMotivation={setMotivation}
                    isStudying={isStudying}
                    isPaused={isPaused}
                    pauseStudy={pauseStudy}
                    resumeStudy={resumeStudy}
                    startStudy={startStudy}
                    stopStudy={stopStudy}
                    abandonStudy={abandonStudy}
                    studyDuration={studyDuration}
                    recordedStudyTopic={recordedStudyTopic}
                    recordedMotivation={recordedMotivation}
                    formatTime={formatTime}
                    getStatus={getStatus}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage isStudying={isStudying} />
                </PrivateRoute>
              }
            />
            <Route
              path="/active"
              element={
                <PrivateRoute>
                  <ActiveStudyPage
                    recordedStudyTopic={recordedStudyTopic}
                    studyDuration={studyDuration}
                    formatTime={formatTime}
                    isPaused={isPaused}
                    pauseStudy={pauseStudy}
                    resumeStudy={resumeStudy}
                    stopStudy={stopStudy}
                    abandonStudy={abandonStudy}
                    recordedMotivation={recordedMotivation}
                    isStudying={isStudying}
                    resetChatHistory={resetChatHistory}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/completed"
              element={
                <PrivateRoute>
                  <CompletedStudyPage
                    recordedStudyTopic={recordedStudyTopic}
                    studyDuration={studyDuration}
                    formatTime={formatTime}
                    recordedMotivation={recordedMotivation}
                    studyStartTime={studyStartTime}
                    pausedTime={pausedTime}
                    resetChatHistory={resetChatHistory}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <HistoryPage
                    studyHistory={studyHistory}
                    formatTime={formatTime}
                    deleteStudySession={deleteStudySession}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <AnalyticsPage
                    studyHistory={studyHistory}
                    formatTime={formatTime}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <CalendarPage
                    studyHistory={studyHistory}
                    formatTime={formatTime}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/review-quizzes"
              element={
                <PrivateRoute>
                  <ReviewQuizzesPage
                    formatTime={formatTime}
                  />
                </PrivateRoute>
              }
            />
            
            {/* 認証が不要なルート */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;