import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles';
import { isActive, isAuthPage } from './utils';

const Navigation = ({ pathname, currentUser }) => {
  const isActivePath = (path) => isActive(pathname, path);
  const isAuth = isAuthPage(pathname);

  return (
    <nav style={styles.nav}>
      {!isAuth && currentUser && (
        <>
          <Link 
            to="/home" 
            className={`nav-link ${isActivePath('/home') ? 'active-link' : ''}`}
          >
            ホーム
          </Link>
          <Link 
            to="/review-quizzes" 
            className={`nav-link ${isActivePath('/review-quizzes') ? 'active-link' : ''}`}
          >
            復習問題
          </Link>
          <Link 
            to="/analytics" 
            className={`nav-link ${isActivePath('/analytics') ? 'active-link' : ''}`}
          >
            学習分析
          </Link>
          <Link 
            to="/calendar" 
            className={`nav-link ${isActivePath('/calendar') ? 'active-link' : ''}`}
          >
            カレンダー
          </Link>
          <Link 
            to="/history" 
            className={`nav-link ${isActivePath('/history') ? 'active-link' : ''}`}
          >
            学習履歴
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${isActivePath('/profile') ? 'active-link' : ''}`}
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
            style={{ fontWeight: isActivePath('/login') ? 'bold' : 'normal' }}
          >
            ログイン
          </Link>
          <Link 
            to="/register" 
            className={`nav-link ${isActivePath('/register') ? 'active-link' : ''}`}
            style={{ fontWeight: isActivePath('/register') ? 'bold' : 'normal' }}
          >
            新規登録
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navigation; 