import React from 'react';
import styles from './styles';

const PasswordChangeForm = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordChangeLoading,
  passwordError,
  passwordSuccess,
  handleChangePassword
}) => {
  // ホバー状態を管理
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <form onSubmit={handleChangePassword} className="profile-form" style={{...styles.profileForm, ...styles.passwordForm}}>
      <h2>パスワード変更</h2>
      
      <div style={styles.formGroup}>
        <label htmlFor="currentPassword" style={styles.label}>現在のパスワード</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          style={styles.input}
        />
      </div>
      
      <div style={styles.formGroup}>
        <label htmlFor="newPassword" style={styles.label}>新しいパスワード</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength="6"
          style={styles.input}
        />
      </div>
      
      <div style={styles.formGroup}>
        <label htmlFor="confirmPassword" style={styles.label}>パスワード（確認）</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={styles.input}
        />
      </div>
      
      {passwordError && <div style={styles.errorMessage}>{passwordError}</div>}
      {passwordSuccess && <div style={styles.successMessage}>{passwordSuccess}</div>}
      
      <div style={styles.profileActions}>
        <button 
          type="submit" 
          style={{
            ...styles.btnPrimary,
            ...(passwordChangeLoading ? styles.btnPrimaryDisabled : {}),
            ...(isHovered && !passwordChangeLoading ? styles.btnPrimaryHover : {})
          }}
          disabled={passwordChangeLoading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {passwordChangeLoading ? '更新中...' : 'パスワードを変更'}
        </button>
      </div>
    </form>
  );
};

export default PasswordChangeForm; 