import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Certifique-se de que o JSON Server está rodando aqui

// Função para obter todos os usuários
export const getUsuarios = async () => {
  const response = await axios.get(`${API_URL}/usuarios`);
  return response.data;
};

// Função para adicionar um novo usuário
export const addUsuario = async (usuario) => {
  const response = await axios.post(`${API_URL}/usuarios`, usuario);
  return response.data;
};

// Função para fazer login com email e senha
export const loginUsuario = async (email, senha) => {
  const response = await axios.get(`${API_URL}/usuarios`, {
    params: { email, senha }
  });
  return response.data.length ? response.data[0] : null;
};

// Função para obter todos os pacientes
export const getPacientes = async () => {
  const response = await axios.get(`${API_URL}/pacientes`);
  return response.data;
};

// Função para adicionar um novo paciente
export const addPaciente = async (paciente) => {
  const response = await axios.post(`${API_URL}/pacientes`, paciente);
  return response.data;
};

// Função para atualizar um paciente
export const updatePaciente = async (paciente) => {
  try {
    const response = await axios.put(`${API_URL}/pacientes/${paciente.cpf}`, paciente);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    throw error;
  }
};

// Função para excluir um paciente
export const deletePaciente = async (cpf) => {
  try {
    const response = await axios.delete(`${API_URL}/pacientes/${cpf}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir paciente:", error);
    throw error;
  }
};

// Função para registrar um novo usuário, garantindo que o email não exista
export const registerUsuario = async (usuario) => {
  try {
    // Verifica se o email já existe no banco de dados
    const existingUser = await axios.get(`${API_URL}/usuarios`, {
      params: { email: usuario.email }
    });

    if (existingUser.data.length > 0) {
      throw new Error('Usuário com este email já está cadastrado.');
    }

    // Se o email não existir, adiciona o novo usuário
    const response = await axios.post(`${API_URL}/usuarios`, usuario);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Erro ao registrar usuário.');
  }
};
