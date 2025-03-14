import React from "react";

const StudyInput = ({ studyTopic, setStudyTopic, motivation, setMotivation }) => {
  return (
    <div>
      <input
        type="text"
        value={studyTopic}
        onChange={(e) => setStudyTopic(e.target.value)}
        placeholder="何を学習する？"
      />

      <p>モチベーション</p>
      <div>
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => setMotivation(level)}
            style={{
              margin: "5px",
              padding: "10px",
              backgroundColor: motivation === level ? "green" : "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudyInput;
