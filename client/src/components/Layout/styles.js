// Layout コンポーネントのスタイル定義
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
  },
  header: {
    padding: "0 20px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    position: "fixed",
    top: 0,
    zIndex: 100,
    width: "100%",
    height: "60px",
    transition: "box-shadow 0.3s ease, background-color 0.3s ease",
    left: 0,
    right: 0,
    backdropFilter: "blur(5px)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    padding: "0 20px",
    height: "100%",
  },
  logoContainer: {
    paddingLeft: "10px",
  },
  logoLink: {
    textDecoration: "none",
    display: "inline-block",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    padding: "5px",
    borderRadius: "8px",
    transition: "color 0.3s ease",
    cursor: "pointer",
  },
  logoImage: {
    height: "35px",
    marginRight: "12px",
  },
  logoText: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#333",
    letterSpacing: "0.5px",
    background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  logoHighlight: {
    color: "#2196F3"
  },
  nav: {
    display: "flex",
    gap: "18px",
  },
  main: {
    flex: 1,
    padding: "40px",
    backgroundColor: "#f9f9f9",
    width: "100%",
    marginTop: "60px",
  },
  footer: {
    padding: "15px 20px",
    borderTop: "1px solid #eaeaea",
    backgroundColor: "#f5f5f5",
    textAlign: "center"
  },
  footerContent: {
    margin: 0,
    color: "#666",
    fontSize: "14px"
  },
  copyright: {
    margin: 0,
    color: "#666",
    fontSize: "14px"
  }
};

export default styles; 