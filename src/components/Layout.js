import React from "react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  
  // 現在のパスに基づいてアクティブなリンクを判定
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={styles.logoLink} title="ホームに戻る">
            <div style={styles.logo}>
              <span style={styles.logoIcon}>⏱️</span>
              <span style={styles.logoText}>Learn<span style={styles.logoHighlight}>Time</span></span>
            </div>
          </Link>
          
          <nav style={styles.nav}>
            <Link 
              to="/analytics" 
              style={{
                ...styles.navLink,
                ...(isActive('/analytics') ? styles.activeLink : {})
              }}
            >
              分析
            </Link>
            <Link 
              to="/calendar" 
              style={{
                ...styles.navLink,
                ...(isActive('/calendar') ? styles.activeLink : {})
              }}
            >
              カレンダー
            </Link>
            <Link 
              to="/history" 
              style={{
                ...styles.navLink,
                ...(isActive('/history') ? styles.activeLink : {})
              }}
            >
              学習履歴
            </Link>
          </nav>
        </div>
      </header>
      <main style={styles.main}>
        {children}
      </main>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.copyright}>© 2023 LearnTime. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

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
    zIndex: 100
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
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
  logoIcon: {
    fontSize: "28px",
    marginRight: "8px"
  },
  logoText: {
    fontSize: "28px",
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
  navLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 8px",
    backgroundColor: "#2196F3",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "500",
    transition: "background-color 0.3s, transform 0.2s",
    minWidth: "100px",
    height: "40px",
    textAlign: "center",
    ":hover": {
      backgroundColor: "#1976D2",
      transform: "translateY(-2px)"
    }
  },
  activeLink: {
    backgroundColor: "#1976D2",
    transform: "translateY(-2px)"
  },
  main: {
    flex: 1,
    padding: "20px",
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

export default Layout; 