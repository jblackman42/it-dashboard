import React from "react";

import { Navbar } from "../components";

const Home = () => {

  return (
    <>
      <Navbar />
      <h1>Hello World!</h1>
      <a href="/logout">Logout</a>
    </>
  )
}

export default Home;