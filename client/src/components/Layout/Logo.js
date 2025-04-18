import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles';

const Logo = ({ logoLinkPath, currentUser }) => {
  return (
    <div style={styles.logoContainer}>
      <Link to={currentUser ? logoLinkPath : "/"} style={styles.logoLink} title={logoLinkPath === "/active" ? "学習管理画面へ" : "ホームに戻る"}>
        <div className="logo-container" style={styles.logo}>
          <img 
            src="/LearnTime.png" 
            alt="LearnTime Logo" 
            style={styles.logoImage} 
          />
          <span style={styles.logoText}>Learn<span style={styles.logoHighlight}>Time</span></span>
        </div>
      </Link>
    </div>
  );
};

export default Logo; 