import React, { useContext } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../auth';
import { Weather } from '../components';
import background from '../assets/mountains-background.jpg';

// const apiURI = 'http://localhost:5000';
// const apiURI = 'http://10.13.13.34:5000';
// const apiURI = 'http://192.168.68.104:5000';
const apiURI = 'https://dev.phc.events';

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

function Login({ path = "/" }) {
  const [CurrentTime, setCurrentTime] = useState(new Date());
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await axios({
        method: 'post',
        url: `${apiURI}/api/auth/authorize`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          username: username,
          password: password
        })
      });

      const tokenData = response.data;
      const { access_token, expires_in, refresh_token } = tokenData;

      await login(access_token, refresh_token, expires_in);
      navigate(path);

      // Cookies.set('access_token', access_token, { expires: expires_in / 86400 });
      // Cookies.set('refresh_token', refresh_token);

      // Handle success (e.g., update state, navigate)
      // login();

    } catch (error) {
      let errorMessage = 'An unknown error occurred. Please try again later.';

      if (error.response && error.response.data && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      }

      // console.error(errorMessage);
      setErrorMsg(errorMessage);
      // Handle error (e.g., show error message to the user)
    }
  }

  return (
    <div id='home' className={showLoginForm ? 'open ' : ''}>
      <div className="fullscreen-background" onClick={() => setShowLoginForm(true)}>
        <img src={background} alt="mountain scene" />
        <div className="gradient-overlay"></div>
      </div>
      <div className="data-info">
        <p id="greeting" className='font-light'>{currGreeting}</p>
        <div className="row">
          <h1 id="time" className='clock font-light'>{CurrentTime.toLocaleTimeString([], { timeStyle: 'short' }).replace('AM', '').replace('PM', '')}</h1>
          <div className="weather-container">
            <Weather id="weather" rounded="true" />
          </div>
        </div>
      </div>

      <div className="login-button-container">
        <button className="login-button clear-button" onClick={() => setShowLoginForm(true)}><i className="fa fa-sign-in font-light"></i></button>
      </div>


      <div className='login-form-container'>
        <form className="login-form" onSubmit={handleSubmit}>
          {errorMsg && <p id="error-msg">{errorMsg}</p>}
          <input
            type="text"
            className="clear input font-light"
            placeholder="Username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="clear input font-light"
            placeholder="Password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="clear input font-light" type="submit">Login</button>
          <div className="button-container">
            <button className="link-button font-dark" onClick={() => setShowLoginForm(false)} type='button'>Cancel</button>
            <a href="https://my.pureheart.org/ministryplatformapi/oauth/reset" className="link-button font-dark">Forgot Password</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login