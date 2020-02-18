<?php
$data = json_decode(file_get_contents('php://input'));

// $value = json_encode(array(
//     'patientId' => 15, 'appointmentId' => 46
// ));

// $data = json_decode($value);

// $response = [];
// array_push($response, array('success' => true));
// echo json_encode($data);

require'connection.php';

class CancelAppointments
{
    private $patient_id;
    private $appointment_id;

    // constructor
    public function __construct($data)
    {
      $this->patient_id = $data->patientId;
      $this->appointment_id = $data->appointmentId;
    }

    public function cancelAppointment($con){
      $query_cancel_appointment = "UPDATE appointments SET is_canceled = true WHERE appointment_id = $this->appointment_id";
      $result = json_encode(mysqli_query($con, $query_cancel_appointment));
      if($result){
        echo json_encode($this->response(true, 'Successfully Canceled.'));
      } else {
        echo json_encode($this->response(false, 'Failed to Cancel. Please try again!'));
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

$cancel_Appointments = new CancelAppointments($data);

$cancel_Appointments->cancelAppointment($con);

