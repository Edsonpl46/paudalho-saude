import React from 'react';

function PacienteItem({ paciente }) {
  return (
    <li>
      <div>
        <strong>Nome:</strong> {paciente.nome} <br />
        <strong>Telefone:</strong> {paciente.telefone} <br />
        <strong>Endereço:</strong> {paciente.endereco} <br />
        <strong>Número SUS:</strong> {paciente.numeroSUS} <br />
        <strong>CPF:</strong> {paciente.cpf} <br />
        <strong>Serviços Usados:</strong> {paciente.servicos.join(', ')}
      </div>
    </li>
  );
}

export default PacienteItem;
