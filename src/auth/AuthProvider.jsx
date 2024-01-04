import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import { Loading } from '../components';

// const apiURI = 'http://localhost:5000';
// const apiURI = 'http://10.13.13.34:5000';
const apiURI = 'https://dev.phc.events';
const isDevelopment = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

export function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const refreshAccessToken = async (refresh_token) => await axios({
  method: 'post',
  url: `${apiURI}/api/auth/refresh`,
  headers: {
    'Content-Type': 'application/json'
  },
  data: JSON.stringify({
    refresh_token: refresh_token
  })
})
  .then(response => response.data)

const getUserData = async (access_token) => await axios({
  method: "get",
  url: "https://my.pureheart.org/ministryplatformapi/oauth/connect/userinfo",
  headers: {
    "Content-Type": "Application/JSON",
    "Authorization": `Bearer ${access_token}`
  }
})
  .then(response => response.data)

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const access_token = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');

    if (access_token) {
      // user is currently logged in
      setIsAuthenticated(true);
      setLoading(false);
    } else if (refresh_token) {
      // user was logged in and session expired
      refreshAccessToken(refresh_token)
        .then(newAccessToken => {
          const { access_token, expires_in } = newAccessToken;
          Cookies.set('access_token', access_token, { expires: expires_in / 86400, secure: !isDevelopment });
          Cookies.set('token_expiration', new Date().getTime() + (expires_in * 1000), { secure: !isDevelopment });
          getUserData(access_token)
            .then(user => {
              Cookies.set('user', JSON.stringify(user), { expires: expires_in / 86400, secure: !isDevelopment });
              setIsAuthenticated(true);
              setLoading(false);
            })
            .catch(err => {
              console.error("Login Failed. Could not retrieve user information.")
              setLoading(false);
            })
        })
        .catch(error => {
          setLoading(false);
        })
    } else {
      // user is not logged in
      setLoading(false);
    }
  }, []);

  const login = async (access_token, refresh_token, expires_in) => {
    Cookies.set('access_token', access_token, { expires: expires_in / 86400, secure: !isDevelopment });
    Cookies.set('token_expiration', new Date().getTime() + (expires_in * 1000), { secure: !isDevelopment });
    Cookies.set('refresh_token', refresh_token, { secure: !isDevelopment });
    // get user info and save it as a cookie
    await getUserData(access_token)
      .then(user => {
        Cookies.set('user', JSON.stringify(user), { expires: expires_in / 86400, secure: !isDevelopment });
        setIsAuthenticated(true);
      })
      .catch(err => {
        console.error("Login Failed. Could not retrieve user information.")
        setIsAuthenticated(false);
      })
  };

  const logout = async () => {
    try {
      const access_token = Cookies.get('access_token');
      const refresh_token = Cookies.get('refresh_token');
      if (access_token) {
        await axios({
          method: 'post',
          url: `${apiURI}/api/auth/revoke`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            token: access_token,
            token_hint: 'access_token'
          })
        })
      }
      if (refresh_token) {
        await axios({
          method: 'post',
          url: `${apiURI}/api/auth/revoke`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            token: refresh_token,
            token_hint: 'refresh_token'
          })
        })
      }
    } catch (error) {
      console.error("Failed to revoke auth tokens.")
    }
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('token_expiration');
    Cookies.remove('user');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
