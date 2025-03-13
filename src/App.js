import { useState } from "react";

function App() {
  const [studyTopic, setStudyTopic] = useState("");
  const [isStudying, setIsStudying] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState(null);
  const [studyDuration, setStudyDuration] = useState(null);

  const startStudy = () => {
    setStudyStartTime(Date.now());
    setStudyDuration(null);
    setIsStudying(true);
  }

  const stopStudy = () => {
    if (studyStartTime) {
      const duration = (Date.now() - studyStartTime)/1000;
      setStudyDuration(duration);
      setIsStudying(false);
    }
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
        <p>学習時間：{studyDuration}</p>
      )}
    </div>
    );
}

export default App;