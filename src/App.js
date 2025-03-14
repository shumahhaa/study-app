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

  useEffect(() => {
    let interval;
    if (isStudying) {
      interval = setInterval(() => {
        setStudyDuration((Date.now() - studyStartTime) / 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isStudying, studyStartTime]);

  const startStudy = () => {
    setStudyStartTime(Date.now());
    setStudyDuration(null);
    setIsStudying(true);
    setRecordedMotivation(motivation);
    setRecordedStudyTopic(studyTopic);
  };

  const stopStudy = async () => {
    if (!studyStartTime) return;

    const duration = (Date.now() - studyStartTime) / 1000;
    setStudyDuration(duration);
    setIsStudying(false);

    try {
      await addDoc(collection(db, "studySessions"), {
        topic: studyTopic,
        motivation: recordedMotivation,
        duration: duration,
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

  return (
    <div>
      <h1>LearnTime AI</h1>
      <StudyInput studyTopic={studyTopic} setStudyTopic={setStudyTopic} motivation={motivation} setMotivation={setMotivation} />
      <StudyControls {...{ isStudying, startStudy, stopStudy, studyTopic, studyDuration, recordedStudyTopic, recordedMotivation, formatTime }} />
      <StudyHistory {...{ studyHistory, deleteStudySession, formatTime }} />
    </div>
  );
}

export default App;
