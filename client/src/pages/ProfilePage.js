import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import {
  ProfileForm,
  AccountActions,
  DeleteAccountModal,
  styles
} from '../components/Profile';

function ProfilePage({ isStudying }) {
  const { currentUser, logout, updateProfile, resendVerificationEmail, deleteAccount } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    // 学習中の場合はログアウトできないようにする
    if (isStudying) {
      setError('学習セッション中はログアウトできません。学習を終了するか、完了してからお試しください。');
      return;
    }
    
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
    // 学習中の場合はアカウント削除できないようにする
    if (isStudying) {
      setError('学習セッション中はアカウント削除できません。学習を終了するか、完了してからお試しください。');
      return;
    }
    
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
    <Layout isStudying={isStudying}>
      <div style={styles.profileContainer}>
        <div style={styles.profileCard}>
          <ProfileForm
            currentUser={currentUser}
            displayName={displayName}
            setDisplayName={setDisplayName}
            loading={loading}
            error={error}
            success={success}
            handleUpdateProfile={handleUpdateProfile}
          />
          
          <AccountActions
            isStudying={isStudying}
            handleLogout={handleLogout}
            handleShowDeleteModal={handleShowDeleteModal}
          />
        </div>
      </div>
      
      <DeleteAccountModal
        showDeleteModal={showDeleteModal}
        deletePassword={deletePassword}
        setDeletePassword={setDeletePassword}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        deleteError={deleteError}
        deleteLoading={deleteLoading}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleDeleteAccount={handleDeleteAccount}
      />
    </Layout>
  );
}

export default ProfilePage; 