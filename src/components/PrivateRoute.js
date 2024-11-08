// src/components/PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null;  // Mostra nada enquanto verifica o estado de autenticação

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
