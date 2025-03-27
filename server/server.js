const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 環境変数のロード
if (process.env.NODE_ENV !== 'production') {
  // 開発環境の場合のみ .env ファイルを読み込む
  console.log('Loading environment from .env file for development');
  dotenv.config();
} else {
  console.log('Using production environment variables');
}

// APIルーターのインポート
const openaiRoutes = require('./routes/openai');
const firestoreRoutes = require('./routes/firestore');
const authRoutes = require('./routes/auth');

// Expressアプリの初期化
const app = express();
const PORT = process.env.PORT || 5000;

// CORSの設定
const corsOptions = {
  origin: function (origin, callback) {
    // 環境変数から許可されたオリジンを取得（カンマ区切り）
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
    
    // originがundefinedの場合はローカルリクエスト
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
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