<?php
$data = json_decode(file_get_contents('php://input'));

// $value = json_encode(array(
//     'from' => '2020-02-19', 'to' => '2020-02-19', 'doctorId' => 14
// ));

// $data = json_decode($value);

// echo json_encode($data);

require'connection.php';

class Report
{
    private $date_from;
    private $date_to;
    private $doctor_id;

    // constructor
    public function __construct($data)
    {
      $this->date_from = $data->from;
      $this->date_to = $data->to;
      $this->doctor_id = $data->doctorId;
    }

    public function getConsultationReport($con){
      $query = "SELECT P.name, D.department, S.schedule_date, A.appointment_time, A.is_consulted FROM patient P INNER JOIN appointments A on P.patient_id = A.patient_id INNER JOIN schedules S on S.schedule_id = A.schedule_id INNER JOIN doctors D on D.doctor_id = S.doctor_id WHERE D.doctor_id = $this->doctor_id AND A.date_created BETWEEN '$this->date_from 00:00:00' AND '$this->date_to 23:59:59' AND S.schedule_date >= '$this->date_to' AND A.is_canceled = false";
      

      $result = mysqli_query($con, $query);

      $rows = [];
      if(mysqli_num_rows($result) > 0){
        while($rw = mysqli_fetch_array($result)){
          array_push($rows, array('name' => $rw['name'], 'department' => $rw['department'], 'scheduleDate' => $rw['schedule_date'], 'appointmentTime' => $rw['appointment_time'],'isConsulted' => $rw['is_consulted']));
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

$report = new Report($data);

$result = $report->getConsultationReport($con);
if(count($result) > 0){
  echo json_encode($result);
} else {
  echo json_encode($report->response(false, "Report not found"));
}
