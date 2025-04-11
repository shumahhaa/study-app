import React, { useState, useEffect } from 'react';
import styles from './styles';
import Logo from './Logo';
import Navigation from './Navigation';

const Header = ({ currentUser, pathname, logoLinkPath }) => {
  const [scrolled, setScrolled] = useState(false);
  
  // スクロール検出のためのイベントリスナー
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // スクロール状態に基づいたヘッダーのスタイル
  const headerStyle = {
    ...styles.header,
    boxShadow: scrolled 
      ? '0 4px 20px rgba(0,0,0,0.08)' 
      : '0 2px 10px rgba(0,0,0,0.05)',
    height: scrolled ? '55px' : '60px',
    backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : '#ffffff',
  };

  return (
    <header style={headerStyle}>
      <div style={styles.headerContent}>
        <Logo 
          logoLinkPath={logoLinkPath} 
          currentUser={currentUser} 
        />
        <Navigation 
          pathname={pathname} 
          currentUser={currentUser} 
        />
      </div>
    </header>
  );
};

export default Header; 