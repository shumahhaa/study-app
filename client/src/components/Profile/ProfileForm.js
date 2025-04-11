import React from 'react';
import styles from './styles';

const ProfileForm = ({
  currentUser,
  displayName,
  setDisplayName,
  loading,
  error,
  success,
  handleUpdateProfile
}) => {
  // ホバー状態を管理
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <form onSubmit={handleUpdateProfile} className="profile-form" style={styles.profileForm}>
      <h2>プロフィール情報</h2>
      <div style={styles.profileInfo}>
        <p><strong>メールアドレス:</strong> {currentUser?.email}</p>
        <p><strong>表示名:</strong> {displayName || '未設定'}</p>
      </div>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}
      
      <div style={styles.formGroup}>
        <label htmlFor="displayName" style={styles.label}>表示名</label>
        <input
          type="text"
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="表示名を入力"
          style={styles.input}
        />
      </div>
      
      <div style={styles.profileActions}>
        <button 
          type="submit" 
          style={{
            ...styles.btnPrimary,
            ...(loading ? styles.btnPrimaryDisabled : {}),
            ...(isHovered && !loading ? styles.btnPrimaryHover : {})
          }}
          disabled={loading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {loading ? '更新中...' : 'プロフィールを更新'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm; 