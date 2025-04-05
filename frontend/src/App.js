import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import SignUp from './components/SignUp';
import Login from './components/Login';
import TodoList from './components/TodoList';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={ user ? <Navigate to="/tasks" /> : <Navigate to="/login" /> } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      {/* Protect the tasks route: if no user (not logged in), redirect to /login */}
      <Route path="/tasks" element={
        user ? <TodoList /> : <Navigate to="/login" />
      } />
    </Routes>
  );
}

export default App;
