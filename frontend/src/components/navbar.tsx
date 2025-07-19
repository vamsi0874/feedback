import {  useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth();

  const { logout } = useAuth();
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    navigate('/login')
  };

  return (
    <nav className="bg-white text-black px-6 py-4 flex justify-between items-center border-b-2 border-gray-200">
      <Link to='/'><h1 className="text-xl font-bold">Assignment Portal</h1></Link>
      <ul className="flex space-x-6">
        {/* {user?.role === 'teacher' && (
          <>
            <li>
              <Link to="/create-assignment" className="hover:underline">
                Create Assignment
              </Link>
            </li>
            <li>
              <Link to="/view-submissions" className="hover:underline">
                View Submissions
              </Link>
            </li>
          </>
        )} */}

        {user?.role === 'student' && (
          <>
            {/* <li>
              <Link to="/submit-assignment" className="hover:underline">
                Submit Assignment
              </Link>
            </li> */}
          </>
        )}
      </ul>
      <button onClick={handleLogout} className=" text-black p-2 rounded-md cursor-pointer">Logout</button>
    </nav>
  );
};

export default Navbar;
