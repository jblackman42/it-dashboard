import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from './AuthProvider';
import { Navbar } from '../components';
import background from '../assets/mountains-background.jpg';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // Redirect them to the /login page if not authenticated
    return <Navigate to="/login" />;
  }

  return (
    <main>
      <div className="fullscreen-background">
        <img src={background} alt="mountain scene" />
        <div className="gradient-overlay"></div>
      </div>
      < Navbar />
      <section className="content">
        {children}
      </section>
    </main>
  );
};