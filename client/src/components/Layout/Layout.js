import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from './styles';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, isStudying }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // ロゴのリンク先を決定
  const logoLinkPath = isStudying ? "/active" : "/";

  // ウィンドウサイズの変更を監視
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // モバイル用のメインスタイル
  const mainStyle = {
    ...styles.main,
    padding: isMobile ? "0px" : "40px"
  };

  return (
    <div style={styles.container} key={location.pathname}>
      <Header 
        currentUser={currentUser} 
        pathname={location.pathname} 
        logoLinkPath={logoLinkPath}
        setScrolled={setScrolled} 
      />
      
      <main style={mainStyle}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout; 