import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential as reauthWithCredential,
  updatePassword,
  sendEmailVerification,
  deleteUser
} from "firebase/auth";

// Firebaseの初期化（認証のみに必要な設定）
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 認証関連の関数
// ログイン
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: userCredential.user,
      token: await userCredential.user.getIdToken()
    };
  } catch (error) {
    console.error("ログインエラー:", error);
    throw error;
  }
};

// 新規登録
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // メール認証を送信
    await sendEmailVerification(userCredential.user);
    
    try {
      // バックエンドAPI経由でユーザー情報を保存
      const token = await userCredential.user.getIdToken();
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          emailVerified: false // 初期状態は未認証
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("バックエンド登録エラー:", errorData);
        // バックエンド登録が失敗してもFirebaseユーザーは作成済みなので、
        // バックエンドエラーはログに記録するだけにします
      }
    } catch (apiError) {
      console.error("APIエラー:", apiError);
      // バックエンドAPI呼び出しエラーはログに記録するだけにします
    }
    
    // いずれにしてもFirebaseユーザーは正常に作成されたのでユーザー情報を返します
    return {
      user: userCredential.user,
      token: await userCredential.user.getIdToken()
    };
  } catch (error) {
    console.error("登録エラー:", error);
    throw error;
  }
};

// ログアウト
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("ログアウトエラー:", error);
    throw error;
  }
};

// パスワードリセットメールの送信
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("パスワードリセットエラー:", error);
    throw error;
  }
};

// 現在のユーザーを取得
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// 認証トークンを取得
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  return await user.getIdToken();
};

// 現在のパスワードを使用してユーザーを再認証
export const reauthenticateWithCredential = async (user, currentPassword) => {
  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthWithCredential(user, credential);
    return { success: true };
  } catch (error) {
    console.error("再認証エラー:", error);
    throw error;
  }
};

// ユーザーのパスワードを更新
export const updateUserPassword = async (user, newPassword) => {
  try {
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    console.error("パスワード更新エラー:", error);
    throw error;
  }
};

// ユーザーアカウントを削除する
export const deleteUserAccount = async (user, password) => {
  try {
    // 再認証が必要
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthWithCredential(user, credential);
    
    // ユーザーアカウントを削除
    await deleteUser(user);
    return { success: true };
  } catch (error) {
    console.error("アカウント削除エラー:", error);
    throw error;
  }
};

// ダミーのdbオブジェクト（既存のコードとの互換性のため）
// 注：このオブジェクトは実際には使用されず、すべての操作はAPIを通じて行われます
const db = {};

export { db, auth };

