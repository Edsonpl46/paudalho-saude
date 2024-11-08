// src/components/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error) {
      setError('Erro ao realizar login. Verifique as credenciais.');
    }
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Entrar
        </Button>
      </form>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          Não tem uma conta?{' '}
          <Link component="button" onClick={navigateToSignup} sx={{ cursor: 'pointer' }}>
            Crie sua conta aqui.
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;
