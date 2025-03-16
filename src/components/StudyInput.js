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

      <p style={styles.label}>モチベーション</p>
      <div style={styles.motivationContainer}>
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => setMotivation(level)}
            style={{
              ...styles.motivationButton,
              backgroundColor: motivation === level ? "#4CAF50" : "#ddd",
              color: motivation === level ? "white" : "black",
            }}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    maxWidth: "400px",
    margin: "0 auto",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  motivationContainer: {
    display: "flex",
    // justifyContent: "center",
    gap: "10px",
  },
  motivationButton: {
    margin: "5px",
    padding: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default StudyInput;
