import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { registerUsuario } from '../services/api';

function Registro({ onRegistro }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validação simples dos campos (adicionar outras validações conforme necessário)
    if (cpf.length !== 11) {
      setError('CPF deve ter 11 dígitos.');
      return;
    }
    
    try {
      const usuario = await registerUsuario({ nome, cpf, email, senha });
      setSuccess('Usuário registrado com sucesso!');
      onRegistro(usuario);  // Notifica o componente pai sobre o registro
    } catch (error) {
      setError(error.message || 'Erro ao registrar usuário.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>Registro</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleRegistro}>
        <TextField
          label="Nome Completo"
          fullWidth
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="CPF"
          fullWidth
          required
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 11 }}
        />
        <TextField
          label="Email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Registrar
        </Button>
      </form>
    </Box>
  );
}

export default Registro;
