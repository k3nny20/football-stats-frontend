import React, { useState } from 'react';
import axios from 'axios';

const GroupStats = () => {
  const [groupId, setGroupId] = useState('');
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setError('');
    setStats([]);

    try {
      const res = await axios.get(`http://localhost:8080/api/stats/group/${groupId}`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError('❌ Could not fetch group stats. Is the Group ID valid?');
    }
  };

  const calculateTotals = () => {
    const totals = {};

    stats.forEach((s) => {
      if (!totals[s.username]) {
        totals[s.username] = {
          goals: 0,
          assists: 0,
          ratings: [],
        };
      }
      totals[s.username].goals += s.goals;
      totals[s.username].assists += s.assists;
      totals[s.username].ratings.push(parseFloat(s.match_rating));
    });

    return Object.entries(totals).map(([username, data]) => ({
      username,
      goals: data.goals,
      assists: data.assists,
      avg_rating: (data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(2),
    }));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Group Stats</h2>

      <input
        type="number"
        placeholder="Enter Group ID"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        style={{ padding: '8px', marginRight: '1rem' }}
      />
      <button onClick={fetchStats}>Load Stats</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stats.length > 0 && (
        <>
          <h3>Leaderboard</h3>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#37003C', color: 'white' }}>
              <tr>
                <th style={{ padding: '10px' }}>Username</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Avg. Match Rating</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>
              {calculateTotals().map((player) => (
                <tr key={player.username}>
                  <td style={{ padding: '10px' }}>{player.username}</td>
                  <td>{player.goals}</td>
                  <td>{player.assists}</td>
                  <td>{player.avg_rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default GroupStats;
