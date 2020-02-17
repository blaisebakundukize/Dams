import { sendOrGetData, getUserData, checkUserType } from './sendData.js'

const tableSchedules = document.querySelector(".js--docs-schedules");
const tbodySchedules = document.querySelector(".table__schedules-body");
const tableAppointments = document.querySelector(".js--table-appointments");
const tbodyAppointments = document.querySelector(".table__appointments-body");
const AppointmentsErrorMessage = document.querySelector(".js--appointments-error-message");
const modal = document.querySelector(".js--modal");
const modalBody = document.querySelector(".js--modal-body");
const modalFooter = document.querySelector(".js--modal-footer");
const patientNameP = document.querySelector(".js--patient-name");

// get user data
const userData = getUserData();
checkUserType(userData);
displayPatientName();

// show patient name
async function displayPatientName() {
  const patient = await userData;
  patientNameP.innerHTML = "<span class='user-title'>Patient:</span> " + patient.name;
}

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
  if (event.target.attributes.id.value === "id-schedules") {
    generateSchedulesTable();
  }
  if (event.target.attributes.id.value === "id-appointments") {
    generateAppointmentsTable();
  }
}

// remove rows from table body
function removeTableRows(table) {
  for (let i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }
}

generateSchedulesTable();

// generate table for schedules
function generateSchedulesTable() {
  removeTableRows(tableSchedules);
  sendOrGetData("../controllers/appointments.php").then(data => {
    let number = 0;
    for (let element of data) {
      number += 1;
      let row = tbodySchedules.insertRow();
      row.setAttribute('id', element['schedule_id']);
      let cellNumber = row.insertCell();
      cellNumber.innerHTML = number;
      for (let key in element) {
        if (key != 'schedule_id') {
          let cell = row.insertCell();
          cell.innerHTML = element[key];
        }
        // let cellText = createTextNode(element[key]);
        // cell.appendChild(cellText);
      }
      let cellActions = row.insertCell();
      let button = document.createElement('input');
      button.setAttribute('type', 'button');
      button.setAttribute('value', 'book');
      button.setAttribute('class', 'btn btn--green btn--action js--btn-book');
      button.setAttribute('onclick', 'btnBookClickHandler(event)');
      cellActions.appendChild(button);
    }
  });
}

// search table of schedules
window.searchSchedules = function searchSchedules() {
  let input, filter, tr, tdDoc, tdDep, i, txtValueDoc, txtValueDep;
  input = document.getElementById("search-schedule");
  filter = input.value.toUpperCase();
  tr = tableSchedules.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    tdDoc = tr[i].getElementsByTagName("td")[1];
    tdDep = tr[i].getElementsByTagName("td")[2];
    if (tdDoc && tdDep) {
      txtValueDoc = tdDoc.textContent || tdDoc.innerText;
      txtValueDep = tdDep.textContent || tdDep.innerText;
      if ((txtValueDoc.toUpperCase().indexOf(filter) > -1) ||
        (txtValueDep.toUpperCase().indexOf(filter) > -1)) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}


// generate table for appointments
async function generateAppointmentsTable() {
  const patient = {}
  const user = await userData;
  patient.patientId = user.user_id;
  const json = JSON.stringify(patient);
  sendOrGetData("../controllers/bookedAppointments.php", json, "POST").then(data => {
    if (data[0].success === false) {
      tableAppointments.style.display = "none";
      AppointmentsErrorMessage.innerHTML = data[0].message;
      AppointmentsErrorMessage.style.display = "block";
    } else {
      AppointmentsErrorMessage.style.display = "none";
      removeTableRows(tableAppointments);
      if (tableAppointments.style.display == "none") {
        tableAppointments.style.display = "block";
      }
      let number = 0;
      for (let element of data) {
        number += 1;
        let row = tbodyAppointments.insertRow();
        row.setAttribute('id', number)
        let cellNumber = row.insertCell()
        cellNumber.innerHTML = number;
        for (let key in element) {
          let cell = row.insertCell();
          cell.innerHTML = element[key];
        }
        let cellStatus = row.insertCell();
        let appointmentDate = element['date'] + " " + element['next'];
        if (new Date() > new Date(appointmentDate)) {
          cellStatus.setAttribute('class', 'text--red');
          cellStatus.innerHTML = "outdated";
        } else {
          cellStatus.innerHTML = "pending";
          cellStatus.setAttribute('class', 'text--green');
        }
      }
    }
  });
}

// table for selected appointment
function generateTableForSelectedAppointment() {
  const cells = event.target.parentNode.parentNode.cells;
  let tableSelectedAppointment = document.createElement("table");
  tableSelectedAppointment.setAttribute('class', 'table__selected-appointment');
  const headRow = document.createElement('tr');
  const ths = ['Doctor', 'Department', 'Date', 'Appointment'];
  ths.forEach(thValue => {
    const th = document.createElement("th");
    th.innerHTML = thValue;
    headRow.appendChild(th);
  });
  tableSelectedAppointment.appendChild(headRow);
  const numberOfCells = 4;
  const bodyRow = document.createElement('tr');
  for (let i = 1; i <= numberOfCells; i++) {
    let cell = bodyRow.insertCell();
    cell.innerHTML = cells[i].outerText;
  }
  tableSelectedAppointment.appendChild(bodyRow);
  return tableSelectedAppointment;
}

// remove elements inside modal body
function removeElementFromModal() {
  modalBody.childNodes.forEach(element => {
    if (element.id != "title-selected-appointment") {
      element.remove();
    }
  });
}

// id of selected schedule
let scheduleId;

// action button handler in the table of schedules 
window.btnBookClickHandler = function btnBookClickHandler(event) {
  // remove element inside modal body
  removeElementFromModal();

  // appointment id set as an id of a tr 
  scheduleId = event.target.parentNode.parentNode.id;
  const table = generateTableForSelectedAppointment()
  modalBody.appendChild(table);
  const btnCancel = '<button class="btn btn--cancel modal--footer__btn" onclick="closeModal()">Cancel</button>';
  const btnBook = '<button class="btn btn--green modal--footer__btn" onClick="bookAppointment(event)">Book</button>';
  modalFooter.innerHTML = btnCancel + btnBook;
  modal.style.display = "block";
  // console.log(appointmentId);
  event.preventDefault();
}

window.bookAppointment = async function bookAppointment(event) {
  const patient = await userData;
  const appointment = {};
  appointment.patientId = patient.user_id;
  appointment.scheduleId = scheduleId;
  const json = JSON.stringify(appointment);
  sendOrGetData("../controllers/bookAppointment.php", json, "POST").then(result => {
    closeModal();
    event.preventDefault();
    return alert(result[0].message);
  });
}

window.closeModal = function closeModal() {
  modal.style.display = "none";
  // remove element inside modal body
  removeElementFromModal();
}

window.onclick = function (event) {
  if (event.target == modal) closeModal();
}

