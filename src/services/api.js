import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Certifique-se de que o JSON Server está rodando aqui

export const getUsuarios = async () => {
  const response = await axios.get(`${API_URL}/usuarios`);
  return response.data;
};

export const addUsuario = async (usuario) => {
  const response = await axios.post(`${API_URL}/usuarios`, usuario);
  return response.data;
};

export const loginUsuario = async (email, senha) => {
  const response = await axios.get(`${API_URL}/usuarios`, {
    params: { email, senha }
  });
  return response.data.length ? response.data[0] : null;
};

export const getPacientes = async () => {
  const response = await axios.get(`${API_URL}/pacientes`);
  return response.data;
};

export const addPaciente = async (paciente) => {
  const response = await axios.post(`${API_URL}/pacientes`, paciente);
  return response.data;
};
