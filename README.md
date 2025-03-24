# Study App

学習管理と復習クイズ生成のためのReactアプリケーション

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
- 学習履歴からの復習問題自動生成
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

APIを利用するには、`.env`ファイルに`REACT_APP_API_BASE_URL`を設定してください：

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
