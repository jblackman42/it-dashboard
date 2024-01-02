import React, { createContext, useCallback, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from './AuthProvider';
import { Navbar, Loading } from '../components';
import background from '../assets/mountains-background.jpg';

export const LoadingContext = createContext();

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  // const startLoading = () => setIsLoading(true);
  // const stopLoading = () => setIsLoading(false);
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (!isAuthenticated) {
    // Redirect them to the /login page if not authenticated
    return <Navigate to="/login" />;
  }

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      <main>
        <div className="fullscreen-background">
          <img src={background} alt="mountain scene" />
          <div className="gradient-overlay"></div>
        </div>
        {isLoading && <Loading loadingState={isLoading}/> }
        <Navbar />
        <section className="content">
          {children}
        </section>
      </main>
    </LoadingContext.Provider>
  );
};