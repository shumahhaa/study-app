import React from 'react';
import styles from './styles';

const AccountActions = ({
  isStudying,
  handleLogout,
  handleShowDeleteModal
}) => {
  // ホバー状態を管理
  const [isLogoutHovered, setIsLogoutHovered] = React.useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = React.useState(false);
  
  return (
    <div style={styles.accountActions}>
      <div style={styles.logoutContainer}>
        <button
          type="button"
          style={{
            ...styles.btnSecondary,
            ...(isStudying ? styles.btnSecondaryDisabled : {}),
            ...(isLogoutHovered && !isStudying ? styles.btnSecondaryHover : {})
          }}
          onClick={handleLogout}
          disabled={isStudying}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
        >
          ログアウト
        </button>
        {isStudying && <div style={styles.studySessionWarning}>学習セッション中</div>}
      </div>
      
      <div style={styles.deleteAccountContainer}>
        <button
          type="button"
          style={{
            ...styles.btnDanger,
            ...(isStudying ? styles.btnDangerDisabled : {}),
            ...(isDeleteHovered && !isStudying ? styles.btnDangerHover : {})
          }}
          onClick={handleShowDeleteModal}
          disabled={isStudying}
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
        >
          アカウント削除
        </button>
        {isStudying && <div style={styles.studySessionWarning}>学習セッション中</div>}
      </div>
    </div>
  );
};

export default AccountActions; 