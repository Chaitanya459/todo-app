import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import API_BASE_URL from '../config';


function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    // //   const data = await res.json();
    // //   if (res.ok) {
    // //     // Successful login: data contains token and user info
    // //     login(data.token, data.user);  // update context
    // //     navigate('/tasks');
    // //   } else {
    // //     // Login failed (invalid creds)
    // //     setError(data.message || "Invalid email or password");
    //   }
    const data = await res.json();
console.log("Login response:", res.status, data); 

if (res.ok) {
  login(data.token, data.user);
  navigate('/tasks');
} else {
  setError(data.message || "Invalid email or password");
}

    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Log In
      </Typography>
      {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Email" 
          type="email" 
          fullWidth 
          margin="normal" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <TextField 
          label="Password" 
          type="password" 
          fullWidth 
          margin="normal" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '1rem' }}>
          Log In
        </Button>
      </form>
      <Typography variant="body2" textAlign="center" style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </Typography>
    </div>
  );
}

export default Login;
