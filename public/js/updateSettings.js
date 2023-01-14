/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// export const updateData = async (name, email) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
//       data: {
//         name,
//         email,
//       },
//     });

//     console.log(res.data.status);

//     if (res.data.status === 'success') {
//       showAlert('success', 'Data changed!');
//       window.setTimeout(() => {
//         location.assign('/me');
//       }, 1500);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} changed!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
