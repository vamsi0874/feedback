


import {  Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import CreateAssignment from './pages/Teacher/CreateAssignment';
import ViewSubmissions from './pages/Teacher/ViewSubmissions';
import SubmitAssignment from './pages/Student/SubmitAssignment';

import Navbar from './components/navbar';
import PrivateRoute from './utils/private-route';
import Home from './components/Home';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { user } = useAuth();
  return (
     <div>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
       
          <Route path="/create-assignment" element={<PrivateRoute><CreateAssignment /></PrivateRoute>} />
          <Route path="/view-submissions" element={<PrivateRoute><ViewSubmissions /></PrivateRoute>} />
          <Route path="/submit-assignment/:id" element={<PrivateRoute><SubmitAssignment /></PrivateRoute>} />
       
      </Routes>
    </div>
  );
};

export default App;