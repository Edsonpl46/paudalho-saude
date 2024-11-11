import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const navigate = useNavigate();

  // Função de validação de senha
  const validarSenha = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(senha);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Verificar se a senha é válida
    if (!validarSenha(senha)) {
      setSenhaError('A senha deve ter pelo menos 8 caracteres e incluir letras e números.');
      return;
    } else {
      setSenhaError('');
    }

    try {
      const response = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, cpf, telefone, email, senha }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        navigate('/login');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      setError('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Criar Conta</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {senhaError && <Alert severity="error">{senhaError}</Alert>}
      <form onSubmit={handleSignup}>
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <TextField
          label="CPF"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
        <TextField
          label="Telefone"
          variant="outlined"
          fullWidth
          margin="normal"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
        />
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
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Criar Conta
        </Button>
      </form>
    </Box>
  );
}

export default Signup;
