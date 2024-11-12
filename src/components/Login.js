import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Link } from '@mui/material';
import { loginUsuario } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const usuario = await loginUsuario(email, senha);
      if (usuario) {
        onLogin(usuario);
      } else {
        setError('Credenciais inválidas.');
      }
    } catch (error) {
      setError('Erro ao fazer login.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextField label="Email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Senha" type="password" fullWidth required value={senha} onChange={(e) => setSenha(e.target.value)} />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Entrar</Button>
      </form>
      <Box sx={{ marginTop: 2 }}>
        <Typography>Não possui uma conta? <Link onClick={() => navigate('/register')}>Crie uma conta</Link></Typography>
      </Box>
    </Box>
  );
}

export default Login;
