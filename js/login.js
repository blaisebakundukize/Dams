import { sendOrGetData } from './sendData.js';

const loginFormElements = document.querySelector(".js--form-login").elements;
const loginBtn = document.querySelector(".js--btn-login");

loginBtn.addEventListener("click", loginHandler);

const data = {};

function loginHandler(e) {
  const username = loginFormElements.username.value;
  const password = loginFormElements.password.value;
  const userType = loginFormElements.userType.value;
  console.log(userType)
  if (username.trim().length === 0 || password.trim().length === 0) {
    return alert(
      "Username & Password are required and not accept empty space."
    );
  }
  if (userType === "userType") {
    e.preventDefault();
    return alert("You must select User type.");
  }
  data.username = username;
  data.password = password;
  data.userType = userType;
  const json = JSON.stringify(data);
  sendOrGetData("./controllers/login.php", json, "POST").then(result => {
    if (result[0].success) {
      console.log(result[1].userType)
      console.log(result)
      // switch (result[1]) {
      //   case result[1].userType == 'doctor':
      //     window.location.href = '../pages/doctor.html';
      //     break;
      //   case result[1].userType == 'patient':
      //     window.location.href = '../pages/patient.html';
      //     break;
      //   default:
      //     return alert(
      //       "It should an admin page"
      //     );
      // }
      if (result[1].userType === 'doctor') {
        window.location.href = './pages/doctor.html';
      }
      if (result[1].userType === 'patient') {
        window.location.href = './pages/patient.html';
      }
    }
    else {
      return alert(result[0].message);
    }

  });
  // const result = sendLogins(json);
  // console.log(result)
  e.preventDefault();
}

// function sendLogins(data) {
//   const xhr = new XMLHttpRequest();
//   xhr.open("POST", "./controllers/login.php", true);
//   xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
//   xhr.onload = function () {
//     const response = JSON.parse(xhr.responseText);
//     console.log(response);
//     return response;
//   };
//   xhr.send(data);
// }
