import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/CreateProfile';
import MyStats from './pages/MyStats';
import MyGroups from './pages/MyGroups';
import CompareStats from './pages/CompareStats';
import GroupStats from './pages/GroupStats';

const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-stats" element={<ProtectedRoute><MyStats /></ProtectedRoute>} />
          <Route path="/my-groups" element={<ProtectedRoute><MyGroups /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><CompareStats /></ProtectedRoute>} />
          <Route path="/group-stats" element={<ProtectedRoute><GroupStats /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>

  );
}

export default App;
