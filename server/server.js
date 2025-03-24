const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 環境変数のロード
dotenv.config();

// APIルーターのインポート
const openaiRoutes = require('./routes/openai');
const firestoreRoutes = require('./routes/firestore');
const authRoutes = require('./routes/auth');

// Expressアプリの初期化
const app = express();
const PORT = process.env.PORT || 5000;

// CORS設定を明示的に行う
app.use(cors({
  origin: 'http://localhost:3002', // クライアントのURL
  credentials: true, // 認証情報を含むリクエストを許可
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ルートの設定
app.use('/api/openai', openaiRoutes);
app.use('/api/firestore', firestoreRoutes);
app.use('/api/auth', authRoutes);

// 基本ルート
app.get('/', (req, res) => {
  res.send('Study App API Server is running');
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 