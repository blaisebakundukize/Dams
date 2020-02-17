import { sendOrGetData } from './sendData.js';
const btnLogout = document.querySelector('.js--bt-logout');

btnLogout.addEventListener("click", logoutHandler);

function logoutHandler(e) {
  sendOrGetData("../controllers/logout.php").then(() => {
    window.location.href = '../index.html';
  });
}