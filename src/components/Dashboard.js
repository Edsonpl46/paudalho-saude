import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, List, ListItem, ListItemText, Grid, Card, CardContent, Collapse, TextField, Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getPacientes, addPaciente,deletePaciente, updatePaciente } from '../services/api'; 
import data from '../data.json'; // Importando o arquivo data.json
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrando os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard({ onLogout, user }) {
  const [pacientes, setPacientes] = useState([]);
  const [showPacientes, setShowPacientes] = useState(false); 
  const [selectedPaciente, setSelectedPaciente] = useState(null); 
  const [newPaciente, setNewPaciente] = useState({
    nome: '',
    cpf: '',
    sexo: '',
    dataNascimento: '',
    endereco: { bairro: '' },
    servicos: [],
    numeroSUS: '', // Adicionando o número do SUS
  });
  
  const [editPaciente, setEditPaciente] = useState(null); // Estado para o paciente sendo editado
  const [expandedCard, setExpandedCard] = useState(null); 
  const [searchText, setSearchText] = useState(''); 
  const [avatarUrl, setAvatarUrl] = useState(user?.fotoUrl || '/default-avatar.png'); 
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModel] = useState(false); // Estado para o model de edição

    // Carregando bairros e serviços do data.json
  const bairros = data.bairros || [];
  const servicos = data.servicos || [];
  
  useEffect(() => {
    const fetchPacientes = async () => {
      const data = await getPacientes();
      setPacientes(data);
    };
    fetchPacientes();
  }, []);

  const calculateStatistics = () => {
    const stats = {
      total: pacientes.length,
      homens: 0,
      mulheres: 0,
      faixaEtaria: { '0-18': 0, '19-30': 0, '31-50': 0, '51+': 0 },
      bairros: {},
      servicos: {},
    };

    pacientes.forEach((paciente) => {
      if (paciente.sexo === 'Masculino') stats.homens++;
      if (paciente.sexo === 'Feminino') stats.mulheres++;

      const idade = new Date().getFullYear() - new Date(paciente.dataNascimento).getFullYear();
      if (idade <= 18) stats.faixaEtaria['0-18']++;
      else if (idade <= 30) stats.faixaEtaria['19-30']++;
      else if (idade <= 50) stats.faixaEtaria['31-50']++;
      else stats.faixaEtaria['51+']++;

      const bairro = paciente.endereco?.bairro;
      if (bairro) stats.bairros[bairro] = (stats.bairros[bairro] || 0) + 1;

      paciente.servicos?.forEach((servico) => {
        stats.servicos[servico] = (stats.servicos[servico] || 0) + 1;
      });
    });

    return stats;
  };

  const stats = calculateStatistics();

  // Função para abrir o modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Função para abrir modal de edição 
  const handleOpenEditModel = (paciente) => {
    setEditPaciente(paciente); // Setar o paciente editado
    setOpenEditModel(true);
  };

  // Função para fechar model de edição
  const handleCloseEditModal = () => {
    setOpenEditModel(false);
  };

  // Função para lidar com mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPaciente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para lidar com mudança no formulario de edição
  const handleEditInputChange = (e) => {
    const { name, value} = e.target;
    setEditPaciente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    await addPaciente(newPaciente); // Alterei para addPaciente
    setPacientes((prev) => [...prev, newPaciente]); // Atualiza o estado com o novo paciente
    handleCloseModal(); // Fecha o modal após o envio
  };

   // Função para lidar com o envio do formulário de edição
  const handleEditSubmit = async () => {
    await updatePaciente(editPaciente); // Função para atualizar o paciente
    setPacientes((prev) => prev.map((paciente) => (paciente.cpf === editPaciente.cpf ? editPaciente : paciente))); // Atualiza a lista com os dados editados
    handleCloseEditModal(); // Fecha o modal de edição
  };

    // Função para apagar um paciente
  const handleDelete = async (cpf) => {
      await deletePaciente(cpf); // Função para excluir o paciente
      setPacientes((prev) => prev.filter((paciente) => paciente.cpf !== cpf)); // Atualiza a lista removendo o paciente excluído
    };

  const filteredPacientes = pacientes.filter((paciente) => {
    const searchTerm = searchText.toLowerCase();
    return (
      paciente.nome.toLowerCase().includes(searchTerm) ||
      paciente.cpf.includes(searchTerm)
    );
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result); // Atualiza a URL do avatar com a imagem carregada
      };
      reader.readAsDataURL(file); // Converte o arquivo em base64 para exibir a imagem
    }
  };

  const handlePacienteClick = (paciente) => {
    setSelectedPaciente(selectedPaciente === paciente ? null : paciente);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      {/* Modal para cadastro de paciente */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            value={newPaciente.nome}
            name="nome"
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="CPF"
            fullWidth
            value={newPaciente.cpf}
            name="cpf"
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
           <TextField
            label="Número do SUS"
            fullWidth
            value={newPaciente.numeroSUS}
            name="numeroSUS"
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Sexo"
            fullWidth
            value={newPaciente.sexo}
            name="sexo"
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Data de Nascimento"
            type="date"
            fullWidth
            value={newPaciente.dataNascimento}
            name="dataNascimento"
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Bairro"
            fullWidth
            value={newPaciente.endereco?.bairro}
            name="bairro"
            onChange={(e) => setNewPaciente({ ...newPaciente, endereco: { bairro: e.target.value } })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Serviços"
            fullWidth
            value={newPaciente.servicos.join(', ')}
            name="servicos"
            onChange={(e) => setNewPaciente({ ...newPaciente, servicos: e.target.value.split(',') })}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSubmit}>Cadastrar</Button>
        </DialogActions>
      </Dialog>
       
       {/* Modal para edição de paciente */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Editar Paciente</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            value={editPaciente?.nome || ''}
            name="nome"
            onChange={handleEditInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="CPF"
            fullWidth
            value={editPaciente?.cpf || ''}
            name="cpf"
            onChange={handleEditInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Número do SUS"
            fullWidth
            value={editPaciente?.numeroSUS || ''}
            name="numeroSUS"
            onChange={handleEditInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Sexo"
            fullWidth
            value={editPaciente?.sexo || ''}
            name="sexo"
            onChange={handleEditInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Data de Nascimento"
            type="date"
            fullWidth
            value={editPaciente?.dataNascimento || ''}
            name="dataNascimento"
            onChange={handleEditInputChange}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Bairro"
            fullWidth
            value={editPaciente?.endereco?.bairro || ''}
            name="bairro"
            onChange={(e) => setEditPaciente({ ...editPaciente, endereco: { bairro: e.target.value } })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Serviços"
            fullWidth
            value={editPaciente?.servicos.join(', ') || ''}
            name="servicos"
            onChange={(e) => setEditPaciente({ ...editPaciente, servicos: e.target.value.split(',') })}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancelar</Button>
          <Button onClick={handleEditSubmit}>Salvar Alterações</Button>
        </DialogActions>
      </Dialog>

      {/* Seção de informações do usuário logado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        {/* Nome e Foto do Usuário */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={avatarUrl || '/default-avatar.png'} sx={{ marginRight: 2, width: 60, height: 60, borderRadius: '50%' }} />
          <Typography variant="h6" sx={{ color: '#333', fontWeight: '600' }}>
            {`Bem-vindo, ${user?.nome ? user.nome.split(' ')[0] : 'Usuário'}`}
          </Typography>

        </Box>

        {/* Botões de Upload da Foto e Logout */}
        <Button variant="outlined" component="label" sx={{ borderRadius: '20px', padding: '8px 20px', textTransform: 'none', marginLeft: 2 }}>
          Alterar Foto
          <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
        </Button>
        
        <Button onClick={onLogout} variant="contained" color="error" sx={{ borderRadius: '20px', padding: '8px 20px', textTransform: 'none', marginLeft: 2 }}>
          Logout
        </Button>
      </Box>

      {/* Botão para abrir o modal de cadastro */}
      <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginBottom: 4 }}>
        Cadastrar Novo Paciente
      </Button>

      {/* Filtro de Pacientes */}
      <TextField
        label="Buscar Paciente"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ marginBottom: 4 }}
      />


      {/* Lista de Pacientes */}
      <List>
        {filteredPacientes.map((paciente, index) => (
          <Card key={index} sx={{ marginBottom: 2, cursor: 'pointer' }} onClick={() => handlePacienteClick(paciente)}>
            <ListItem>
              <ListItemText primary={paciente.nome} secondary={`${paciente.cpf} | SUS: ${paciente.numeroSUS}`}  />
            </ListItem>
            <Collapse in={selectedPaciente === paciente} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography variant="body2">Sexo: {paciente.sexo}</Typography>
                <Typography variant="body2">Data de Nascimento: {paciente.dataNascimento}</Typography>
                <Typography variant="body2">Bairro: {paciente.endereco?.bairro}</Typography>
                <Typography variant="body2">Serviços: {paciente.servicos?.join(', ')}</Typography>
                <Typography variant="body2">Número do SUS: {paciente.numeroSUS}</Typography> {/* Exibindo número do SUS */}
              </CardContent>
            </Collapse>

          </Card>
        ))}
      </List>

      {/* Estatísticas e Gráficos */}
      <Grid container spacing={4}>
        {/* Gráficos de Faixa Etária, Sexo, Bairro, Serviços */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: '#eeeeee' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Faixa Etária
              </Typography>
              <Bar
                data={{
                  labels: ['0-18', '19-30', '31-50', '51+'],
                  datasets: [
                    {
                      label: 'Pacientes por Faixa Etária',
                      data: [
                        stats.faixaEtaria['0-18'],
                        stats.faixaEtaria['19-30'],
                        stats.faixaEtaria['31-50'],
                        stats.faixaEtaria['51+'],
                      ],
                      backgroundColor: '#3f51b5',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: '#eeeeee' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Sexo
              </Typography>
              <Bar
                data={{
                  labels: ['Masculino', 'Feminino'],
                  datasets: [
                    {
                      label: 'Pacientes por Sexo',
                      data: [stats.homens, stats.mulheres],
                      backgroundColor: ['#3f51b5', '#e91e63'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: '#eeeeee' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Pacientes por Bairro
              </Typography>
              <Bar
                data={{
                  labels: Object.keys(stats.bairros),
                  datasets: [
                    {
                      label: 'Pacientes por Bairro',
                      data: Object.values(stats.bairros),
                      backgroundColor: '#3f51b5',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: '#eeeeee' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Pacientes por Serviço
              </Typography>
              <Bar
                data={{
                  labels: Object.keys(stats.servicos),
                  datasets: [
                    {
                      label: 'Pacientes por Serviço',
                      data: Object.values(stats.servicos),
                      backgroundColor: '#3f51b5',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
