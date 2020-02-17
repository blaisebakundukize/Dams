<?php
$data = json_decode(file_get_contents('php://input'));

// $value = json_encode(array(
//     'patientId' => 6,
//     'scheduleId' => 4
// ));

// echo '   '.$value.'<br><br><br>';

// $data = json_decode($value);

// $response = [];
// array_push($response, array('success' => true));
// echo json_encode($data);

require'connection.php';

class BookAppointment
{
    private $schedule_id;
    private $patient_id;
    private $appointment_time;
    private $next_appointment_time;
    const MINUTES_PER_PATIENT = '00:20';
    const BREAK_START = '13:00';
    const BREAK_END = '14:00';

    // constructor
    public function __construct($data, $con)
    {
        $this->schedule_id = $data->scheduleId;
        $this->patient_id = $data->patientId;

        $appointment = $this->getAppointmentTime($con);
        if($appointment['next_appointment_time']){
          $this->appointment_time = $appointment['next_appointment_time'];
        }
        // check if user has booked the same schedule today
        if($this->hasAppointmentToday($con)){
          echo json_encode($this->response(false, 'Failed, you have an appointment today with the same doctor!'));
        } else {
          // calculate next appointment time
          $this->calculateNextAppointment();
          // book appointment
          $this->bookAppointment($con);
        }
    }

    // check if patient has an appointment today
    private function hasAppointmentToday($con){
      $result = mysqli_query($con, "SELECT appointment_id FROM appointments WHERE schedule_id = $this->schedule_id AND patient_id = $this->patient_id");
      return mysqli_num_rows($result) > 0 ? true : false;
    }

    // get current appointment time
    private function getAppointmentTime($con){
      $result = mysqli_query($con, "SELECT next_appointment_time FROM schedules WHERE schedule_id = $this->schedule_id");
      $rows;
      if(mysqli_num_rows($result) > 0) {
        $rows = mysqli_fetch_array($result);
      }
      return $rows;
    }

    // calculate next appointment time
    private function calculateNextAppointment(){
      $next_appointment_secs = $this->toSeconds($this->appointment_time) + $this->toSeconds(self::MINUTES_PER_PATIENT);
      $break_start_secs = $this->toSeconds(self::BREAK_START);
      $break_end_secs = $this->toSeconds(self::BREAK_END);
      if($next_appointment_secs >= $break_start_secs and $next_appointment_secs < $break_end_secs){
        $this->next_appointment_time = '14:00';
      } else {
        $this->next_appointment_time = 
        $this->fill(intval($next_appointment_secs / 3600), 2).':'.$this->fill(intval($next_appointment_secs / 60) % 60, 2); 
      }
    }

    // put time into seconds e.g 08:20 -> 60000
    private function toSeconds($s){
      $p = explode(":", $s);
      return intval($p[0]) * 3600 + intval($p[1]) * 60;
    }

    // fill zero in from of hours or mins which are not in tens
    private function fill($s, $digits){
      $s = strval($s);
      while(strlen($s) < $digits) $s = '0'.$s;
      return $s;
    }

    // book appointment
    private function bookAppointment($con){
      $query_update_bookings_left = "UPDATE schedules SET bookings_left = bookings_left - 1, next_appointment_time = '$this->next_appointment_time' WHERE schedule_id = $this->schedule_id";

      $query_insert_appointment = "INSERT INTO appointments (schedule_id, patient_id, appointment_time) VALUES ($this->schedule_id, $this->patient_id, '$this->appointment_time')";

      mysqli_autocommit($con, FALSE);

      $is_bookings_left_updated = mysqli_query($con, $query_update_bookings_left);
      $is_appointment_inserted = mysqli_query($con, $query_insert_appointment);

      if($is_bookings_left_updated and $is_appointment_inserted){
        mysqli_commit($con);
        echo json_encode($this->response(true, 'Successfully booked the appointment'));
      } else {
        mysqli_rollback($con);
        echo json_encode($this->response(false, 'Failed to booked appointment. Please try again!'));
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

$book_appointment = new BookAppointment($data, $con);

