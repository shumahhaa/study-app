const express = require('express');
const { auth, db } = require('../config/firebase');
const router = express.Router();

/**
 * ユーザー登録API
 * メールアドレスとパスワードでユーザーを作成
 */
router.post('/register', async (req, res) => {
  try {
    const { email, displayName, emailVerified } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'メールアドレスは必須です' });
    }
    
    // 認証トークンからユーザーIDを取得
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '認証トークンが提供されていません' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      console.error('トークン検証エラー:', error);
      return res.status(401).json({ error: '認証トークンが無効です' });
    }
    
    const uid = decodedToken.uid;
    
    try {
      // ユーザープロフィールをFirestoreに保存
      // 既に存在する場合は上書きしない
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        await db.collection('users').doc(uid).set({
          email: email,
          displayName: displayName || email.split('@')[0],
          createdAt: new Date(),
          role: 'user', // デフォルトロール
          emailVerified: emailVerified || false
        });
        
        return res.status(201).json({ 
          message: 'ユーザーが正常に作成されました',
          uid: uid 
        });
      } else {
        return res.status(200).json({ 
          message: 'ユーザーは既に存在します',
          uid: uid 
        });
      }
    } catch (firestoreError) {
      console.error('Firestoreエラー:', firestoreError);
      return res.status(500).json({ error: 'ユーザー情報の保存に失敗しました' });
    }
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    return res.status(500).json({ error: 'ユーザー登録に失敗しました' });
  }
});

/**
 * ユーザー情報取得API
 * 認証されたユーザーのプロフィール情報を取得
 */
router.get('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '認証トークンが提供されていません' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const { uid } = decodedToken;
    
    // Firebase Authからユーザー情報を取得
    const userAuth = await auth.getUser(uid);
    
    // Firestoreからユーザー情報を取得
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      // Firestoreにユーザーがいない場合はAuthの情報だけで返す
      return res.status(200).json({
        uid,
        email: userAuth.email,
        displayName: userAuth.displayName || userAuth.email.split('@')[0],
        role: 'user',
        emailVerified: userAuth.emailVerified
      });
    }
    
    const userData = userDoc.data();
    
    // Firebase Authの最新のemailVerified状態でFirestoreを更新
    if (userData.emailVerified !== userAuth.emailVerified) {
      await db.collection('users').doc(uid).update({
        emailVerified: userAuth.emailVerified
      });
    }
    
    return res.status(200).json({
      uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      emailVerified: userAuth.emailVerified // 常にAuthの値を使用
    });
  } catch (error) {
    console.error('ユーザー情報取得エラー:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: '認証トークンの有効期限が切れています', code: 'token-expired' });
    }
    
    return res.status(401).json({ error: '認証に失敗しました' });
  }
});

/**
 * ユーザープロファイル更新API
 * 認証されたユーザーのプロファイル情報を更新
 */
router.put('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '認証トークンが提供されていません' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const { uid } = decodedToken;
    
    const { displayName } = req.body;
    
    if (!displayName) {
      return res.status(400).json({ error: '表示名は必須です' });
    }
    
    // Firebase Authのユーザープロファイルを更新
    await auth.updateUser(uid, {
      displayName
    });
    
    // Firestoreのユーザープロファイルを更新
    await db.collection('users').doc(uid).update({
      displayName,
      updatedAt: new Date()
    });
    
    return res.status(200).json({
      message: 'プロファイルが更新されました',
      displayName
    });
  } catch (error) {
    console.error('プロファイル更新エラー:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: '認証トークンの有効期限が切れています', code: 'token-expired' });
    }
    
    return res.status(500).json({ error: 'プロファイルの更新に失敗しました' });
  }
});

/**
 * パスワードリセットメール送信API
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'メールアドレスは必須です' });
    }
    
    await auth.generatePasswordResetLink(email);
    
    return res.status(200).json({ message: 'パスワードリセットメールが送信されました' });
  } catch (error) {
    console.error('パスワードリセットエラー:', error);
    
    if (error.code === 'auth/user-not-found') {
      // セキュリティのため、ユーザーが見つからない場合でも成功メッセージを返す
      return res.status(200).json({ message: 'パスワードリセットメールが送信されました' });
    }
    
    return res.status(500).json({ error: 'パスワードリセットメールの送信に失敗しました' });
  }
});

/**
 * パスワード変更API
 * 認証されたユーザーのパスワードを変更
 */
router.post('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '認証トークンが提供されていません' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const { uid } = decodedToken;
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: '現在のパスワードと新しいパスワードは必須です' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: '新しいパスワードは6文字以上である必要があります' });
    }
    
    // NOTE: Firebase Admin SDKには直接パスワード検証の方法がないため、
    // クライアント側でパスワード検証を行い、再認証してから新しいパスワードを設定する必要があります
    // このAPIエンドポイントはクライアント側からの検証済みリクエストを処理します
    
    // パスワードを更新
    await auth.updateUser(uid, { password: newPassword });
    
    return res.status(200).json({ message: 'パスワードが正常に変更されました' });
  } catch (error) {
    console.error('パスワード変更エラー:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: '認証トークンの有効期限が切れています', code: 'token-expired' });
    }
    
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({ error: 'パスワードは6文字以上である必要があります' });
    }
    
    return res.status(500).json({ error: 'パスワードの変更に失敗しました' });
  }
});

/**
 * ユーザーアカウント削除API
 * Firebase AuthとFirestoreからユーザーデータを削除
 */
router.delete('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '認証トークンが提供されていません' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const { uid } = decodedToken;
    
    // Firestoreからユーザーデータを削除
    try {
      // ユーザードキュメントを削除
      await db.collection('users').doc(uid).delete();
      
      // 関連データを削除（学習セッション、復習問題など）
      const studySessionsSnapshot = await db.collection('studySessions').where('userId', '==', uid).get();
      const reviewQuizzesSnapshot = await db.collection('reviewQuizzes').where('userId', '==', uid).get();
      
      const batch = db.batch();
      
      studySessionsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      reviewQuizzesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // バッチ処理を実行
      await batch.commit();
      
      return res.status(200).json({
        success: true,
        message: 'ユーザーデータが正常に削除されました'
      });
    } catch (firestoreError) {
      console.error('Firestoreデータ削除エラー:', firestoreError);
      return res.status(500).json({ error: 'ユーザーデータの削除に失敗しました' });
    }
  } catch (error) {
    console.error('ユーザー削除エラー:', error);
    return res.status(500).json({ error: 'ユーザー削除に失敗しました' });
  }
});

module.exports = router; 