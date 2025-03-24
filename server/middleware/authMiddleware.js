const { auth } = require('../config/firebase');

/**
 * Firebase認証トークンを検証するミドルウェア
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '認証トークンが提供されていません' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('認証エラー:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: '認証トークンの有効期限が切れています', code: 'token-expired' });
    }
    
    return res.status(401).json({ error: '認証に失敗しました', code: 'authentication-failed' });
  }
};

module.exports = { verifyToken }; 