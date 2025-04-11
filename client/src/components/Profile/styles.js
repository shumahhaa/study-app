// ProfilePage のスタイル定義
// 白、青、緑を基調にカジュアルで高級感のあるデザイン

const styles = {
  profileContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9fafb',
  },
  profileCard: {
    background: 'linear-gradient(135deg, rgba(236, 246, 255, 0.9) 0%, rgba(240, 253, 250, 0.9) 50%, rgba(236, 253, 245, 0.9) 100%)',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
    padding: '35px',
    marginTop: '20px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
  },
  profileForm: {
    marginBottom: '30px',
  },
  profileInfo: {
    padding: '18px',
    backgroundColor: 'rgba(236, 253, 245, 0.6)',
    borderRadius: '8px',
    marginBottom: '25px',
    borderLeft: '3px solid #10b981',
  },
  errorMessage: {
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  successMessage: {
    color: '#0f766e',
    backgroundColor: '#d1fae5',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  formGroup: {
    marginBottom: '22px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '15px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
      outline: 'none',
    }
  },
  // ボタン共通スタイル
  buttonBase: {
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 20px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '250px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px 0',
  },
  // ホバー共通スタイル
  buttonHover: {
    opacity: 0.9,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
  // 無効状態共通スタイル
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
    transform: 'none',
  },
  // プライマリーボタン - 緑
  btnPrimary: {
    backgroundColor: '#10b981',
  },
  btnPrimaryHover: {},
  btnPrimaryDisabled: {},
  // セカンダリーボタン - 青
  btnSecondary: {
    backgroundColor: '#3b82f6',
  },
  btnSecondaryHover: {},
  // デンジャーボタン - 赤
  btnDanger: {
    backgroundColor: '#f43f5e',
  },
  btnDangerHover: {},
  btnDangerDisabled: {},
  passwordForm: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '35px',
    marginTop: '10px',
  },
  accountActions: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '35px',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '35px',
  },
  logoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '48%',
  },
  deleteAccountContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '48%',
  },
  studySessionWarning: {
    color: '#f43f5e',
    fontSize: '13px',
    marginTop: '5px',
    fontStyle: 'italic',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid rgba(226, 232, 240, 0.8)',
  },
  modalHeader: {
    padding: '18px 25px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#64748b',
    transition: 'color 0.2s',
    '&:hover': {
      color: '#334155',
    }
  },
  modalBody: {
    padding: '25px',
  },
  warningText: {
    color: '#f43f5e',
    fontWeight: '500',
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: 'rgba(254, 226, 226, 0.5)',
    borderRadius: '6px',
    borderLeft: '3px solid #f43f5e',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '25px',
  },
  profileActions: {
    marginTop: '25px',
    display: 'flex',
    justifyContent: 'flex-start',
  }
};

// ボタンスタイルの拡張
styles.btnPrimary = { ...styles.buttonBase, ...styles.btnPrimary };
styles.btnPrimaryHover = { ...styles.buttonHover };
styles.btnPrimaryDisabled = { ...styles.buttonDisabled };

styles.btnSecondary = { ...styles.buttonBase, ...styles.btnSecondary };
styles.btnSecondaryHover = { ...styles.buttonHover };

styles.btnDanger = { ...styles.buttonBase, ...styles.btnDanger };
styles.btnDangerHover = { ...styles.buttonHover };
styles.btnDangerDisabled = { ...styles.buttonDisabled };

export default styles; 