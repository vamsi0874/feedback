import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/login";
import PrivateRoute from "./utils/private-route";
import DashboardPage from "./pages/dashboard";
import FeedbacksPage from "./pages/feedbacks";
import FeedbackForm from "./components/feedback-form";
import UpdateEmployee from "./pages/update-employee";
import SignupPage from "./pages/signup";
import Navbar from "./components/navbar";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";


const App = () => {
  const { user } = useAuth();
  const navigate = useNavigate()
  useEffect(()=>{
    navigate('/dashboard')
  },[user])
  
  return (
    <div className="App">
      {user && <Navbar/>}
      <Routes>
         <Route path="/login" element={<LoginPage />} />
         <Route path="/signup" element={<SignupPage />} />
         <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
         <Route
          path="/feedbacks/:id"
          element={
            <PrivateRoute>
              <FeedbacksPage />
            </PrivateRoute>
          }
        />
         <Route
          path="/feedbacks/create"
          element={
            <PrivateRoute>
              <FeedbackForm />
            </PrivateRoute>
          }
        />
         <Route
          path="/feedbacks/update/:id"
          element={
            <PrivateRoute>
              <UpdateEmployee />
            </PrivateRoute>
          }
        />
       
      </Routes>
    </div>
  );
}

export default App;