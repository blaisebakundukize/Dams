<?php
$data = json_decode(file_get_contents('php://input'));

// $value = json_encode(array(
//     'appointmentId' => '47',
//     'isConsulted' => false,
// ));

// echo '   '.$value.'<br><br><br>';

// $data = json_decode($value);

require'connection.php';

class ConsultPatient {

  private $appointment_id;
  private $is_consulted;

  public function __construct($data){
    $this->appointment_id = $data->appointmentId;
    // $this->is_consulted = $data->isConsulted;
  }

  public function consultedPatient($con){
    $query_consult_patient = "UPDATE appointments SET is_consulted = !is_consulted WHERE appointment_id = $this->appointment_id";
    $result = json_encode(mysqli_query($con, $query_consult_patient));
    if($result){
        echo json_encode($this->response(true, 'Succeeded to set for patient consultation.'));
      } else {
        echo json_encode($this->response(false, 'Failed to set for patient consultation. Please try again!'));
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

$consultation = new ConsultPatient($data);

$consultation->consultedPatient($con);
