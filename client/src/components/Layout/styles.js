// Layout コンポーネントのスタイル定義
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  header: {
    padding: "15px 20px",
    borderBottom: "1px solid #eaeaea",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    width: "100%",
    height: "50px",
    transition: "none",
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
    paddingLeft: "20px",
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
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  logoImage: {
    height: "33px",
    marginRight: "10px",
  },
  logoText: {
    fontSize: "27px",
    fontWeight: "700",
    color: "#333",
    letterSpacing: "0.5px"
  },
  logoHighlight: {
    color: "#2196F3"
  },
  nav: {
    display: "flex",
    gap: "15px",
  },
  main: {
    flex: 1,
    padding: "40px",
    backgroundColor: "#f9f9f9",
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