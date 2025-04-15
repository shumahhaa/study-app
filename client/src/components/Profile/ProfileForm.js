import React, { useState, useEffect } from 'react';
import styles from './styles';

const ProfileForm = ({
  currentUser,
  displayName,
  error,
  success
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 画面サイズの変更を監視
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // スマホサイズ向けのスタイル
  const headingStyle = {
    ...styles.heading,
    ...(isMobile && { textAlign: 'center' })
  };

  return (
    <div className="profile-form" style={styles.profileForm}>
      <h2 style={headingStyle}>プロフィール情報</h2>
      <div style={styles.profileInfo}>
        <p><strong>メールアドレス:</strong> {currentUser?.email}</p>
        <p><strong>表示名:</strong> {displayName || '未設定'}</p>
      </div>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}
    </div>
  );
};

export default ProfileForm; 