// 現在のパスに基づいてアクティブなリンクを判定
export const isActive = (currentPath, targetPath) => {
  return currentPath === targetPath;
};

// 認証ページかどうかを判定
export const isAuthPage = (path) => {
  const authPaths = ['/login', '/register', '/reset-password'];
  return authPaths.includes(path);
}; 