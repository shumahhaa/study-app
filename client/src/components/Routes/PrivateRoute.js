import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute; 