const registerDoctorFormElements = document.querySelector(
  ".js--form-reg-doctor"
).elements;
const registerPatientFormElements = document.querySelector(
  ".js--form-reg-patient"
).elements;

const patNamesError = document.querySelector(".js--error__pat-names");
const patEmailError = document.querySelector(".js--error__pat-email");
const patPhoneError = document.querySelector(".js--error__pat-phone");
const patUsernameError = document.querySelector(".js--error__pat-username");
const patPasswordError = document.querySelector(".js--error__pat-password");

const docNamesError = document.querySelector(".js--error__doc-names");
const docEmailError = document.querySelector(".js--error__doc-email");
const docPhoneError = document.querySelector(".js--error__doc-phone");
const docUsernameError = document.querySelector(".js--error__doc-username");
const docPasswordError = document.querySelector(".js--error__doc-password");
const docDepartmentError = document.querySelector(".js--error__doc-department");

const regDoctorBtn = document.querySelector(".js--btn-reg-doctor");
const regPatientBtn = document.querySelector(".js--btn-reg-patient");

function isLengthValid(text) {
  if (text.length < 3) {
    return false;
  }
  return true;
}

function isEmailValid(email) {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email.toLowerCase())) {
    return false;
  }
  return true;
}

function isPhoneValid(phone) {
  const phoneRegex = /^[0-9]\d{8}$/;
  if (!phoneRegex.test(+phone)) {
    return false;
  }
  return true;
}

let isPatNamesValid = false;
let isPatEmailValid = false;
let isPatPhoneValid = false;
let isPatUsernameValid = false;
let isPatPasswordValid = false;

let isDocNamesValid = false;
let isDocEmailValid = false;
let isDocPhoneValid = false;
let isDocUsernameValid = false;
let isDocPasswordValid = false;
let isDocDepartmentValid = false;

// disable register button for patient
function disablePatientRegButton() {
  if (
    isPatNamesValid &&
    isPatEmailValid &&
    isPatPhoneValid &&
    isPatUsernameValid &&
    isPatPasswordValid
  ) {
    regPatientBtn.disabled = false;
  } else {
    regPatientBtn.disabled = true;
  }
}

// disable register button for doctor
function disableDoctorRegButton() {
  isDocNamesValid &&
  isDocEmailValid &&
  isDocPhoneValid &&
  isDocUsernameValid &&
  isDocPasswordValid &&
  isDocDepartmentValid
    ? (regDoctorBtn.disabled = false)
    : (regDoctorBtn.disabled = true);
}

registerPatientFormElements.names.addEventListener("keyup", event => {
  if (!isLengthValid(event.target.value)) {
    patNamesError.style.display = "block";
    isPatNamesValid = false;
  } else {
    isPatNamesValid = true;
    patNamesError.style.display = "none";
  }
  disablePatientRegButton();
});

registerPatientFormElements.email.addEventListener("keyup", event => {
  if (!isEmailValid(event.target.value)) {
    patEmailError.style.display = "block";
    isPatEmailValid = false;
  } else {
    isPatEmailValid = true;
    patEmailError.style.display = "none";
  }
  disablePatientRegButton();
});

registerPatientFormElements.phone.addEventListener("keyup", event => {
  if (!isPhoneValid(event.target.value)) {
    patPhoneError.style.display = "block";
    isPatPhoneValid = false;
  } else {
    isPatPhoneValid = true;
    patPhoneError.style.display = "none";
  }
  disablePatientRegButton();
});

registerPatientFormElements.username.addEventListener("keyup", event => {
  if (!isLengthValid(event.target.value)) {
    patUsernameError.style.display = "block";
    isPatUsernameValid = false;
  } else {
    isPatUsernameValid = true;
    patUsernameError.style.display = "none";
  }
  disablePatientRegButton();
});

registerPatientFormElements.password.addEventListener("keyup", event => {
  if (!isLengthValid(event.target.value)) {
    patPasswordError.style.display = "block";
    isPatPasswordValid = false;
  } else {
    isPatPasswordValid = true;
    patPasswordError.style.display = "none";
  }
  disablePatientRegButton();
});

registerDoctorFormElements.names.addEventListener("keyup", event => {
  if (!isLengthValid(event.target.value)) {
    docNamesError.style.display = "block";
    isDocNamesValid = false;
  } else {
    isDocNamesValid = true;
    docNamesError.style.display = "none";
  }
  disableDoctorRegButton();
});
registerDoctorFormElements.email.addEventListener("keyup", event => {
  if (!isEmailValid(event.target.value)) {
    docEmailError.style.display = "block";
    isDocEmailValid = false;
  } else {
    isDocEmailValid = true;
    docEmailError.style.display = "none";
  }
  disableDoctorRegButton();
});
registerDoctorFormElements.phone.addEventListener("keyup", event => {
  if (!isPhoneValid(event.target.value)) {
    docPhoneError.style.display = "block";
    isDocPhoneValid = false;
  } else {
    isDocPhoneValid = true;
    docPhoneError.style.display = "none";
  }
  disableDoctorRegButton();
});
registerDoctorFormElements.username.addEventListener("keyup", event => {
  if (!isLengthValid(event.target.value)) {
    docUsernameError.style.display = "block";
    isDocUsernameValid = false;
  } else {
    isDocUsernameValid = true;
    docUsernameError.style.display = "none";
  }
  disableDoctorRegButton();
});

registerDoctorFormElements.password.addEventListener("keyup", event => {
  if (!isLengthValid(event.target.value)) {
    docPasswordError.style.display = "block";
    isDocPasswordValid = false;
  } else {
    isDocPasswordValid = true;
    docPasswordError.style.display = "none";
  }
  disableDoctorRegButton();
});

registerDoctorFormElements.department.addEventListener("keyup", event => {
  if (!isLengthValid(event.target.value)) {
    docDepartmentError.style.display = "block";
    isDocDepartmentValid = false;
  } else {
    isDocDepartmentValid = true;
    docDepartmentError.style.display = "none";
  }
  disableDoctorRegButton();
});
