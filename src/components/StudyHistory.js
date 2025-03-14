import React from "react";

const StudyHistory = ({ studyHistory, deleteStudySession, formatTime }) => {
  return (
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
              <th style={tableHeaderStyle}>操作</th>
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
                      cursor: "pointer",
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
  );
};

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

export default StudyHistory;
