import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import PacienteItem from './PacienteItem';

function ListaPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'pacientes'));
        const pacientesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPacientes(pacientesList);
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
      }
    };
    fetchPacientes();
  }, []);

  const pacientesFiltrados = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Lista de Pacientes</h2>
      <input
        type="text"
        placeholder="Buscar paciente por nome"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <ul className="patient-list">
        {pacientesFiltrados.map((paciente) => (
          <PacienteItem key={paciente.id} paciente={paciente} />
        ))}
      </ul>
    </div>
  );
}

export default ListaPacientes;
