import Cookies from 'js-cookie';
import axios from 'axios';

// const apiURI = 'http://localhost:5000';
const apiURI = 'http://10.13.13.34:5000';
const isDevelopment = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

const saveAccessToken = (access_token, expires_in) => {
  Cookies.set('access_token', access_token, { expires: expires_in / 60 / 60 / 24, secure: !isDevelopment });
};

const getNewTokenDataFromRefreshToken = async (refresh_token) => {
  return await axios({
    method: 'post',
    url: `${apiURI}/api/auth/refresh`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      refresh_token: refresh_token
    })
  })
    .then(response => response.data);
}

const getToken = async () => {
  try {
    // return access token from cookie
    const access_token = Cookies.get('access_token');
    if (access_token) return access_token
    // if no access token, check for refresh token
    const refresh_token = Cookies.get('refresh_toke');
    // if no refresh token, logout
    if (!refresh_token) {
      console.log('no refresh tokens')
      return null;
      // may need to redirect user
    }
    // use refresh token to get new access token
    const { access_token: new_access_token, expires_in: new_expires_in } = await getNewTokenDataFromRefreshToken(refresh_token);
    // save and return new access token
    saveAccessToken(new_access_token, new_expires_in);
    return new_access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export {
  getToken
}