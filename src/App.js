import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import ActiveStudyPage from "./pages/ActiveStudyPage";
import CompletedStudyPage from "./pages/CompletedStudyPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdminPage from "./pages/AdminPage";
import CalendarPage from "./pages/CalendarPage";

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
      await addDoc(collection(db, "studySessions"), {
        topic: studyTopic,
        motivation: recordedMotivation,
        duration: totalDuration,
        startTime: studyStartTime,
        endTime: endTime,
        pausedTime: totalPausedTime / 1000,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("エラー:", error);
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
    const unsubscribe = onSnapshot(collection(db, "studySessions"), (snapshot) => {
      const historyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      historyData.sort((a, b) => b.timestamp - a.timestamp);
      setStudyHistory(historyData);
    });
    return () => unsubscribe();
  }, []);

  const deleteStudySession = async (id) => {
    if (window.confirm("この学習履歴を削除しますか？")) {
      await deleteDoc(doc(db, "studySessions", id));
    }
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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
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
          }
        />
        <Route
          path="/active"
          element={
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
            />
          }
        />
        <Route
          path="/completed"
          element={
            <CompletedStudyPage
              recordedStudyTopic={recordedStudyTopic}
              studyDuration={studyDuration}
              formatTime={formatTime}
              recordedMotivation={recordedMotivation}
              studyStartTime={studyStartTime}
              pausedTime={pausedTime}
            />
          }
        />
        <Route
          path="/history"
          element={
            <HistoryPage
              studyHistory={studyHistory}
              deleteStudySession={deleteStudySession}
              formatTime={formatTime}
            />
          }
        />
        <Route
          path="/analytics"
          element={
            <AnalyticsPage
              studyHistory={studyHistory}
              formatTime={formatTime}
            />
          }
        />
        <Route
          path="/admin"
          element={<AdminPage />}
        />
        <Route
          path="/calendar"
          element={
            <CalendarPage
              studyHistory={studyHistory}
              formatTime={formatTime}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;