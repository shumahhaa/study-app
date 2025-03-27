const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 環境変数のロード - NODE_ENV環境変数に応じた設定ファイルを読み込む
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
console.log(`Loading environment from ${envFile}`);
dotenv.config({ path: envFile });

// APIルーターのインポート
const openaiRoutes = require('./routes/openai');
const firestoreRoutes = require('./routes/firestore');
const authRoutes = require('./routes/auth');

// Expressアプリの初期化
const app = express();
const PORT = process.env.PORT || 5000;

// CORSの設定
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // 環境変数から読み込むか、デフォルト値を使用
  credentials: true, // 認証情報を含むリクエストを許可
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());

// ルートの設定
app.use('/api/openai', openaiRoutes);
app.use('/api/firestore', firestoreRoutes);
app.use('/api/auth', authRoutes);

// 基本ルート
app.get('/', (req, res) => {
  res.send('LearnTime API Server is running');
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS is enabled for: ${corsOptions.origin}`);
}); 