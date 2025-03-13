import { useState } from "react";

function App() {
  const [studyTopic, setStudyTopic] = useState("");
  const [isStudying, setIsStudying] = useState(false);

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
        onClick={() => setIsStudying(true)}
        disabled={isStudying || studyTopic.trim() === ""}
      >
        学習開始
      </button>

      {isStudying && <p>「{studyTopic}の学習を開始しました！」</p>}
    </div>
  )
}

export default App;