// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

const dataPath = path.join(__dirname, 'data.json');

// Middleware para processar o corpo das requisições como JSON
app.use(bodyParser.json());

// Função para ler dados do arquivo JSON
function readData() {
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
}

// Função para escrever dados no arquivo JSON
function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Rota para cadastrar um novo usuário
app.post('/usuarios', (req, res) => {
  const { nome, cpf, telefone, email, senha } = req.body;
  
  if (!nome || !cpf || !telefone || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const data = readData();
  const usuarioExistente = data.usuarios.find(usuario => usuario.cpf === cpf || usuario.telefone === telefone || usuario.email === email);
  
  if (usuarioExistente) {
    return res.status(400).json({ error: 'Usuário já cadastrado.' });
  }

  const novoUsuario = { nome, cpf, telefone, email, senha, criadoEm: new Date() };
  data.usuarios.push(novoUsuario);

  writeData(data);
  return res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
});

// Rota para cadastrar um novo paciente
app.post('/pacientes', (req, res) => {
  const { nome, cpf, telefone, dataNascimento, sexo } = req.body;

  if (!nome || !cpf || !telefone || !dataNascimento || !sexo) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const data = readData();
  const pacienteExistente = data.pacientes.find(paciente => paciente.cpf === cpf);

  if (pacienteExistente) {
    return res.status(400).json({ error: 'Paciente já cadastrado.' });
  }

  const novoPaciente = { nome, cpf, telefone, dataNascimento, sexo, criadoEm: new Date() };
  data.pacientes.push(novoPaciente);

  writeData(data);
  return res.status(201).json({ message: 'Paciente cadastrado com sucesso.' });
});

// Rota para obter os usuários
app.get('/usuarios', (req, res) => {
  const data = readData();
  res.status(200).json(data.usuarios);
});

// Rota para obter os pacientes
app.get('/pacientes', (req, res) => {
  const data = readData();
  res.status(200).json(data.pacientes);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
