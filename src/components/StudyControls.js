import React from "react";

const StudyControls = ({ isStudying, isPaused, pauseStudy, resumeStudy, startStudy, stopStudy, studyTopic, studyDuration, recordedStudyTopic, recordedMotivation, formatTime }) => {
  return (
    <div>
      <button onClick={startStudy} disabled={isStudying || studyTopic.trim() === ""}>
        学習開始
      </button>

      {isStudying && (
        <div>
          <p>「{studyTopic}の学習を開始しました！」</p>
          <p>経過時間: {formatTime(studyDuration)}</p>
          
          {isPaused ? (
            <button onClick={resumeStudy}>▶ 再開</button>
          ) : (
            <button onClick={pauseStudy}>⏸ 一時停止</button>
          )}
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
    </div>
  );
};

export default StudyControls;
