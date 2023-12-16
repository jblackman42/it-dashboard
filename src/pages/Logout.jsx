import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

import { AuthContext } from '../auth';
import { Loading } from '../components'

function Logout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout()
      .then(() => {
        navigate('/login')
      })
  });


  return (
    <Loading />
  )
}

export default Logout