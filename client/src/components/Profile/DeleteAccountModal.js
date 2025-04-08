import React from 'react';
import styles from './styles';

const DeleteAccountModal = ({
  showDeleteModal,
  deletePassword,
  setDeletePassword,
  deleteConfirm,
  setDeleteConfirm,
  deleteError,
  deleteLoading,
  handleCloseDeleteModal,
  handleDeleteAccount
}) => {
  if (!showDeleteModal) return null;
  
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2>アカウント削除の確認</h2>
          <button style={styles.modalClose} onClick={handleCloseDeleteModal}>&times;</button>
        </div>
        
        <div style={styles.modalBody}>
          <p style={styles.warningText}>
            アカウントを削除すると、すべてのデータが完全に削除され、復元できなくなります。
          </p>
          
          <form onSubmit={handleDeleteAccount}>
            <div style={styles.formGroup}>
              <label htmlFor="deletePassword" style={styles.label}>パスワード</label>
              <input
                type="password"
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="deleteConfirm" style={styles.label}>確認のため「削除します」と入力してください</label>
              <input
                type="text"
                id="deleteConfirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            
            {deleteError && <div style={styles.errorMessage}>{deleteError}</div>}
            
            <div style={styles.modalActions}>
              <button 
                type="button" 
                style={styles.btnSecondary} 
                onClick={handleCloseDeleteModal}
              >
                キャンセル
              </button>
              <button 
                type="submit" 
                style={{
                  ...styles.btnDanger,
                  ...(deleteLoading ? styles.btnDangerDisabled : {})
                }}
                disabled={deleteLoading}
              >
                {deleteLoading ? '処理中...' : 'アカウントを削除'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal; 