import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// function parseJwt (token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));

//   return JSON.parse(jsonPayload);
// }

const refreshAccessToken = async (refresh_token) => await axios({
  method: 'post',
  url: 'http://localhost:5000/api/auth/refresh',
  headers: {
    'Content-Type': 'application/json'
  },
  data: JSON.stringify({
    refresh_token: refresh_token
  })
})
  .then(response => response.data)

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const access_token = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');

    console.log(access_token)
    console.log(refresh_token)

    if (access_token) {
      // user is currently logged in
      
      setIsAuthenticated(true);
      setLoading(false);
    } else if (refresh_token) {
      // user was logged in and session expired
      refreshAccessToken(refresh_token)
        .then(newAccessToken => {
          const { access_token, expires_in } = newAccessToken;
          Cookies.set('access_token', access_token, { expires: expires_in / 60 / 60 / 24, secure: true });
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
        })
    } else {
      // user is not logged in
      setLoading(false);
    }
    // setIsAuthenticated(!!access_token); // Update authentication status
    // setLoading(false); // Set loading to false after checking the token
  }, []);

  const login = (access_token, refresh_token, expires_in) => {
    Cookies.set('access_token', access_token, { expires: expires_in / 60 / 60 / 24, secure: true });
    Cookies.set('refresh_token', refresh_token, { secure: true });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};