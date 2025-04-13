import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles';
import { isActive, isAuthPage } from './utils';

const Navigation = ({ pathname, currentUser, isMobile }) => {
  const isActivePath = (path) => isActive(pathname, path);
  const isAuth = isAuthPage(pathname);

  const navStyle = {
    ...styles.nav,
    ...(isMobile && {
      flexDirection: 'column',
      gap: '15px',
      alignItems: 'center',
      width: '100%',
    })
  };

  const linkStyle = isMobile ? {
    width: '100%',
    textAlign: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  } : {};

  return (
    <nav style={navStyle}>
      {!isAuth && currentUser && (
        <>
          <Link 
            to="/review-quizzes" 
            className={`nav-link ${isActivePath('/review-quizzes') ? 'active-link' : ''}`}
            style={linkStyle}
          >
            復習問題
          </Link>
          <Link 
            to="/analytics" 
            className={`nav-link ${isActivePath('/analytics') ? 'active-link' : ''}`}
            style={linkStyle}
          >
            学習分析
          </Link>
          <Link 
            to="/calendar" 
            className={`nav-link ${isActivePath('/calendar') ? 'active-link' : ''}`}
            style={linkStyle}
          >
            カレンダー
          </Link>
          <Link 
            to="/history" 
            className={`nav-link ${isActivePath('/history') ? 'active-link' : ''}`}
            style={linkStyle}
          >
            学習履歴
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${isActivePath('/profile') ? 'active-link' : ''}`}
            style={linkStyle}
          >
            プロフィール
          </Link>
        </>
      )}
      {isAuth && (
        <>
          <Link 
            to="/login" 
            className={`nav-link ${isActivePath('/login') ? 'active-link' : ''}`}
            style={{ 
              fontWeight: isActivePath('/login') ? 'bold' : 'normal',
              ...linkStyle
            }}
          >
            ログイン
          </Link>
          <Link 
            to="/register" 
            className={`nav-link ${isActivePath('/register') ? 'active-link' : ''}`}
            style={{ 
              fontWeight: isActivePath('/register') ? 'bold' : 'normal',
              ...linkStyle
            }}
          >
            新規登録
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navigation; 