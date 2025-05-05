import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/profile/${user.id}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };

    if (user?.id) fetchProfile();
  }, [user]);

  const getEmoji = (type) => {
    switch (type) {
      case 'Playmaker': return '🧠';
      case 'Finisher': return '🎯';
      case 'All-Rounder': return '🧱';
      case 'Ball Winner': return '🛡️';
      case 'Dribbler': return '⚡';
      default: return '';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome back, {user.username}</h2>
      {profile ? (
        <>
          <p><strong>Preferred Position:</strong> {profile.preferred_position}</p>
          <p><strong>Preferred Foot:</strong> {profile.preferred_foot}</p>
          <p><strong>Player Type:</strong>{' '}
            <span style={{
              backgroundColor: '#F0E6FF',
              color: '#37003C',
              padding: '6px 12px',
              borderRadius: '12px',
              fontWeight: 'bold',
              display: 'inline-block',
              marginLeft: '8px'
            }}>
              {profile.player_type} {getEmoji(profile.player_type)}
            </span>
          </p>
        </>
      ) : (
        <p>Loading your profile...</p>
      )}
    </div>
  );
};

export default Dashboard;