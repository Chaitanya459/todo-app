import React, { useEffect, useState, useContext } from 'react';
import { Typography, List, ListItem, IconButton, ListItemText, Checkbox, Tooltip } from '@mui/material';
import { Edit, Delete, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import TaskForm from './TaskForm';
import { Button } from '@mui/material';
import API_BASE_URL from '../config';


function TodoList() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
    
      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        } else if (res.status === 401) {
          // Token invalid or expired – log out
          logout();
          navigate('/login');
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    if (token) {
      fetchTasks();
    }
  }, [token, logout, navigate]);

  const handleAddTask = async (text) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: text })
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks(prev => [...prev, newTask]);
      } else {
        const data = await res.json();
        setError(data.message || "Could not add task");
      }
    } catch (err) {
      console.error("Error adding task:", err);
      setError("An error occurred while adding the task");
    }
  };

  const handleUpdateTask = async (text) => {
    if (!editingTask) return;
    const taskId = editingTask._id;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: text })
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(prev => prev.map(t => t._id === taskId ? updatedTask : t));
        setEditingTask(null);
      } else {
        const data = await res.json();
        setError(data.message || "Could not update task");
      }
    } catch (err) {
      console.error("Error updating task:", err);
      setError("An error occurred while updating the task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t._id !== taskId));
      } else {
        const data = await res.json();
        setError(data.message || "Could not delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("An error occurred while deleting the task");
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Hello, {user?.name || 'User'}! Here are your tasks:
      </Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}
      {/* Task Form for adding new tasks or editing existing one */}
      <TaskForm 
        onSubmit={editingTask ? handleUpdateTask : handleAddTask} 
        onCancel={editingTask ? cancelEditing : null} 
        initialTask={editingTask} 
      />
      {/* List of tasks */}
      <List>
        {tasks.map(task => (
          <ListItem 
            key={task._id} 
            secondaryAction={
              <div>
                <IconButton edge="end" aria-label="edit" onClick={() => startEditing(task)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task._id)}>
                  <Delete />
                </IconButton>
              </div>
            }
          >
            {/* Checkbox to mark complete (optional functionality) */}
            <Checkbox 
              edge="start"
              checked={task.completed || false}
              tabIndex={-1}
              disableRipple
              onChange={() => { /* toggling complete could be implemented */ }}
            />
            <ListItemText primary={task.title} />
          </ListItem>
        ))}
      </List>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Tooltip title="Logout">
          <Button variant="outlined" color="secondary" startIcon={<Logout />} onClick={handleLogout}>
            Logout
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default TodoList;
