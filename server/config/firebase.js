const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Firebase Admin SDKの初期化
let app;
try {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
} catch (error) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase admin initialization error', error);
    throw error;
  }
  // すでに初期化されている場合は既存のアプリを使用
  app = admin.app();
}

// Firestoreデータベースの取得
const db = admin.firestore(app);

// Firebase Auth取得
const auth = admin.auth(app);

module.exports = { admin, db, auth }; 