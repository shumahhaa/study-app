import { use, useState } from "react";

function App() {
  const [studyTopic, setStudyTopic] = useState("");
  const [isStudying, setIsStudying] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState(null);
  const [studyDuration, setStudyDuration] = useState(null);
  const [motivation, setMotivation] = useState(3);
  const [recordedMotivation, setRecordedMorivation] = useState(null);
  
  const startStudy = () => {
    setStudyStartTime(Date.now());
    setStudyDuration(null);
    setIsStudying(true);
    setRecordedMorivation(motivation)
  }

  const stopStudy = () => {
    if (studyStartTime) {
      const duration = (Date.now() - studyStartTime)/1000;
      setStudyDuration(duration);
      setIsStudying(false);
    }
  }
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60)
    const hours = Math.floor(minutes/60);
    const remainnigMinutes = Math.floor(minutes%60)
    return `${hours}時 ${remainnigMinutes}分 ${remainingSeconds}秒`;
  }

  return (
    <div>
      <h1>学習管理アプリ</h1>

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
          <button onClick={stopStudy}>学習終了</button>
        </div>
      )}

      {studyDuration !== null && (
        <p>学習時間：{formatTime(studyDuration)}</p>
      )}
      {studyDuration !== null && (
        <p>学習開始時のモチベーション：{recordedMotivation}/5</p>
      )}
    </div>
    );
}

export default App;