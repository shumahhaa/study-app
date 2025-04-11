import React, { useState, useEffect } from 'react';
import styles from './styles';
import Logo from './Logo';
import Navigation from './Navigation';

const Header = ({ currentUser, pathname, logoLinkPath, setScrolled }) => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  
  // スクロール検出のためのイベントリスナー
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== headerScrolled) {
        setHeaderScrolled(isScrolled);
        // 親コンポーネントにもスクロール状態を伝える
        if (setScrolled) {
          setScrolled(isScrolled);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerScrolled, setScrolled]);

  // スクロール状態に基づいたヘッダーのスタイル
  const headerStyle = {
    ...styles.header,
    boxShadow: headerScrolled 
      ? '0 4px 20px rgba(0,0,0,0.08)' 
      : '0 2px 10px rgba(0,0,0,0.05)',
    backgroundColor: headerScrolled ? 'rgba(255,255,255,0.98)' : '#ffffff',
  };

  const headerContentStyle = {
    ...styles.headerContent,
    height: '100%',
  };

  return (
    <header style={headerStyle}>
      <div style={headerContentStyle}>
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