import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isFormValid, setIsFormValid] = useState(false);
  
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
  
  // パスワードと確認テキストの入力状態を監視
  useEffect(() => {
    setIsFormValid(deletePassword !== '' && deleteConfirm !== '');
  }, [deletePassword, deleteConfirm]);
  
  // モバイル表示時のモーダルボディスタイル
  const modalBodyStyle = {
    ...styles.modalBody,
    padding: isMobile ? '15px' : '25px'
  };
  
  // ボタン間の距離を広げたスタイル
  const modalActionsStyle = {
    ...styles.modalActions,
    justifyContent: 'center',
    marginTop: '30px'
  };
  
  // 警告テキストのスタイル
  const warningTextStyle = {
    ...styles.warningText,
    padding: isMobile ? '5px 12px' : '12px'
  };
  
  if (!showDeleteModal) return null;
  
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2>アカウント削除の確認</h2>
          <button style={styles.modalClose} onClick={handleCloseDeleteModal}>&times;</button>
        </div>
        
        <div style={modalBodyStyle}>
          <p style={warningTextStyle}>
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
            
            <div style={modalActionsStyle}>
              <button 
                type="submit" 
                style={{
                  ...styles.btnDanger,
                  ...(!isFormValid || deleteLoading ? styles.btnDangerDisabled : {})
                }}
                disabled={!isFormValid || deleteLoading}
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