import React from 'react';

/**
 * メンテナンス中に表示するメッセージコンポーネント
 */
const MaintenanceMessage = ({ customStyles = {} }) => {
  return (
    <div style={{ ...styles.container, ...customStyles }}>
      <div style={styles.content}>
        <div style={styles.iconContainer}>
          <svg style={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 style={styles.title}>メンテナンス中</h2>
        <p style={styles.message}>
          申し訳ありませんが、AIチャット機能は現在メンテナンス中です。<br />
          しばらくしてからもう一度お試しください。
        </p>
        <div style={styles.noteContainer}>
          <p style={styles.note}>
            メンテナンス中も学習の記録は可能です。<br />
            チャット機能以外のサービスは通常通りご利用いただけます。
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    marginBottom: "0",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    textAlign: "center",
    padding: "40px",
    maxWidth: "500px",
  },
  iconContainer: {
    marginBottom: "20px",
  },
  icon: {
    width: "60px",
    height: "60px",
    color: "#f5a623",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
    margin: "0 0 16px 0",
  },
  message: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#555",
    marginBottom: "24px",
  },
  noteContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "10px",
  },
  note: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
    lineHeight: "1.5",
  },
};

export default MaintenanceMessage; 