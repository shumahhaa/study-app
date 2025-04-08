import React from 'react';
import styles from './styles';

const AccountActions = ({
  isStudying,
  handleLogout,
  handleShowDeleteModal
}) => {
  return (
    <div style={styles.accountActions}>
      <div style={styles.logoutContainer}>
        <button
          type="button"
          style={{
            ...styles.btnSecondary,
            ...(isStudying ? styles.btnSecondaryDisabled : {})
          }}
          onClick={handleLogout}
          disabled={isStudying}
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
            ...(isStudying ? styles.btnDangerDisabled : {})
          }}
          onClick={handleShowDeleteModal}
          disabled={isStudying}
        >
          アカウント削除
        </button>
        {isStudying && <div style={styles.studySessionWarning}>学習セッション中</div>}
      </div>
    </div>
  );
};

export default AccountActions; 