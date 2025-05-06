import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CreateProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    preferred_position: '',
    preferred_foot: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://football-stats-backend-gyz8.onrender.com/api/profile/create', {
        user_id: user.id, // assuming user.id is stored
        preferred_position: form.preferred_position,
        preferred_foot: form.preferred_foot
      });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Profile creation failed. You may have already created a profile.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create Your Player Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Preferred Position:</label><br />
        <select name="preferred_position" value={form.preferred_position} onChange={handleChange} required>
          <option value="">--Select--</option>
          <option value="ST">ST</option>
          <option value="CAM">CAM</option>
          <option value="CM">CM</option>
          <option value="CB">CB</option>
          <option value="RW">RW</option>
          <option value="LB">LB</option>
          <option value="GK">GK</option>
        </select><br /><br />

        <label>Preferred Foot:</label><br />
        <select name="preferred_foot" value={form.preferred_foot} onChange={handleChange} required>
          <option value="">--Select--</option>
          <option value="Right">Right</option>
          <option value="Left">Left</option>
          <option value="Both">Both</option>
        </select><br /><br />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default CreateProfile;
