# LearnTime

学習管理と復習クイズ生成のためのアプリケーション

## 環境構築

### フロントエンド（Reactアプリ）

1. 依存関係をインストール

```bash
npm install
```

2. 開発サーバーを起動

```bash
npm start
```

### バックエンド（Expressサーバー）

1. バックエンドディレクトリに移動

```bash
cd server
```

2. 依存関係をインストール

```bash
npm install
```

3. 環境変数の設定
   - `.env.example`ファイルを`.env`にコピー
   - 必要な認証情報を入力（Firebaseサービスアカウントキー等）

4. バックエンドサーバーを起動

```bash
npm run dev
```

## 機能

- 学習トピックと学習時間の記録
- AIチャットアシスタント（OpenAI API使用）
- チャット履歴からの復習問題自動生成
- 間隔復習のスケジュール管理

## 技術スタック

### フロントエンド
- React
- Katex（数式表示）
- React Router

### バックエンド
- Node.js
- Express
- Firebase Admin SDK（Firestore）
- OpenAI API

## バックエンドAPIの使用方法

アプリケーションはバックエンドAPIを通じてデータの読み書きと外部APIへのアクセスを行います。主なエンドポイントは以下の通りです：

### OpenAI API

- `POST /api/openai/chat` - チャット応答の生成
- `POST /api/openai/generate-quiz` - 学習内容からのクイズ生成

### Firestore API

- `GET /api/firestore/review-quizzes` - 復習問題の一覧取得
- `POST /api/firestore/review-quizzes` - 新しい復習問題の作成
- `PUT /api/firestore/review-quizzes/:id` - 復習問題の更新
- `DELETE /api/firestore/review-quizzes/:id` - 復習問題の削除

```