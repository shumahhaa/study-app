import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import StudyInput from "./components/StudyInput";
import StudyControls from "./components/StudyControls";
import StudyHistory from "./components/StudyHistory";

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
  const [pausedTime, setPausedTime] = useState(0); // ← 一時停止時間
  const [pauseStartTime, setPauseStartTime] = useState(null); // ← 一時停止開始時間を記録

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
    setPausedTime(0); // 一時停止時間リセット
    setPauseStartTime(null); // 一時停止時間リセット
    setIsPaused(false);
  };

  const pauseStudy = () => {
    setIsPaused(true);
    setPauseStartTime(Date.now());
  };

  const resumeStudy = () => {
    if (pauseStartTime) {
      const pausedDuration = Date.now() - pauseStartTime; // 一時停止していた時間
      setPausedTime(prev => prev + pausedDuration); // 累積する
    }
    setIsPaused(false);
    setPauseStartTime(null); // リセット
  };

  const stopStudy = async () => {
    if (!studyStartTime) return;
  
    let totalPausedTime = pausedTime;
    if (isPaused) {
      totalPausedTime += Date.now() - pauseStartTime;  // 終了時までの経過時間を追加
    }

    const totalDuration = (Date.now() - studyStartTime - totalPausedTime) / 1000;
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
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("エラー:", error);
    }
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

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;

  const getStatus = () => {
    if (isStudying && isPaused) return { text: "一時停止中", color: "orange" };
    if (isStudying) return { text: "学習中", color: "green" };
    return { text: "未開始", color: "gray" };
  };

  return (
    <div>
      <h1>LearnTime</h1>
      <StudyInput studyTopic={studyTopic} setStudyTopic={setStudyTopic} motivation={motivation} setMotivation={setMotivation} />
      <div style={{ fontSize: "18px", fontWeight: "bold", color: getStatus().color }}>
        状態: {getStatus().text}
      </div>
      <StudyControls {...{ isStudying, isPaused, startStudy, stopStudy, pauseStudy, resumeStudy, studyTopic, studyStartTime, pausedTime, studyDuration, recordedStudyTopic, recordedMotivation, formatTime }} />
      <StudyHistory {...{ studyHistory, deleteStudySession, formatTime }} />
    </div>
  );
}

export default App;
