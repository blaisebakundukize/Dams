import { getUserData, sendOrGetData, checkUserType } from "./sendData.js";

const tabSetSchedules = document.querySelector(".js--tab-schedules");
const tabBookings = document.querySelector(".js--tab-bookings");
const formSetSchedule = document.querySelector(".js--form-set-schedule");
const bookings = document.querySelector(".js--bookings");
const doctorNameP = document.querySelector(".js--doctor-name");

const scheduleAppointmentFormElements = document.querySelector(
  ".js--form-set-schedule"
).elements;
const scheduledDateFormElements = document.querySelector(
  ".js--form-get-scheduled"
).elements;
const reportFormElements = document.querySelector(".js--form-get-report");
const bookingsErrorMessage = document.querySelector(
  ".js--bookings-error-message"
);
const reportErrorMessage = document.querySelector(".js--report-error-message");

const containerTableBookings = document.querySelector(
  ".table__bookings-container"
);
const containerTableReport = document.querySelector(".table__report-container");

// bookings
const tableBookings = document.querySelector(".js--table-bookings");
const tbodyBookings = document.querySelector(".table__bookings-body");
const btnGetBookings = document.querySelector(".js--btn-get-bookings");

// report
const tableReport = document.querySelector(".js--table-report");
const tbodyReport = document.querySelector(".table__report-body");
const btnGenReport = document.querySelector(".js--btn-generate-report");

const schAppBtn = document.querySelector(".js--btn-schedule");

// set default values to some elements
setDefaultValue();

// set number of bookings
setNumberOfBookings();

schAppBtn.addEventListener("click", setAppointment);
btnGetBookings.addEventListener("click", getBookings);
btnGenReport.addEventListener("click", generateReport);

scheduleAppointmentFormElements.timeFrom.addEventListener(
  "change",
  setNumberOfBookings
);
scheduleAppointmentFormElements.timeEnd.addEventListener(
  "change",
  setNumberOfBookings
);

// get user data
const userData = getUserData();
checkUserType(userData);
displayDoctorName();

// show doctor name
async function displayDoctorName() {
  const doctor = await userData;
  doctorNameP.innerHTML =
    "<span class='user-title'>Doctor:</span> " + doctor.name;
}

// Set number of bookings automatically. Three patients per hour
function setNumberOfBookings() {
  const timeFrom = scheduleAppointmentFormElements.timeFrom.value;
  const timeEnd = scheduleAppointmentFormElements.timeEnd.value;

  var hoursToWorkWithBreak = diffMinutes(
    new Date("2019-01-01 " + timeFrom),
    new Date("2019-01-01 " + timeEnd)
  );

  const workingHours = hoursToWork(hoursToWorkWithBreak);

  const patientsPerHour = 3;

  scheduleAppointmentFormElements.bookings.value =
    workingHours * patientsPerHour;
}

// handle tabs
window.tabHandler = function tabHandler(event, tabName) {
  var i, tabContents, tabLinks;
  tabContents = document.getElementsByClassName("tab__content");
  for (i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }
  tabLinks = document.getElementsByClassName("tabs__item");
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active-tab", "");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active-tab";
  if (tabName === "bookings") {
    getBookings(event);
  }
};

// set default values
function setDefaultValue() {
  const scheduleDate = (scheduleAppointmentFormElements.schedule.valueAsDate = new Date());
  const timeFrom = (scheduleAppointmentFormElements.timeFrom.defaultValue =
    "08:00");
  const timeEnd = (scheduleAppointmentFormElements.timeEnd.defaultValue =
    "18:00");
  const scheduledDate = (scheduledDateFormElements.scheduled.valueAsDate = new Date());
  reportFormElements.dateFrom.valueAsDate = new Date();
  reportFormElements.dateTo.valueAsDate = new Date();
}

const schedule = {};

// Calculate hours between timestamps
function diffMinutes(t1, t2) {
  var m1 = t1.getHours();
  var m2 = t2.getHours();
  return m2 - m1;
}

// Calculate hours to work without break of one hour
function hoursToWork(hours) {
  const morningHours = 6;
  if (hours > morningHours) {
    hours -= 1;
  }
  return hours;
}

// hours to seconds
function toSeconds(s) {
  var p = s.split(":");
  return parseInt(p[0], 10) * 3600 + parseInt(p[1], 10) * 60;
}

// fill with zero to hours which are not in tens
function fill(s, digits) {
  s = s.toString();
  while (s.length < digits) s = "0" + s;
  return s;
}

// set appointment
async function setAppointment(e) {
  const scheduleDate = scheduleAppointmentFormElements.schedule.value;
  const timeFrom =
    scheduleDate + " " + scheduleAppointmentFormElements.timeFrom.value;
  const timeEnd =
    scheduleDate + " " + scheduleAppointmentFormElements.timeEnd.value;
  const bookings = scheduleAppointmentFormElements.bookings.value;

  schedule.date = scheduleDate;
  schedule.start = timeFrom;
  schedule.end = timeEnd;
  schedule.bookings = Math.floor(bookings);
  schedule.totalWorkingHours = diffMinutes(
    new Date("2019-01-01 " + timeFrom),
    new Date("2019-01-01 " + timeEnd)
  );

  // minutes per patient
  const minutesPerPatient = "00:20";

  var sec =
    toSeconds(scheduleAppointmentFormElements.timeFrom.value) +
    toSeconds(minutesPerPatient);

  schedule.nextAppointment =
    fill(Math.floor(sec / 3600), 2) + ":" + fill(Math.floor(sec / 60) % 60, 2);

  var data = await userData;

  schedule.doctorId = data.user_id;
  const json = JSON.stringify(schedule);

  console.log(json);

  sendOrGetData("../controllers/doctor.php", json, "POST").then(result => {
    return alert(result[0].message);
  });

  e.preventDefault();
}

// remove rows from table body
function removeTableRows(table) {
  for (let i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }
}

// generate table for Bookings
async function generateBookingsTable() {
  const doctor = {};
  const user = await userData;
  doctor.doctorId = user.user_id;
  doctor.scheduleDate = scheduledDateFormElements.scheduled.value;
  const json = JSON.stringify(doctor);
  sendOrGetData("../controllers/bookedAppointments.php", json, "POST").then(
    data => {
      if (data[0].success === false) {
        tableBookings.style.display = "none";
        bookingsErrorMessage.innerHTML = data[0].message;
        bookingsErrorMessage.style.display = "block";
      } else {
        bookingsErrorMessage.style.display = "none";
        removeTableRows(tableBookings);
        if (tableBookings.style.display == "none") {
          tableBookings.style.display = "block";
        }
        let number = 0;
        for (let element of data) {
          number += 1;
          let row = tbodyBookings.insertRow();
          row.setAttribute("id", element["appointmentId"]);
          let cellNumber = row.insertCell();
          cellNumber.innerHTML = number;
          for (let key in element) {
            if (key !== "isConsulted" && key !== "appointmentId") {
              let cell = row.insertCell();
              cell.innerHTML = element[key];
            }
          }
          let cell = row.insertCell();
          let inputCheckbox = document.createElement("input");
          inputCheckbox.setAttribute("type", "checkbox");
          inputCheckbox.setAttribute("class", "checkbox");
          inputCheckbox.setAttribute("onclick", "onCheckConsultHandler(event)");
          inputCheckbox.checked = element["isConsulted"] === "0" ? false : true;
          cell.appendChild(inputCheckbox);
        }
      }
    }
  );
}

window.onCheckConsultHandler = event => {
  let appointment = {};
  const appointmentId = event.target.parentNode.parentNode.id;
  appointment.appointmentId = appointmentId;
  const json = JSON.stringify(appointment);
  sendOrGetData("../controllers/consultPatient.php", json, "POST").then(
    result => {
      event.preventDefault();
    }
  );
};

async function generateReportTable(from, to) {
  const report = {};
  const user = await userData;
  report.doctorId = user.user_id;
  report.from = from;
  report.to = to;
  const json = JSON.stringify(report);
  sendOrGetData("../controllers/report.php", json, "POST").then(data => {
    if (data[0].success === false) {
      tableReport.style.display = "none";
      reportErrorMessage.innerHTML = data[0].message;
      reportErrorMessage.style.display = "block";
    } else {
      reportErrorMessage.style.display = "none";
      removeTableRows(tableReport);
      if (tableReport.style.display == "none") {
        tableReport.style.display = "block";
      }
      let number = 0;
      for (let element of data) {
        number += 1;
        let row = tbodyReport.insertRow();
        let cellNumber = row.insertCell();
        cellNumber.innerHTML = number;
        for (let key in element) {
          if (key !== "isConsulted") {
            let cell = row.insertCell();
            cell.innerHTML = element[key];
          }
        }
        let cell = row.insertCell();
        if (element["isConsulted"] === "1") {
          cell.setAttribute("class", "text--small text--green");
          cell.innerHTML = "Yes";
        } else {
          cell.setAttribute("class", "text--small");
          cell.innerHTML = "No";
        }
      }
    }
  });
}

// get bookings
function getBookings(e) {
  generateBookingsTable();
  containerTableBookings.style.display = "block";
  e.preventDefault();
}

// generate report
function generateReport(e) {
  const dateFrom = reportFormElements.dateFrom.value;
  const dateTo = reportFormElements.dateTo.value;

  if (dateFrom !== dateTo && new Date(dateFrom) > new Date(dateTo)) {
    alert("Error happened. Date-from should be small or equal to Date-to");
  } else {
    generateReportTable(dateFrom, dateTo);
    containerTableReport.style.display = "block";
  }
  e.preventDefault();
}
