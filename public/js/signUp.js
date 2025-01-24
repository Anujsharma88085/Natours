/*eslint-disable*/

// import axios from 'axios';
// import axios from 'axios';
import { showAlert } from './alert';

export const signUp = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data,
    });
    // console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Account Created successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    // console.log(res); this will return jwt
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
