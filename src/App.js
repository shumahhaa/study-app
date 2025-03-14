import { useEffect, useState } from "react";
import { db } from "./firebase"; // firebase.js から Firestore を import
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function App() {
  const [studyTopic, setStudyTopic] = useState("");
  const [isStudying, setIsStudying] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState(null);
  const [studyDuration, setStudyDuration] = useState(0);
  const [motivation, setMotivation] = useState(3);
  const [recordedMotivation, setRecordedMotivation] = useState(null);
  
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
    setRecordedMotivation(motivation)
  };

  const stopStudy = async () => {
    if (!studyStartTime) return;

    const duration = (Date.now() - studyStartTime)/1000;
    setStudyDuration(duration);
    setIsStudying(false);

      // Firestore にデータを保存
      try {
        await addDoc(collection(db, "studySessions"), {
          topic: studyTopic,
          motivation: recordedMotivation,
          duration: duration,
          timestamp: new Date(),
        });
        console.log("学習終了データを保存しました");
      } catch (error) {
        console.error("エラー:", error);
      }
    };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60)
    const hours = Math.floor(minutes/60);
    const remainingMinutes = Math.floor(minutes%60)
    return `${hours}時 ${remainingMinutes}分 ${remainingSeconds}秒`;
  }

  return (
    <div>
      <h1>LearnTime AI</h1>

      <input 
        type="text"
        value={studyTopic}
        onChange={(e)=> setStudyTopic(e.target.value)}
        placeholder="何を学習する？"
      />

      <p>モチベーション</p>
      <div>
        {[1,2,3,4,5].map((level) => (
          <button
            key={level}
            onClick={() => setMotivation(level)}
            style={{
              margin:"5px",
              padding:"10px",
              backgroundColor: motivation === level ? "green" : "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {level}
          </button>
        ))}
      </div>

      <button
        onClick={startStudy}
        disabled={isStudying || studyTopic.trim() === ""}
      >
        学習開始
      </button>

      {isStudying && (
        <div>
          <p>「{studyTopic}の学習を開始しました！」</p>
          <p>経過時間: {formatTime(studyDuration)}</p>
          <button onClick={stopStudy}>学習終了</button>
        </div>
      )}

      {!isStudying && studyDuration > 0 && (
        <div>
          <p>学習内容： {studyTopic}</p>
          <p>最終学習時間: {formatTime(studyDuration)}</p>
          <p>学習開始時のモチベーション： {recordedMotivation}/5</p>
        </div>
      )}
    </div>
    );
}

export default App;