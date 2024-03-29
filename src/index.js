import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Helmet from "react-helmet"

import { Login, Logout, Error, Home, Dashboard, Ha} from './pages';
import { AuthProvider, ProtectedRoute } from './auth';
import './styles/main.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "/healthassessment",
    element: (
      <ProtectedRoute>
        <Ha />
      </ProtectedRoute>
    )
  },
  {
    path: "/login",
    element:  <Login />,
    errorElement: <Error />
  },
  {
    path: "/logout",
    element:  <Logout />,
    errorElement: <Error />
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <>
      <Helmet>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <title>Hello World</title>
      </Helmet>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </>
  </AuthProvider>
);