/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, confirmedPassword) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm: confirmedPassword,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signep up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      // url: 'http://127.0.0.1:3000/api/v1/users/logout',
      url: '/api/v1/users/logout',
    });

    if ((res.data.status = 'success')) location.reload(true);

    location.assign('/');
  } catch (err) {
    console.log(err.response.data);
    showAlert('error', 'Error logging out! Try again');
  }
};
