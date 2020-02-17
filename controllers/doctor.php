<?php
$data = json_decode(file_get_contents('php://input'));

// $value = json_encode(array(
//     'date' => '2019-10-22',
//     'start' => '2019-10-22 08:00',
//     'end' => '2019-10-22 18:00',
//     'bookings' => 27,
//     'doctorId' => '4',
//     'nextAppointment' => '08:20'
// ));

// echo '   '.$value.'<br><br><br>';

// $data = json_decode($value);

require'connection.php';

class Schedules {
  private $schedule_date;
  private $schedule_time_from;
  private $schedule_time_end;
  private $booking_number;
  private $doctor_id;
  private $next_appointment_time;

  public function __construct($data){
    $this->schedule_date = $data->date;
    $this->schedule_time_from = $data->start;
    $this->schedule_time_end = $data->end;
    $this->booking_number = $data->bookings;
    $this->doctor_id = $data->doctorId;
    $this->next_appointment_time = $data->nextAppointment;
  }

  public function isScheduleAvailable($con){
    $result = mysqli_query($con, "SELECT schedule_id, schedule_date, time_from, time_end FROM schedules WHERE schedule_date = '$this->schedule_date' AND time_from = '$this->schedule_time_from'");
    return mysqli_num_rows($result) > 0 ? false : true;
  }

  public function setSchedule($con){
    $insert_schedule_query = "INSERT INTO schedules (schedule_date, time_from, time_end, bookings_number, bookings_left, next_appointment_time, doctor_id) VALUES ('$this->schedule_date', '$this->schedule_time_from', '$this->schedule_time_end', $this->booking_number, $this->booking_number, '$this->next_appointment_time', $this->doctor_id)";
    
    $result_insert_schedule = mysqli_query($con, $insert_schedule_query);

    if($result_insert_schedule){
      echo json_encode($this->response(true, 'Scheduling has been successfully set'));
    } else {
      echo json_encode($this->response(false, 'Scheduling Failed. Please try again!'));
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
$schedule = new Schedules($data);

if($schedule->isScheduleAvailable($con)){
  $schedule->setSchedule($con);
}else {
  echo json_encode($schedule->response(false, 'The schedule was already set!'));
}
