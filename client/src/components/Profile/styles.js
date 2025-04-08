// ProfilePage のスタイル定義
// 既存のProfilePage.cssから変換

const styles = {
  profileContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    marginTop: '20px',
  },
  profileForm: {
    marginBottom: '30px',
  },
  profileInfo: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  errorMessage: {
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  successMessage: {
    color: '#388e3c',
    backgroundColor: '#e8f5e9',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  btnPrimary: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s',
  },
  btnPrimaryHover: {
    backgroundColor: '#388e3c',
  },
  btnPrimaryDisabled: {
    backgroundColor: '#a5d6a7',
    cursor: 'not-allowed',
  },
  btnSecondary: {
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s',
  },
  btnSecondaryHover: {
    backgroundColor: '#1976d2',
  },
  btnDanger: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s',
  },
  btnDangerHover: {
    backgroundColor: '#d32f2f',
  },
  btnDangerDisabled: {
    backgroundColor: '#ef9a9a',
    cursor: 'not-allowed',
  },
  passwordForm: {
    borderTop: '1px solid #eee',
    paddingTop: '30px',
  },
  accountActions: {
    borderTop: '1px solid #eee',
    paddingTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
  },
  logoutContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  deleteAccountContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  studySessionWarning: {
    color: '#f44336',
    fontSize: '12px',
    marginTop: '5px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    padding: '15px 20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999',
  },
  modalBody: {
    padding: '20px',
  },
  warningText: {
    color: '#f44336',
    fontWeight: '500',
    marginBottom: '20px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  profileActions: {
    marginTop: '20px',
  }
};

export default styles; 