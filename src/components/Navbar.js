import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Fantasy Friend League</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {user && <Link to="/my-stats">My Stats</Link>}
        {user && <Link to="/my-groups">My Groups</Link>}
        {user && <Link to="/group-stats">Group Stats</Link>}
        {user && <Link to="/compare">Compare Stats</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/signup">Sign Up</Link>}
        {user && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
