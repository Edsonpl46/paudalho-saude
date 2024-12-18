import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function CadastroPaciente() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [error, setError] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/pacientes`, {
        nome,
        cpf,
        telefone,
        dataNascimento,
        sexo,
        criadoEm: new Date()
      });
      alert('Paciente cadastrado com sucesso!');
      setNome('');
      setCpf('');
      setTelefone('');
      setDataNascimento('');
      setSexo('');
      setError('');
    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error);
      setError('Erro ao cadastrar paciente. Tente novamente.');
    }
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h6">Cadastrar Paciente</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleCadastro}>
        <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth margin="normal" required />
        <TextField label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} fullWidth margin="normal" required />
        <TextField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} fullWidth margin="normal" required />
        <TextField label="Data de Nascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} fullWidth margin="normal" type="date" required />
        <TextField label="Sexo" value={sexo} onChange={(e) => setSexo(e.target.value)} fullWidth margin="normal" required />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Cadastrar
        </Button>
      </form>
    </Box>
  );
}

export default CadastroPaciente;
