import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import Logo from './Logo';
import Navigation from './Navigation';

const Header = ({ currentUser, pathname, logoLinkPath, setScrolled }) => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  
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

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [headerScrolled, setScrolled]);

  // メニュー外クリックを検出するイベントリスナー
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) && 
          hamburgerRef.current && 
          !hamburgerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    // タッチイベントとマウスクリックイベントを監視
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

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
    position: 'relative',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const hamburgerStyle = {
    display: isMobile ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '30px',
    height: '20px',
    cursor: 'pointer',
    zIndex: 1000,
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
  };

  const hamburgerLineStyle = {
    width: '100%',
    height: '3px',
    backgroundColor: '#333',
    transition: 'all 0.3s ease',
  };

  // ハンバーガーメニューがオープン状態の場合のスタイル
  const line1Style = menuOpen ? {
    ...hamburgerLineStyle,
    transform: 'rotate(45deg) translate(5px, 5px)',
  } : hamburgerLineStyle;

  const line2Style = menuOpen ? {
    ...hamburgerLineStyle,
    opacity: 0,
  } : hamburgerLineStyle;

  const line3Style = menuOpen ? {
    ...hamburgerLineStyle,
    transform: 'rotate(-45deg) translate(7px, -7px)',
  } : hamburgerLineStyle;

  const mobileNavStyle = {
    display: isMobile ? (menuOpen ? 'flex' : 'none') : 'none',
    position: 'fixed',
    top: '60px',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'column',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    zIndex: 99,
  };

  const desktopNavStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  };

  return (
    <header style={headerStyle}>
      <div style={headerContentStyle}>
        <div style={logoContainerStyle}>
          <Logo 
            logoLinkPath={logoLinkPath} 
            currentUser={currentUser} 
          />
        </div>
        
        {!isMobile && (
          <div style={desktopNavStyle}>
            <Navigation 
              pathname={pathname} 
              currentUser={currentUser} 
            />
          </div>
        )}
        
        <div 
          ref={hamburgerRef}
          style={hamburgerStyle} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div style={line1Style}></div>
          <div style={line2Style}></div>
          <div style={line3Style}></div>
        </div>
        
        <div ref={menuRef} style={mobileNavStyle}>
          <Navigation 
            pathname={pathname} 
            currentUser={currentUser} 
            isMobile={true}
          />
        </div>
      </div>
    </header>
  );
};

export default Header; 