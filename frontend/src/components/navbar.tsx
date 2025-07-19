import {  useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  // console.log("User:", user);
  const { logout } = useAuth();
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    navigate('/login')
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <h1 onClick={()=>navigate('/dashboard')} className="text-2xl font-bold text-gray-800 cursor-pointer">Feedback App</h1>

      <div className="flex items-center gap-6">
        {user && (
          <p className="text-gray-700 font-medium">
            Welcome, <span className="font-semibold">{user.name}</span>
          </p>
        )}

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
