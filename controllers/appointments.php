<?php
require'connection.php';

class Appointments {

  public function getAppointments($con){
    $query_get_appointments = "SELECT S.schedule_id, D.name, D.department, S.schedule_date, S.next_appointment_time as next FROM schedules S INNER JOIN doctors D ON D.doctor_id = S.doctor_id WHERE S.schedule_date >= CAST(CURRENT_TIMESTAMP AS Date) ORDER BY S.schedule_date ASC";


    $result = mysqli_query($con, $query_get_appointments);

    // return $result;
    $rows = [];
    if(mysqli_num_rows($result) > 0){
      while($rw = mysqli_fetch_array($result)){
        array_push($rows, array('schedule_id' => $rw['schedule_id'], 'name' => $rw['name'], 'department' => $rw['department'], 'schedule_date' => $rw['schedule_date'], 'next' => $rw['next'] ));
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

$appointment = new Appointments();
$result = $appointment->getAppointments($con);
if(count($result) > 0){
  echo json_encode($result);
} else{
  echo json_encode($appointment->response(false, 'Schedules not found'));
}
