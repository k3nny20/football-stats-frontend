import React, { useState } from 'react';
import axios from 'axios';
import { Radar, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
  } from 'chart.js';
  
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
  );
  
  // Register ChartJS components
  ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);  

const CompareStats = () => {
  const [groupId, setGroupId] = useState('');
  const [groupStats, setGroupStats] = useState([]);
  const [error, setError] = useState('');
  const [players, setPlayers] = useState([]);
  const [compare, setCompare] = useState({ p1: '', p2: '' });
  const [chartType, setChartType] = useState('radar'); // default to radar

  const fetchGroupStats = async () => {
    setError('');
    setGroupStats([]);
    setPlayers([]);
    try {
      const res = await axios.get(`https://football-stats-backend-gyz8.onrender.com/api/stats/group/${groupId}`);
      setGroupStats(res.data);

      const uniquePlayers = [...new Set(res.data.map((s) => s.username))];
      setPlayers(uniquePlayers);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch group stats');
    }
  };

  const calculateLeaderboard = () => {
    const userTotals = {};

    groupStats.forEach((stat) => {
      const name = stat.username;
      if (!userTotals[name]) {
        userTotals[name] = {
          goals: 0,
          assists: 0,
          ratings: [],
        };
      }
      userTotals[name].goals += stat.goals || 0;
      userTotals[name].assists += stat.assists || 0;
      userTotals[name].ratings.push(parseFloat(stat.match_rating));
    });

    return Object.entries(userTotals).map(([username, data]) => ({
      username,
      goals: data.goals,
      assists: data.assists,
      avg_rating: (data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(2),
    }));
  };

  const getPlayerStats = (username) => {
    const matches = groupStats.filter((s) => s.username === username);
    if (!matches.length) return null;

    const totalGoals = matches.reduce((sum, s) => sum + s.goals, 0);
    const totalAssists = matches.reduce((sum, s) => sum + s.assists, 0);
    const avgRating = (
      matches.reduce((sum, s) => sum + parseFloat(s.match_rating), 0) / matches.length
    ).toFixed(2);

    return { totalGoals, totalAssists, avgRating, matches };
  };

  const p1Stats = getPlayerStats(compare.p1);
  const p2Stats = getPlayerStats(compare.p2);
  const radarData = {
    labels: ['Passing', 'Dribbling', 'Defending', 'Goals', 'Assists', 'Match Rating'],
    datasets: [
      {
        label: compare.p1,
        data: p1Stats ? [
          average(p1Stats.matches.map(m => m.pass_rating)),
          average(p1Stats.matches.map(m => m.dribbling_rating)),
          average(p1Stats.matches.map(m => m.defensive_rating)),
          average(p1Stats.matches.map(m => m.goals)),
          average(p1Stats.matches.map(m => m.assists)),
          average(p1Stats.matches.map(m => m.match_rating))
        ] : [],
        backgroundColor: 'rgba(55, 0, 60, 0.2)',
        borderColor: '#37003C',
        borderWidth: 2
      },
      {
        label: compare.p2,
        data: p2Stats ? [
          average(p2Stats.matches.map(m => m.pass_rating)),
          average(p2Stats.matches.map(m => m.dribbling_rating)),
          average(p2Stats.matches.map(m => m.defensive_rating)),
          average(p2Stats.matches.map(m => m.goals)),
          average(p2Stats.matches.map(m => m.assists)),
          average(p2Stats.matches.map(m => m.match_rating))
        ] : [],
        backgroundColor: 'rgba(147, 40, 181, 0.2)',
        borderColor: '#9328B5',
        borderWidth: 2
      }
    ]
  };
  
  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          color: '#444'
        },
        pointLabels: {
          color: '#111',
          font: {
            size: 14
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#111'
        }
      }
    }
  };

  const barData = {
    labels: ['Goals', 'Assists'],
    datasets: [
      {
        label: compare.p1,
        data: [p1Stats?.totalGoals || 0, p1Stats?.totalAssists || 0],
        backgroundColor: '#37003C'
      },
      {
        label: compare.p2,
        data: [p2Stats?.totalGoals || 0, p2Stats?.totalAssists || 0],
        backgroundColor: '#9328B5'
      }
    ]
  };
  
  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#111' }
      }
    }
  };  
  
  // Utility to calculate average
  function average(arr) {
    if (!arr.length) return 0;
    return (arr.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / arr.length).toFixed(2);
  }  

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#F4F4F4',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#37003C' }}>Compare Stats Within Group</h2>

      <input
        type="number"
        placeholder="Enter Group ID"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          marginRight: '1rem'
        }}
      />
      <button
        onClick={fetchGroupStats}
        style={{
          padding: '8px 16px',
          backgroundColor: '#37003C',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Load Group Stats
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr style={{ margin: '2rem 0' }} />

      {/* Leaderboard */}
      {groupStats.length > 0 && (
        <>
          <h3 style={{ color: '#37003C' }}>🏆 Group Leaderboard</h3>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
            backgroundColor: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead style={{ backgroundColor: '#37003C', color: 'white' }}>
              <tr>
                <th style={{ padding: '10px' }}>Username</th>
                <th>Total Goals</th>
                <th>Total Assists</th>
                <th>Avg. Rating</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>
              {calculateLeaderboard().map((player) => (
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

      {/* Player Comparison */}
      {players.length > 1 && (
        <>
          <hr style={{ margin: '2rem 0' }} />
          <h3 style={{ color: '#9328B5' }}>🆚 Compare Two Players</h3>
          <div>
            <select
              style={{
                padding: '8px',
                borderRadius: '4px',
                marginRight: '1rem'
              }}
              value={compare.p1}
              onChange={(e) => setCompare({ ...compare, p1: e.target.value })}
            >
              <option value="">Select Player 1</option>
              {players.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>

            <span style={{ margin: '0 1rem' }}>vs</span>

            <select
              style={{
                padding: '8px',
                borderRadius: '4px'
              }}
              value={compare.p2}
              onChange={(e) => setCompare({ ...compare, p2: e.target.value })}
            >
              <option value="">Select Player 2</option>
              {players.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {p1Stats && p2Stats && (
  <>
    {/* Toggle buttons */}
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <button
        onClick={() => setChartType('bar')}
        style={{
          padding: '8px 16px',
          backgroundColor: chartType === 'bar' ? '#9328B5' : '#eee',
          color: chartType === 'bar' ? '#fff' : '#000',
          border: 'none',
          borderRadius: '4px',
          marginRight: '1rem',
          cursor: 'pointer'
        }}
      >
        Bar Chart
      </button>
      <button
        onClick={() => setChartType('radar')}
        style={{
          padding: '8px 16px',
          backgroundColor: chartType === 'radar' ? '#9328B5' : '#eee',
          color: chartType === 'radar' ? '#fff' : '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Radar Chart
      </button>
    </div>

    {/* Chart container */}
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h4 style={{ textAlign: 'center', color: '#37003C' }}>
        {chartType === 'radar' ? 'Radar Comparison' : 'Goals & Assists Comparison'}
      </h4>
      {chartType === 'radar' ? (
        <Radar data={radarData} options={radarOptions} />
      ) : (
        <Bar data={barData} options={barOptions} />
      )}
    </div>

    {/* Stat comparison table */}
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <thead style={{ backgroundColor: '#9328B5', color: 'white' }}>
        <tr>
          <th style={{ padding: '10px' }}>Stat</th>
          <th>{compare.p1}</th>
          <th>{compare.p2}</th>
        </tr>
      </thead>
      <tbody style={{ textAlign: 'center' }}>
        <tr>
          <td style={{ padding: '10px' }}>Total Goals</td>
          <td>{p1Stats.totalGoals}</td>
          <td>{p2Stats.totalGoals}</td>
        </tr>
        <tr>
          <td>Total Assists</td>
          <td>{p1Stats.totalAssists}</td>
          <td>{p2Stats.totalAssists}</td>
        </tr>
        <tr>
          <td>Avg. Rating</td>
          <td>{p1Stats.avgRating}</td>
          <td>{p2Stats.avgRating}</td>
        </tr>
      </tbody>
    </table>
  </>
)}

        </>
      )}
    </div>
  );
};

export default CompareStats;
