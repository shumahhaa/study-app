// チャット履歴をリセットする関数
const resetChatHistory = (topic) => {
  if (!topic) return;
  
  const chatStorageKey = `aiChat_${topic}`;
  localStorage.removeItem(chatStorageKey);
  console.log(`チャット履歴をリセットしました: ${topic}`);
};

// この関数をActiveStudyPageコンポーネントに渡す
<ActiveStudyPage 
  recordedStudyTopic={studyTopic}
  studyDuration={studyDuration}
  formatTime={formatTime}
  isPaused={isPaused}
  pauseStudy={pauseStudy}
  resumeStudy={resumeStudy}
  stopStudy={stopStudy}
  abandonStudy={abandonStudy}
  recordedMotivation={motivation}
  isStudying={isStudying}
  resetChatHistory={resetChatHistory} // この関数を追加
/> 