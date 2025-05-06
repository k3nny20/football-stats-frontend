import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs'; // 👈 this formats data correctly
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        'https://football-stats-backend-gyz8.onrender.com/api/auth/login',
        qs.stringify(form),
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      const userData = response.data;
      login(userData);
  
      try {
        await axios.get(`https://football-stats-backend-gyz8.onrender.com/api/profile/${userData.id}`);
        navigate('/dashboard');
      } catch (profileErr) {
        if (profileErr.response?.status === 404) {
          navigate('/create-profile');
        } else {
          throw profileErr;
        }
      }
    } catch (err) {
      console.error(err);
  
      if (err.response?.status === 401) {
        setError('❌ Invalid username or password.');
      } else {
        setError('❌ Something went wrong. Please try again.');
      }
    }
  };
  
  
  

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
