const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const { verifyToken } = require('../middleware/authMiddleware');

// Firestoreオブジェクトを標準的なJSONに変換するヘルパー関数
const convertFirestoreTimestamps = (obj) => {
  if (!obj) return obj;
  
  if (obj.constructor.name === 'Timestamp') {
    // Firestoreのタイムスタンプオブジェクトをシリアライズ可能な形式に変換
    return {
      _seconds: obj.seconds,
      _nanoseconds: obj.nanoseconds
    };
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertFirestoreTimestamps(item));
  }
  
  if (typeof obj === 'object') {
    const result = {};
    Object.keys(obj).forEach(key => {
      result[key] = convertFirestoreTimestamps(obj[key]);
    });
    return result;
  }
  
  return obj;
};

// 学習セッションデータをFirestoreに保存するエンドポイント
router.post('/study-sessions', verifyToken, async (req, res) => {
  try {
    const sessionData = req.body;
    const userId = req.user.uid; // 認証されたユーザーIDを取得
    
    // 新しいスキーマに適合するデータを準備
    const formattedData = {
      uId: userId,
      topic: sessionData.topic,
      duration: sessionData.duration,
      startTime: admin.firestore.Timestamp.fromDate(new Date(sessionData.startTime)),
      endTime: admin.firestore.Timestamp.fromDate(new Date(sessionData.endTime)),
      motivation: sessionData.motivation,
      pausedtime: sessionData.pausedtime
    };
    
    // Firestoreに保存
    const docRef = await db.collection('studySessions').add(formattedData);
    
    res.status(201).json({ 
      id: docRef.id,
      message: '学習セッションが正常に保存されました'
    });
  } catch (error) {
    console.error('学習セッション保存エラー:', error);
    res.status(500).json({ error: error.message || 'データ保存エラー' });
  }
});

// 復習問題をFirestoreに保存するエンドポイント
router.post('/review-quizzes', verifyToken, async (req, res) => {
  try {
    const { quiz, studyTopic } = req.body;
    const userId = req.user.uid; // 認証されたユーザーIDを取得
    
    // 復習スケジュールを計算
    const now = new Date();
    const reviewSchedule = [
      { interval: '1d', completed: false },
      { interval: '3d', completed: false },
      { interval: '1w', completed: false },
      { interval: '2w', completed: false },
      { interval: '1m', completed: false }
    ];
    
    // 次回の復習日を設定（1日後）
    const nextReviewDate = admin.firestore.Timestamp.fromDate(new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000));
    
    // Firestoreに保存するデータを準備
    const quizData = {
      uId: userId, // ユーザーIDをuIdに変更
      studyTopic,
      questions: quiz.questions,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastReviewedAt: null, // 初回は未レビュー
      reviewSchedule,
      nextReviewDate: nextReviewDate,
      reviewStatus: true, // 文字列からブール値に変更
      currentReviewIndex: 0,
    };
    
    // Firestoreに保存
    const docRef = await db.collection('reviewQuizzes').add(quizData);
    
    res.status(201).json({ 
      id: docRef.id,
      message: '復習問題が正常に保存されました'
    });
  } catch (error) {
    console.error('復習問題保存エラー:', error);
    res.status(500).json({ error: error.message || 'データ保存エラー' });
  }
});

// 復習問題の一覧を取得するエンドポイント
router.get('/review-quizzes', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid; // 認証されたユーザーIDを取得
    
    // ユーザーに紐づく復習問題のみを取得
    const snapshot = await db.collection('reviewQuizzes')
      .where('uId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const quizzes = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      quizzes.push({
        id: doc.id,
        ...convertFirestoreTimestamps(data)
      });
    });
    
    res.json(quizzes);
  } catch (error) {
    console.error('復習クイズの取得中にエラーが発生しました:', error);
    res.status(500).json({ error: error.message || 'データの取得に失敗しました' });
  }
});

// 復習問題の状態を更新するエンドポイント
router.put('/review-quizzes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.uid; // 認証されたユーザーIDを取得
    
    // ドキュメントの存在確認
    const docRef = db.collection('reviewQuizzes').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: '指定された復習問題が見つかりません' });
    }
    
    // ドキュメントのユーザーIDを確認（所有者のみ更新可能）
    const data = doc.data();
    if (data.uId !== userId) {
      return res.status(403).json({ error: 'この復習問題を更新する権限がありません' });
    }
    
    // ドキュメントを更新
    await docRef.update(updates);
    
    res.json({ 
      id, 
      message: '復習問題が正常に更新されました' 
    });
  } catch (error) {
    console.error('復習問題更新エラー:', error);
    res.status(500).json({ error: error.message || 'データ更新エラー' });
  }
});

// 復習問題を削除するエンドポイント
router.delete('/review-quizzes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid; // 認証されたユーザーIDを取得
    
    // ドキュメントの存在確認
    const docRef = db.collection('reviewQuizzes').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: '指定された復習問題が見つかりません' });
    }
    
    // ドキュメントのユーザーIDを確認（所有者のみ削除可能）
    const data = doc.data();
    if (data.uId !== userId) {
      return res.status(403).json({ error: 'この復習問題を削除する権限がありません' });
    }
    
    // ドキュメントを削除
    await docRef.delete();
    
    res.json({ 
      id, 
      message: '復習問題が正常に削除されました' 
    });
  } catch (error) {
    console.error('復習問題削除エラー:', error);
    res.status(500).json({ error: error.message || 'データ削除エラー' });
  }
});

// 学習セッションの一覧を取得するエンドポイント
router.get('/study-sessions', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid; // 認証されたユーザーIDを取得
    
    // ユーザーに紐づく学習セッションのみを取得
    const snapshot = await db.collection('studySessions')
      .where('uId', '==', userId)
      .orderBy('startTime', 'desc')
      .get();
      
    const sessions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        ...convertFirestoreTimestamps(data)
      });
    });
    
    res.json(sessions);
  } catch (error) {
    console.error('学習セッション取得エラー:', error);
    res.status(500).json({ error: error.message || 'データ取得エラー' });
  }
});

// 学習セッションを削除するエンドポイント
router.delete('/study-sessions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid; // 認証されたユーザーIDを取得
    
    // ドキュメントの存在確認
    const docRef = db.collection('studySessions').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: '指定された学習セッションが見つかりません' });
    }
    
    // ドキュメントのユーザーIDを確認（所有者のみ削除可能）
    const data = doc.data();
    if (data.uId !== userId) {
      return res.status(403).json({ error: 'この学習セッションを削除する権限がありません' });
    }
    
    // ドキュメントを削除
    await docRef.delete();
    
    res.json({ 
      id, 
      message: '学習セッションが正常に削除されました' 
    });
  } catch (error) {
    console.error('学習セッション削除エラー:', error);
    res.status(500).json({ error: error.message || 'データ削除エラー' });
  }
});

module.exports = router; 