// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import CadastroPaciente from './CadastroPaciente';
import { Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';

function Dashboard({ onLogout }) {
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Função para buscar as estatísticas de gênero e idade
  const buscarEstatisticas = async () => {
    try {
      setLoading(true);
      const usuariosRef = collection(db, 'usuarios');
      const snapshot = await getDocs(usuariosRef);
      let homens = 0, mulheres = 0, faixasEtarias = { '18-30': 0, '31-40': 0, '41-50': 0, '51+': 0 };

      snapshot.forEach((doc) => {
        const data = doc.data();
        // Contabilizar homens e mulheres
        if (data.sexo === 'Masculino') {
          homens++;
        } else if (data.sexo === 'Feminino') {
          mulheres++;
        }

        // Contabilizar faixas etárias
        const idade = new Date().getFullYear() - new Date(data.dataNascimento).getFullYear();
        if (idade >= 18 && idade <= 30) {
          faixasEtarias['18-30']++;
        } else if (idade >= 31 && idade <= 40) {
          faixasEtarias['31-40']++;
        } else if (idade >= 41 && idade <= 50) {
          faixasEtarias['41-50']++;
        } else if (idade > 50) {
          faixasEtarias['51+']++;
        }
      });

      setEstatisticas({ homens, mulheres, faixasEtarias });
      setLoading(false);
    } catch (error) {
      setError('Erro ao buscar estatísticas. Tente novamente.');
      setLoading(false);
    }
  };

  // Chama as estatísticas ao carregar o Dashboard
  useEffect(() => {
    buscarEstatisticas();
  }, []);

  // Função de logout
  const handleLogout = () => {
    signOut(auth).then(() => onLogout());
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Painel de Controle</Typography>
        <Button onClick={handleLogout} variant="outlined" color="secondary">
          Sair
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6">Estatísticas</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1">Homens: {estatisticas.homens}</Typography>
              <Typography variant="subtitle1">Mulheres: {estatisticas.mulheres}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Faixa Etária 18-30: {estatisticas.faixasEtarias['18-30']}</Typography>
              <Typography variant="subtitle1">Faixa Etária 31-40: {estatisticas.faixasEtarias['31-40']}</Typography>
              <Typography variant="subtitle1">Faixa Etária 41-50: {estatisticas.faixasEtarias['41-50']}</Typography>
              <Typography variant="subtitle1">Faixa Etária 51+: {estatisticas.faixasEtarias['51+']}</Typography>
            </Box>
          </Box>
        </Box>
      )}

      <CadastroPaciente onCadastro={() => {}} />
    </Box>
  );
}

export default Dashboard;
