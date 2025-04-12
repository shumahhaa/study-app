// 共通のスタイル定義
const styles = {
  // ローディング表示関連
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 0",
    textAlign: "center"
  },
  loading: {
    fontSize: "16px",
    color: "#666",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  loadingSpinner: {
    display: "inline-block",
    width: "30px",
    height: "30px",
    border: "3px solid rgba(0,0,0,0.1)",
    borderRadius: "50%",
    borderTopColor: "#666",
    animation: "spin 1s ease-in-out infinite",
    marginBottom: "10px"
  },
  
  // エラー表示関連
  errorContainer: {
    padding: "40px 0",
    textAlign: "center"
  },
  error: {
    fontSize: "16px",
    color: "#f44336",
    backgroundColor: "#ffebee",
    padding: "15px 20px",
    borderRadius: "8px",
    display: "inline-block"
  }
};

// グローバルCSS（必要な場合）
export const injectGlobalStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  
  document.head.appendChild(style);
  
  // クリーンアップ関数を返す
  return () => {
    document.head.removeChild(style);
  };
};

export default styles; 