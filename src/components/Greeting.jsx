import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Cookies from "js-cookie"

const getUser = async (token) => {
  return await axios({
    method: "get",
    url: "https://my.pureheart.org/ministryplatformapi/oauth/connect/userinfo",
    headers: {
      "Content-Type": "Application/JSON",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => response.data)
    .catch(err => {
      console.error("Could not retrieve user information.")
    })
}

function Greeting() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const authToken = Cookies.get("access_token");
    getUser(authToken).then(user => {
      setUser(user);
    })
  }, []);

  return (
    <>
      {/* {user.nickname && <p className="greeting font-light" style={{width: "max-content"}}>Welcome back, {user.nickname}!</p>} */}
      {user.nickname && <p className="greeting font-light">Welcome, {user.nickname}!</p>}
    </>
  )
}

export default Greeting;