import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const { user } = useAuth();
   const isAuthenticated = !!user
   if (!isAuthenticated) {
    navigate('/login')
   }
 
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
