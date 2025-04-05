import { useEffect, useState } from 'react';
import { 
  Container, 
  CircularProgress,
  Typography,
  Box,
  useMediaQuery
} from '@mui/material';
import TaskList from '../components/TodoList';
import TaskForm from '../components/TaskForm'; 
import Notification from '../components/Notification';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
    <Notification message="Task updated successfully" severity="success" />;
  };

  return (
    <Container maxWidth={isMobile ? 'sm' : 'md'} sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Tasks
        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </Typography>

      <TaskForm 
        onTaskCreate={(newTask) => {
          setTasks([...tasks, newTask]);
          <Notification message="Task created!" severity="success" />;
        }}
      />

      {error && <Notification message={error} severity="error" />}

      <Box mt={4}>
        {tasks.length === 0 && !loading ? (
          <Typography variant="body1" color="textSecondary">
            No tasks found. Start by creating a new task!
          </Typography>
        ) : (
          <TaskList 
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={(deletedId) => {
              setTasks(tasks.filter(task => task._id !== deletedId));
              <Notification message="Task deleted" severity="info" />;
            }}
          />
        )}
      </Box>
    </Container>
  );
};