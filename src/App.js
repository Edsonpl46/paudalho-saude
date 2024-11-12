import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const handleLogin = (usuario) => {
    setUsuarioLogado(usuario);
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
  };

  return (
    <Router>
      <Routes>
        {/* Redireciona para Login se o usuário acessar a rota raiz */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rota de Login */}
        <Route
          path="/login"
          element={
            usuarioLogado ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Rota de Registro */}
        <Route
          path="/register"
          element={
            usuarioLogado ? (
              <Navigate to="/dashboard" />
            ) : (
              <Registro />
            )
          }
        />

        {/* Rota de Dashboard */}
        <Route
          path="/dashboard"
          element={
            usuarioLogado ? (
              <Dashboard onLogout={handleLogout} usuario={usuarioLogado} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
