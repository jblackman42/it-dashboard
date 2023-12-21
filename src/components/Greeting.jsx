import React, { useState, useEffect } from 'react';

import Cookies from "js-cookie"

function Greeting() {
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(JSON.parse(Cookies.get("user") ?? "{}"));
  }, []);

  return (
    <>
      {/* {user.nickname && <p className="greeting font-light" style={{width: "max-content"}}>Welcome back, {user.nickname}!</p>} */}
      {user && user.nickname && <p className="greeting font-light">Welcome, {user.nickname}!</p>}
    </>
  )
}

export default Greeting;