import React from 'react';
import { useEffect, useState } from 'react';
import background from '../assets/mountains-background.jpg'

// import {AiOutlineArrowDown} from 'react-icons/ai';

const Greetings = [
  'Howdy!',
  'Welcome Back.',
  'Nice to see you!',
  'Sup, homeslice?',
  'What\'s crackin\'?',
  'Hi!',
  'Ahoy, matey!',
  'Peek-a-boo!',
  'Yo!',
  'Greetings and salutations!',
  'Aloha!',
  'Hola!',
  'Que pasa!',
  'Bonjour!',
  'Ciao!'
]
const currGreeting = Greetings[Math.floor(Math.random() * Greetings.length)];

function Home() {
  const [CurrentTime, setCurrentTime] = useState(new Date());
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div id='home' className={showLoginForm ? 'open ' : ''}>
      <div className="fullscreen-background">
        <img src={background} alt="mountain scene" />
        <div className="gradient-overlay"></div>
      </div>
      <div className="data-info">
        <p className='font-light'>{currGreeting}</p>
        <h1 className='clock font-light'>{CurrentTime.toLocaleTimeString([], {timeStyle: 'short'}).replace('AM', '').replace('PM', '')}</h1>
      </div>

      <div className="login-button-container">
        <button className="login-button clear-button" onClick={() => setShowLoginForm(true)}><i className="fa fa-sign-in font-light"></i></button>
      </div>


      <div className='login-form-container'>
        <form action="#" className="login-form">
          <input type="text" className ="clear input" placeholder="Username"/>
          <input type="password" className ="clear input" placeholder="Password"/>
          <button className="clear input font-light" onClick={() => setShowLoginForm(false)}>Login</button>
          <div className="button-container">
            <button className="link-button font-dark" onClick={() => setShowLoginForm(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home