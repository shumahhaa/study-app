import React from "react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children, isStudying }) => {
  const location = useLocation();
  
  // 現在のパスに基づいてアクティブなリンクを判定
  const isActive = (path) => {
    return location.pathname === path;
  };

  // ロゴのリンク先を決定
  const logoLinkPath = isStudying ? "/active" : "/";

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoContainer}>
            <Link to={logoLinkPath} style={styles.logoLink} title={isStudying ? "学習管理画面へ" : "ホームに戻る"}>
              <div className="logo-container" style={styles.logo}>
                <img 
                  src="/logo.png" 
                  alt="LearnTime Logo" 
                  style={styles.logoImage} 
                />
                <span style={styles.logoText}>Learn<span style={styles.logoHighlight}>Time</span></span>
              </div>
            </Link>
          </div>
          
          <nav style={styles.nav}>
            <Link 
              to="/review-quizzes" 
              className={`nav-link ${isActive('/review-quizzes') ? 'active-link' : ''}`}
            >
              復習問題
            </Link>
            <Link 
              to="/analytics" 
              className={`nav-link ${isActive('/analytics') ? 'active-link' : ''}`}
            >
              学習分析
            </Link>
            <Link 
              to="/calendar" 
              className={`nav-link ${isActive('/calendar') ? 'active-link' : ''}`}
            >
              カレンダー
            </Link>
            <Link 
              to="/history" 
              className={`nav-link ${isActive('/history') ? 'active-link' : ''}`}
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
          <p style={styles.copyright}>© 2025 LearnTime. All rights reserved.</p>
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
  navLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 12px",
    color: "#555",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "14px",
    transition: "all 0.2s ease",
    margin: "0 4px",
    minWidth: "80px",
    height: "32px",
    backgroundColor: "#f5f5f5",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #eaeaea",
  },
  activeLink: {
    backgroundColor: "#2196F3",
    color: "white",
    boxShadow: "0 2px 4px rgba(33,150,243,0.2)",
    border: "1px solid #1e88e5",
    fontWeight: "600",
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