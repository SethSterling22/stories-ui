import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../common/ProtectedRoute';
import Login from '../Login/Login';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../common/Loading';
import StoriesRouter from '../Stories/_Router';
import StoriesList from '../Pages/StoriesList';
import Callback from '../Callback/Callback';

const Router: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Switch>
      {/* 1. Ruta pública para la página de Login */}
      <Route exact path="/login">
        <Login />
      </Route>

      {/* 2. NUEVA: Ruta pública para capturar el token que envía TACC */}
      <Route exact path="/callback">
        <Callback />
      </Route>

      {/* 3. Ruta protegida para la página principal */}
      <ProtectedRoute isAuthenticated={isAuthenticated} exact path="/">
        <StoriesList />
      </ProtectedRoute>

      {/* 4. Ruta protegida para el módulo de historias */}
      <ProtectedRoute isAuthenticated={isAuthenticated} path="/stories">
        <StoriesRouter />
      </ProtectedRoute>
    </Switch>
  );
};

export default Router;