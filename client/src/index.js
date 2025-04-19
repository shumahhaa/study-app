import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// デバッグ用：環境変数の値をコンソールに表示
console.log('環境変数一覧:', {
  REACT_APP_MAX_USAGE_COUNT: process.env.REACT_APP_MAX_USAGE_COUNT,
  REACT_APP_SELECTED_MODEL: process.env.REACT_APP_SELECTED_MODEL,
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
