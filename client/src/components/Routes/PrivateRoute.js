import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { DelayedLoader } from "../Common";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  return (
    <>
      <DelayedLoader loading={loading}>
        <div className="loading">読み込み中...</div>
      </DelayedLoader>
      
      {!loading && (
        currentUser ? children : <Navigate to="/login" />
      )}
    </>
  );
};

export default PrivateRoute; 