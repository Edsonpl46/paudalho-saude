import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function CadastroPaciente({ onCadastro }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [error, setError] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      const pacienteRef = doc(db, 'pacientes', cpf); // Usando CPF como identificador único
      await setDoc(pacienteRef, {
        nome,
        cpf,
        telefone,
        dataNascimento,
        sexo,
        criadoEm: new Date()
      });

      // Limpar campos e mostrar sucesso
      setNome('');
      setCpf('');
      setTelefone('');
      setDataNascimento('');
      setSexo('');
      setError('');
      alert('Paciente cadastrado com sucesso!');
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
        <TextField
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Data de Nascimento"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          fullWidth
          margin="normal"
          type="date"
          required
        />

        {/* Campo Sexo com opções Masculino e Feminino */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Sexo</InputLabel>
          <Select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            label="Sexo"
          >
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Feminino">Feminino</MenuItem>
          </Select>
          {/* Opcional: Você pode adicionar uma mensagem de erro abaixo, caso necessário */}
          {!sexo && <FormHelperText error>Este campo é obrigatório</FormHelperText>}
        </FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Cadastrar
        </Button>
      </form>
    </Box>
  );
}

export default CadastroPaciente;
