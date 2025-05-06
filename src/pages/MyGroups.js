import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyGroups = () => {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`https://football-stats-backend-gyz8.onrender.com/api/groups/user/${user.id}`);
        setGroups(res.data);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };

    if (user?.id) fetchGroups();
  }, [user]);

  const handleJoinGroup = async () => {
    try {
      const res = await axios.post('https://football-stats-backend-gyz8.onrender.com/api/groups/join', {
        user_id: user.id,
        group_id: parseInt(groupId)
      });

      setMessage(res.data.message || 'Joined group successfully');
      setGroupId('');

      // Refresh group list
      const updated = await axios.get(`https://football-stats-backend-gyz8.onrender.com/api/groups/user/${user.id}`);
      setGroups(updated.data);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message === 'You are already in this group.') {
        setMessage('⚠️ You are already in this group.');
      } else {
        setMessage('❌ Failed to join group. Make sure the Group ID is correct.');
      }
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name) {
      setMessage('Group name is required.');
      return;
    }

    try {
      const res = await axios.post('https://football-stats-backend-gyz8.onrender.com/api/groups/create', {
        name: newGroup.name,
        description: newGroup.description,
        user_id: user.id
      });

      setMessage(res.data.message || 'Group created successfully!');
      setNewGroup({ name: '', description: '' });

      // Refresh group list
      const updated = await axios.get(`https://football-stats-backend-gyz8.onrender.com/api/groups/user/${user.id}`);
      setGroups(updated.data);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to create group.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Groups</h2>

      {/* Create Group Form */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Create a Group</h3>
        <input
          type="text"
          placeholder="Group Name"
          value={newGroup.name}
          onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
          style={{ padding: '6px', marginRight: '1rem' }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newGroup.description}
          onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
          style={{ padding: '6px', marginRight: '1rem' }}
        />
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>

      {/* Join Group Form */}
      <div style={{ marginBottom: '1rem' }}>
        <h3>Join Group by ID</h3>
        <input
          type="number"
          placeholder="Enter Group ID"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          style={{ padding: '6px', marginRight: '1rem' }}
        />
        <button onClick={handleJoinGroup}>Join Group</button>
      </div>

      {message && <p>{message}</p>}

      <ul>
        {groups.map((g) => (
          <li key={g.id}>
            <strong>{g.name}</strong> — {g.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyGroups;
