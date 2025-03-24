# Study App Backend Server

スタディアプリ用のバックエンドサーバー

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Firebase Admin SDKの設定

Firebase Admin SDKを使用するために、サービスアカウントキーが必要です。

1. [Firebase Console](https://console.firebase.google.com/)にログイン
2. プロジェクトを選択
3. ⚙️ (設定アイコン) をクリック → 「プロジェクト設定」を選択
4. 「サービスアカウント」タブに移動
5. 「新しい秘密鍵の生成」ボタンをクリック
6. JSONファイルがダウンロードされます

ダウンロードしたJSONファイルから以下の情報を`.env`ファイルに追加してください：

```
FIREBASE_CLIENT_EMAIL=your-service-account-email@example.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC123...XYZ\n-----END PRIVATE KEY-----\n"
```

注意：privateKeyは改行コード(\n)を含む文字列で、ダブルクォーテーション(")で囲む必要があります。
JSONファイルからコピーする際は、privateKey部分の改行を直接\nに置き換えてください。

例：
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...EGd0=\n-----END PRIVATE KEY-----\n"
```

### 3. 環境変数の設定

`.env.example`ファイルを`.env`にコピーして必要な情報を入力します。

```bash
cp .env.example .env
```

### 4. サーバーの起動

開発モード（変更を監視して自動再起動）：
```bash
npm run dev
```

本番モード：
```bash
npm start
```

## API エンドポイント

### OpenAI

- `POST /api/openai/chat` - チャット応答の取得
- `POST /api/openai/generate-quiz` - クイズ生成

### Firestore

- `GET /api/firestore/review-quizzes` - 復習問題一覧取得
- `POST /api/firestore/review-quizzes` - 復習問題作成
- `PUT /api/firestore/review-quizzes/:id` - 復習問題更新
- `DELETE /api/firestore/review-quizzes/:id` - 復習問題削除
- `GET /api/firestore/study-sessions` - 学習履歴一覧取得
- `POST /api/firestore/study-sessions` - 学習履歴登録
- `DELETE /api/firestore/study-sessions/:id` - 学習履歴削除 