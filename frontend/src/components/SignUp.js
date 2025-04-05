import React, { useState } from 'react';
import { TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    // Basic email format check
    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }
    setError(null);

    // Send registration request to API
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        // Registration successful
        // Optionally, auto-login here by calling context.login with returned token.
        // But we'll require the user to log in manually for clarity.
        navigate('/login');
        alert("Registration successful! Please log in.");
      } else {
        // Handle errors
        const data = await res.json();
        console.log("Login response:", res.status, data);
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Sign Up
      </Typography>
      {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Name" 
          fullWidth 
          margin="normal" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
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
          Sign Up
        </Button>
      </form>
      <Typography variant="body2" textAlign="center" style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Log In</Link>
      </Typography>
    </div>
  );
}

export default SignUp;
