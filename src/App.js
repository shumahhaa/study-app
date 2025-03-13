import { useState } from "react";

function App() {
  const [studyTopic, setStudyTopic] = useState("");
  return (
    <div>
      <h1>学習管理アプリ</h1>
      <input type="text" value={studyTopic} onChange={(e)=> setStudyTopic(e.target.value)} placeholder="何を学習する？"　/>
    </div>
  )
}

export default App;