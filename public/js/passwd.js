/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updatePassword = async (
  password,
  newpassword,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updatePassword',
      data: {
        password,
        newpassword,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
