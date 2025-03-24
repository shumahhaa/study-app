import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import '../styles/AuthPages.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await register(email, password);
      setVerificationMessage(true);
      // メール認証案内を表示するためナビゲーションはしない
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!email || !password) {
      setError('必須項目を入力してください');
      return false;
    }
    
    if (password !== passwordConfirm) {
      setError('パスワードが一致しません');
      return false;
    }
    
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return false;
    }
    
    return true;
  };

  // メール認証メッセージ
  const [verificationMessage, setVerificationMessage] = useState(false);

  // 登録成功後、認証メッセージを表示
  if (verificationMessage) {
    return (
      <Layout>
        <div className="auth-container">
          <div className="auth-card registration-success">
            <h1>登録完了</h1>
            <div className="verification-message">
              <p>
                <strong>{email}</strong> 宛に認証メールを送信しました。
              </p>
              <p>
                メール内のリンクをクリックして登録を完了してください。
              </p>
              <p>
                認証後、以下のボタンからログインページに進むことができます。
              </p>
            </div>
            <div className="auth-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/login')}
              >
                ログインページへ
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-card">
          <h1>新規アカウント登録</h1>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">メールアドレス</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">パスワード</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6文字以上のパスワード"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="passwordConfirm">パスワード（確認）</label>
              <input
                type="password"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="パスワードをもう一度入力"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? '登録中...' : '登録する'}
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              すでにアカウントをお持ちの方は
              <Link to="/login">ログイン</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage; 