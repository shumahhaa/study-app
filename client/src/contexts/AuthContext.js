import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, loginWithEmail, logoutUser, registerWithEmail, sendPasswordReset, reauthenticateWithCredential, updateUserPassword, deleteUserAccount } from '../firebase';
import { fetchUserProfile, updateUserProfile, deleteUserData } from '../utils/api';
import { sendEmailVerification } from 'firebase/auth';

// 認証コンテキストを作成
const AuthContext = createContext();

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 認証状態を監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // ユーザープロフィールを取得
          const profile = await fetchUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('プロフィール取得エラー:', error);
          // エラーがあっても基本的なユーザー情報でプロファイルを設定
          setUserProfile({
            email: user.email,
            role: 'user',
            emailVerified: user.emailVerified
          });
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ログイン
  const login = async (email, password) => {
    setError(null);
    try {
      const result = await loginWithEmail(email, password);
      
      // メール認証が完了しているかチェック
      if (!result.user.emailVerified) {
        // メール認証が未完了の場合は警告を表示
        setError('メールアドレスの認証が完了していません。メール内のリンクをクリックして認証を完了してください。');
        // 新しいメール認証を送信
        try {
          await sendEmailVerification(result.user);
        } catch (verificationError) {
          console.error('認証メール送信エラー:', verificationError);
        }
        // ユーザーをログアウト
        await logoutUser();
        throw new Error('メールアドレスの認証が完了していません');
      }
      
      return result;
    } catch (error) {
      console.error('ログインエラー:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  // 新規登録
  const register = async (email, password) => {
    setError(null);
    try {
      const result = await registerWithEmail(email, password);
      try {
        // ユーザープロフィールを取得
        const profile = await fetchUserProfile();
        setUserProfile(profile);
      } catch (profileError) {
        console.error('プロフィール取得エラー:', profileError);
        // プロフィール取得エラーはログに記録するだけで、登録は成功とみなす
      }
      return result;
    } catch (error) {
      console.error('登録エラー:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  // ログアウト
  const logout = async () => {
    setError(null);
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('ログアウトエラー:', error);
      setError('ログアウト中にエラーが発生しました');
      throw error;
    }
  };

  // プロファイル更新
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const result = await updateUserProfile(profileData);
      
      // ユーザープロフィールを更新
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...profileData
        });
      }
      
      return result;
    } catch (error) {
      console.error('プロファイル更新エラー:', error);
      setError('プロファイルの更新中にエラーが発生しました');
      throw error;
    }
  };

  // パスワード変更
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    if (!currentUser) {
      setError('ユーザーが認証されていません');
      throw new Error('ユーザーが認証されていません');
    }
    
    try {
      // 現在のパスワードで再認証
      await reauthenticateWithCredential(currentUser, currentPassword);
      
      // パスワードを更新
      await updateUserPassword(currentUser, newPassword);
      
      return { success: true, message: 'パスワードが正常に変更されました' };
    } catch (error) {
      console.error('パスワード変更エラー:', error);
      
      if (error.code === 'auth/wrong-password') {
        setError('現在のパスワードが正しくありません');
      } else if (error.code === 'auth/weak-password') {
        setError('新しいパスワードは6文字以上である必要があります');
      } else {
        setError('パスワードの変更中にエラーが発生しました');
      }
      
      throw error;
    }
  };

  // パスワードリセット
  const resetPassword = async (email) => {
    setError(null);
    try {
      await sendPasswordReset(email);
      return { success: true };
    } catch (error) {
      console.error('パスワードリセットエラー:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  // メール認証を再送信
  const resendVerificationEmail = async () => {
    setError(null);
    if (!currentUser) {
      setError('ユーザーが認証されていません');
      throw new Error('ユーザーが認証されていません');
    }
    
    if (currentUser.emailVerified) {
      setError('メールアドレスは既に認証されています');
      throw new Error('メールアドレスは既に認証されています');
    }
    
    try {
      await sendEmailVerification(currentUser);
      return { success: true, message: '認証メールを送信しました' };
    } catch (error) {
      console.error('認証メール送信エラー:', error);
      
      if (error.code === 'auth/too-many-requests') {
        setError('リクエストが多すぎます。しばらく待ってから再試行してください');
      } else {
        setError('認証メールの送信に失敗しました');
      }
      
      throw error;
    }
  };

  // アカウント削除
  const deleteAccount = async (password) => {
    setError(null);
    if (!currentUser) {
      setError('ユーザーが認証されていません');
      throw new Error('ユーザーが認証されていません');
    }
    
    try {
      // Firestoreからユーザーデータを削除
      await deleteUserData();
      
      // Firebase Authからユーザーアカウントを削除
      await deleteUserAccount(currentUser, password);
      
      return { success: true };
    } catch (error) {
      console.error('アカウント削除エラー:', error);
      
      if (error.code === 'auth/wrong-password') {
        setError('パスワードが正しくありません');
      } else if (error.code === 'auth/requires-recent-login') {
        setError('再認証が必要です。ログアウト後、再度ログインしてください');
      } else {
        setError('アカウントの削除中にエラーが発生しました');
      }
      
      throw error;
    }
  };

  // Firebase認証エラーメッセージを日本語化
  const getErrorMessage = (error) => {
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'このメールアドレスは既に使用されています';
      case 'auth/invalid-email':
        return 'メールアドレスの形式が正しくありません';
      case 'auth/weak-password':
        return 'パスワードは6文字以上である必要があります';
      case 'auth/user-not-found':
        return 'メールアドレスまたはパスワードが正しくありません';
      case 'auth/wrong-password':
        return 'メールアドレスまたはパスワードが正しくありません';
      case 'auth/too-many-requests':
        return 'ログイン試行回数が多すぎます。しばらく時間をおいてからお試しください';
      case 'auth/user-disabled':
        return 'このアカウントは無効になっています';
      case 'auth/requires-recent-login':
        return '再認証が必要です。ログアウト後、再度ログインしてください';
      case 'auth/email-already-exists':
        return 'このメールアドレスは既に使用されています';
      default:
        return '認証エラーが発生しました';
    }
  };

  // コンテキスト値
  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    changePassword,
    resendVerificationEmail,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// カスタムフック
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 