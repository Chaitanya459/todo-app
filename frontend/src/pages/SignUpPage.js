import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const SignUpPage = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too short!').required('Required'),
  });

  const handleSubmit = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/register', values);
      navigate('/login');
    } catch (error) {
      alert('Signup failed!');
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Sign Up</h1>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange }) => (
          <Form>
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              onChange={handleChange}
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              onChange={handleChange}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              onChange={handleChange}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
            />
            <Button type="submit" variant="contained" color="primary">
              Sign Up
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SignUpPage;