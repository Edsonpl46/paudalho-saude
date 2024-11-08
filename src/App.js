// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard onLogout={() => setUser(null)} /> : <Login onLogin={() => setUser(auth.currentUser)} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={() => setUser(auth.currentUser)} />} />
      </Routes>
    </Router>
  );
}

export default App;
