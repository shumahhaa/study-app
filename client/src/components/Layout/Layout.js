import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from './styles';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, isStudying }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // ロゴのリンク先を決定
  const logoLinkPath = isStudying ? "/active" : "/";

  return (
    <div style={styles.container}>
      <Header 
        currentUser={currentUser} 
        pathname={location.pathname} 
        logoLinkPath={logoLinkPath} 
      />
      
      <main style={styles.main}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout; 