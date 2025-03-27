import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ProfilePage.css';
import Layout from '../components/Layout';

function ProfilePage() {
  const { currentUser, userProfile, logout, updateProfile, changePassword, resendVerificationEmail, deleteAccount } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('ログアウトに失敗しました');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile({ displayName });
      setSuccess('プロファイルが更新されました');
    } catch (error) {
      setError(error.message || 'プロファイルの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordChangeLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    // パスワード検証
    if (newPassword.length < 6) {
      setPasswordError('新しいパスワードは6文字以上である必要があります');
      setPasswordChangeLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('新しいパスワードと確認用パスワードが一致しません');
      setPasswordChangeLoading(false);
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('パスワードが正常に変更されました');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(error.message || 'パスワードの変更に失敗しました');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationLoading(true);
    setVerificationError('');
    setVerificationSuccess('');

    try {
      await resendVerificationEmail();
      setVerificationSuccess('認証メールを送信しました。メールをご確認ください');
    } catch (error) {
      setVerificationError(error.message || '認証メールの送信に失敗しました');
    } finally {
      setVerificationLoading(false);
    }
  };

  // アカウント削除モーダルを表示
  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
    setDeletePassword('');
    setDeleteConfirm('');
    setDeleteError('');
  };

  // アカウント削除モーダルを閉じる
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // アカウント削除処理
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');
    setDeleteLoading(true);

    // 入力確認チェック
    if (deleteConfirm !== '削除します') {
      setDeleteError('確認文が正しくありません');
      setDeleteLoading(false);
      return;
    }

    if (!deletePassword) {
      setDeleteError('パスワードを入力してください');
      setDeleteLoading(false);
      return;
    }

    try {
      await deleteAccount(deletePassword);
      // 削除成功後はログインページにリダイレクト
      navigate('/login');
    } catch (error) {
      setDeleteError(error.message || 'アカウントの削除に失敗しました');
      setDeleteLoading(false);
    }
  };

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-card">
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <h2>プロフィール情報</h2>
            <div className="profile-info">
              <p><strong>メールアドレス:</strong> {currentUser?.email}</p>
              <p><strong>表示名:</strong> {displayName || '未設定'}</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-group">
              <label htmlFor="displayName">表示名</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="表示名を入力"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? '更新中...' : 'プロフィールを更新'}
            </button>
          </form>
          
          <form onSubmit={handleChangePassword} className="profile-form password-form">
            <h2>パスワード変更</h2>
            
            <div className="form-group">
              <label htmlFor="currentPassword">現在のパスワード</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">新しいパスワード</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">パスワード（確認）</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            {passwordError && <div className="error-message">{passwordError}</div>}
            {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
            
            <div className="profile-actions">
              <button type="submit" className="btn btn-primary" disabled={passwordChangeLoading}>
                {passwordChangeLoading ? '更新中...' : 'パスワードを変更'}
              </button>
            </div>
          </form>
          
          <div className="account-actions">
            <div className="logout-container">
              <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                ログアウト
              </button>
            </div>
            
            <div className="delete-account-container">
              <button type="button" className="btn btn-danger" onClick={handleShowDeleteModal}>
                アカウント削除
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* アカウント削除確認モーダル */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>アカウント削除の確認</h2>
              <button className="modal-close" onClick={handleCloseDeleteModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <p className="warning-text">
                アカウントを削除すると、すべてのデータが完全に削除され、復元できなくなります。
              </p>
              
              <form onSubmit={handleDeleteAccount}>
                <div className="form-group">
                  <label htmlFor="deletePassword">パスワード</label>
                  <input
                    type="password"
                    id="deletePassword"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="deleteConfirm">確認のため「削除します」と入力してください</label>
                  <input
                    type="text"
                    id="deleteConfirm"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    required
                  />
                </div>
                
                {deleteError && <div className="error-message">{deleteError}</div>}
                
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                    キャンセル
                  </button>
                  <button type="submit" className="btn btn-danger" disabled={deleteLoading}>
                    {deleteLoading ? '処理中...' : 'アカウントを削除'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ProfilePage; 