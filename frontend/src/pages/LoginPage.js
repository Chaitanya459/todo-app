import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', values);
      localStorage.setItem('token', res.data.token);
      navigate('/tasks');
    } catch (error) {
      alert('Login failed!');
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Login</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange }) => (
          <Form>
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
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default LoginPage;