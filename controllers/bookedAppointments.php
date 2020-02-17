<?php
$data = json_decode(file_get_contents('php://input'));

// $value = json_encode(array(
//     'patientId' => 15
// ));

// $value = json_encode(array(
//     'doctorId' => 4,
//     'scheduleDate' => "2019-10-27"
// ));

// echo '   '.$value.'<br><br><br>';

// $data = json_decode($value);

// $response = [];
// array_push($response, array('success' => true));
// echo json_encode($data);

require'connection.php';

class BookedAppointments
{
    private $patient_id;
    private $doctor_id;
    private $schedule_date;

    // constructor
    public function __construct($data)
    {
      if(isset($data->doctorId)){
        $this->doctor_id = $data->doctorId;
        $this->schedule_date = $data->scheduleDate;
      } else {
        $this->patient_id = $data->patientId;
      }
    }

    // get booked appointments for patients
    public function getPatientAppointments($con){
      $query_get_appointments = "SELECT D.name, D.department, S.schedule_date, A.appointment_time FROM appointments A INNER JOIN schedules S on S.schedule_id = A.schedule_id INNER JOIN doctors D on D.doctor_id = S.doctor_id WHERE A.patient_id = $this->patient_id ORDER BY S.schedule_date DESC";

      $result = mysqli_query($con, $query_get_appointments);

      // return $result;
      $rows = [];
      if(mysqli_num_rows($result) > 0){
        while($rw = mysqli_fetch_array($result)){
          array_push($rows, array('name' => $rw['name'], 'department' => $rw['department'], 'scheduleDate' => $rw['schedule_date'], 'appointmentTime' => $rw['appointment_time']));
        }
        return $rows;
      }else{
        return $rows;
      }

    }

    // get booked appointments for a doctor
    public function getDoctorAppointments($con){
      $query_get_appointments = "SELECT P.name, D.department, S.schedule_date, A.appointment_time FROM patient P INNER JOIN appointments A on P.patient_id = A.patient_id INNER JOIN schedules S on S.schedule_id = A.schedule_id INNER JOIN doctors D on D.doctor_id = S.doctor_id WHERE S.schedule_date = '$this->schedule_date' AND D.doctor_id = $this->doctor_id";

      $result = mysqli_query($con, $query_get_appointments);

      // return $result;
      $rows = [];
      if(mysqli_num_rows($result) > 0){
        while($rw = mysqli_fetch_array($result)){
          array_push($rows, array('name' => $rw['name'], 'department' => $rw['department'], 'scheduleDate' => $rw['schedule_date'], 'appointmentTime' => $rw['appointment_time']));
        }
        return $rows;
      }else{
        return $rows;
      }
    }

    // response message
    public function response($success, $message)
    {
        $response = [];
        array_push($response, array('success' => $success, 'message' => $message));
        return $response;
    }
}

$booked_appointments = new BookedAppointments($data);
$result;
$message;
if(isset($data->doctorId)){
  $result = $booked_appointments->getDoctorAppointments($con);
  $message = 'Appointments for Doctor not found';
} else {
  $result = $booked_appointments->getPatientAppointments($con);
  $message = 'Appointments for patient not found';
}
if(count($result) > 0){
  echo json_encode($result);
} else {
  echo json_encode($booked_appointments->response(false, $message));
}

