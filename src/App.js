import { useEffect, useState } from "react";
import { db } from "./firebase"; // firebase.js から Firestore を import
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

function App() {
  const [studyTopic, setStudyTopic] = useState("");
  const [recordedStudyTopic, setRecordedStudyTopic] = useState(null);
  const [isStudying, setIsStudying] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState(null);
  const [studyDuration, setStudyDuration] = useState(0);
  const [motivation, setMotivation] = useState(3);
  const [recordedMotivation, setRecordedMotivation] = useState(null);
  const [studyHistory, setStudyHistory] = useState([]); // 学習履歴
  
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
    setRecordedStudyTopic(studyTopic)
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
          startTime: studyStartTime,
          timestamp: serverTimestamp(),
        });
        console.log("学習終了データを保存しました");
      } catch (error) {
        console.error("エラー:", error);
      }
    };
  
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "studySessions"), (snapshot) => {
        const historyData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // timestamp の降順に並べ替え
        historyData.sort((a, b) => b.timestamp - a.timestamp);
  
        setStudyHistory(historyData);
      });
  
      return () => unsubscribe(); // クリーンアップ処理（コンポーネントがアンマウントされたら監視を解除）
    }, []);

    const deleteStudySession = async (id) => {
      const confirmDelete = window.confirm("この学習履歴を削除しますか？");
      if (confirmDelete) {
        try {
          await deleteDoc(doc(db, "studySessions", id));
          console.log("学習履歴を削除しました");
        } catch (error) {
          console.error("削除エラー:", error);
        }
      }
    };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60)
    const hours = Math.floor(minutes/60);
    const remainingMinutes = Math.floor(minutes%60)
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
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
          <p>学習内容： {recordedStudyTopic}</p>
          <p>最終学習時間: {formatTime(studyDuration)}</p>
          <p>学習開始時のモチベーション： {recordedMotivation}/5</p>
        </div>
      )}

      <div>
        <h2>学習履歴</h2>
        {studyHistory.length === 0 ? (
          <p>学習履歴がありません。</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={tableHeaderStyle}>学習内容</th>
                <th style={tableHeaderStyle}>学習時間</th>
                <th style={tableHeaderStyle}>モチベーション</th>
                <th style={tableHeaderStyle}>開始時間</th>
              </tr>
            </thead>
            <tbody>
              {studyHistory.map((session) => (
                <tr key={session.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={tableCellStyle}>{session.topic}</td>
                  <td style={tableCellStyle}>{formatTime(session.duration)}</td>
                  <td style={tableCellStyle}>{session.motivation}/5</td>
                  <td style={tableCellStyle}>{new Date(session.startTime).toLocaleString()}</td>
                  <td style={tableCellStyle}>
                    <button 
                      onClick={() => deleteStudySession(session.id)} 
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    );
}

// テーブルのスタイル
const tableHeaderStyle = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
  fontWeight: "bold",
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
};

export default App;