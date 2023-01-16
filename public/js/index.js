/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { bookTour } from './stripe';
// import { updateData } from './updateSettings';
// import { updatePassword } from './passwd';
import { updateSettings } from './updateSettings';
// import { signup } from '../../controllers/authController';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.getElementById('form-to-login');
const signupForm = document.getElementById('signup-form');
const updateForm = document.querySelector('.form-user-data');
const passwordChangeForm = document.querySelector('.form-user-settings');
const logOutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');

//DELEGATION
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmedPassword =
      document.getElementById('confirmedPassword').value;

    signup(name, email, password, confirmedPassword);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (updateForm) {
  document.querySelector('.form-user-data').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    // const newName = document.getElementById('name').value;
    // const newEmail = document.getElementById('email').value;

    updateSettings(form, 'data');
  });
}

if (passwordChangeForm) {
  passwordChangeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const password = document.getElementById('password-current').value;
    const newpassword = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    console.log(password);
    await updateSettings(
      { password, newpassword, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
