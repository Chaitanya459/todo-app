import React, { useEffect, useState } from 'react';
import { Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import TaskForm from '../components/TaskForm';

const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTasks(res.data);
      } catch (error) {
        alert('Failed to fetch tasks!');
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      alert('Failed to delete task!');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Tasks</h1>
      <TaskForm editingTask={editingTask} setEditingTask={setEditingTask} setTasks={setTasks} />
      <List>
        {tasks.map(task => (
          <ListItem key={task._id}>
            <ListItemText primary={task.text} />
            <IconButton onClick={() => setEditingTask(task)}><Edit /></IconButton>
            <IconButton onClick={() => handleDelete(task._id)}><Delete /></IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodoPage;