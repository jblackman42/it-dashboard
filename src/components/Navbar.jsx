import React from 'react';

import { HiMiniHome } from "react-icons/hi2";
// import { HiMiniHome, HiMiniUserCircle, HiCalendarDays } from "react-icons/hi2";
// import { FaRunning, FaSlidersH } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";

import { Weather, Greeting } from "../components";
import logo from '../assets/logo.png';

const links = [
  {
    icon: <HiMiniHome />,
    path: "/",
    text: "Home"
  },
  // {
  //   icon: <HiMiniUserCircle />,
  //   path: "/profile",
  //   text: "Profile"
  // },
  // {
  //   icon: <HiCalendarDays />,
  //   path: "/calendar",
  //   text: "Schedule"
  // },
  // {
  //   icon: <FaRunning />,
  //   path: "/activities",
  //   text: "Activities"
  // },
  // {
  //   icon: <FaSlidersH />,
  //   path: "/settings",
  //   text: "Settings"
  // },
  {
    icon: <CgLogOut />,
    path: "/logout",
    text: "logout"
  }
]

function Navbar() {

  return (
    <nav className="sidebar-navigation">
      <div className="img-container">
        <img src={logo} alt="PHC" />
      </div>
      <div className="navigation-list">
        <ul className="font-light">
          {links.map(({icon, path, text}, i) => {
            const active = window.location.pathname === path;
            return <li key={i+1}><a className={active ? 'active' : ''} href={path}>{icon}<p>&nbsp;&nbsp;{text}</p></a></li>
          })}
        </ul>
      </div>
      <div className="welcome-message">
        <Weather />
        <Greeting />
      </div>
    </nav>
  )
}

export default Navbar;