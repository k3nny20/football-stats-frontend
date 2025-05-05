import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const MyStats = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    group_id: '',
    goals: '',
    assists: '',
    pass_rating: '',
    dribbling_rating: '',
    defensive_rating: '',
    positions: '',
    match_date: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [myStats, setMyStats] = useState([]);

  // ✅ Fetch user's stats after login
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/stats/user/${user.id}`);
        setMyStats(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load your stats');
      }
    };

    if (user?.id) {
      fetchStats();
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.post('http://localhost:8080/api/stats/submit', {
        user_id: user.id,
        ...form
      });

      setMessage('✅ Match performance submitted!');
      setForm({
        group_id: '',
        goals: '',
        assists: '',
        pass_rating: '',
        dribbling_rating: '',
        defensive_rating: '',
        positions: '',
        match_date: ''
      });

      // Refresh stat list
      const res = await axios.get(`http://localhost:8080/api/stats/user/${user.id}`);
      setMyStats(res.data);
    } catch (err) {
      console.error(err);
      setError('Submission failed. Please check your inputs.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Submit Match Performance</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Group ID:</label><br />
        <input type="number" name="group_id" value={form.group_id} onChange={handleChange} required /><br /><br />

        <label>Goals:</label><br />
        <input type="number" name="goals" value={form.goals} onChange={handleChange} /><br /><br />

        <label>Assists:</label><br />
        <input type="number" name="assists" value={form.assists} onChange={handleChange} /><br /><br />

        <label>Pass Rating (0–10):</label><br />
        <input type="number" step="0.1" name="pass_rating" value={form.pass_rating} onChange={handleChange} required /><br /><br />

        <label>Dribbling Rating (0–10):</label><br />
        <input type="number" step="0.1" name="dribbling_rating" value={form.dribbling_rating} onChange={handleChange} required /><br /><br />

        <label>Defensive Rating (0–10):</label><br />
        <input type="number" step="0.1" name="defensive_rating" value={form.defensive_rating} onChange={handleChange} required /><br /><br />

        <label>Positions Played:</label><br />
        <input type="text" name="positions" value={form.positions} onChange={handleChange} required /><br /><br />

        <label>Match Date:</label><br />
        <input type="date" name="match_date" value={form.match_date} onChange={handleChange} required /><br /><br />

        <button type="submit">Submit Stats</button>
      </form>

      <hr />

      <h3>📊 My Past Performances</h3>
      {myStats.length > 0 ? (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Date</th>
              <th>Group</th>
              <th>Goals</th>
              <th>Assists</th>
              <th>Pass</th>
              <th>Dribbling</th>
              <th>Defending</th>
              <th>Rating</th>
              <th>Positions</th>
            </tr>
          </thead>
          <tbody>
            {myStats.map((stat) => (
              <tr key={stat.id}>
                <td>{new Date(stat.match_date).toLocaleDateString()}</td>
                <td>{stat.group_id}</td>
                <td>{stat.goals}</td>
                <td>{stat.assists}</td>
                <td>{stat.pass_rating}</td>
                <td>{stat.dribbling_rating}</td>
                <td>{stat.defensive_rating}</td>
                <td><strong>{stat.match_rating}</strong></td>
                <td>{stat.positions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No stats submitted yet.</p>
      )}
    </div>
  );
};

export default MyStats;
