import React, { useState } from 'react';
import Login from './components/Login';
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
    <div>
      {usuarioLogado ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
