// send request to server
export function sendOrGetData(url, data = null, verb = "GET") {
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.open(verb, url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.onload = function () {
      const response = JSON.parse(xhr.responseText);
      resolve(response)
    };
    xhr.send(data);
  });
}

// get user data
export async function getUserData() {
  const url = "../controllers/getIdentity.php";
  const result = await sendOrGetData(url);
  if (!result['success']) {
    window.location.href = '../index.html';
  }
  return result;
}

// check user role and redirect if urls are not matching
export async function checkUserType(userData) {
  const pathName = window.location.pathname;
  const user = await userData;
  if (user.user_type === "patient") {
    if (pathName != '/DAMS/pages/patient.html') {
      window.location.href = '../pages/patient.html';
    }
  } else {
    if (pathName != '/DAMS/pages/doctor.html') {
      window.location.href = '../pages/doctor.html';
    }
  }
}

