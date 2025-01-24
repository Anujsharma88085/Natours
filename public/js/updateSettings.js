import { showAlert } from './alert';

//type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || 'Something went wrong. Please try again.';
    showAlert('error', errorMessage);
  }
};

//only updating user data excluding user password

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

//     if (res.data.status === 'success') {
//       showAlert('success', 'Data updated successfully');
//     }
//   } catch (err) {
//     const errorMessage =
//       err.response?.data?.message || 'Something went wrong. Please try again.';
//     showAlert('error', errorMessage);
//   }
// };
