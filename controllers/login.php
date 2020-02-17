<?php
session_start();
$data = json_decode(file_get_contents('php://input'));

// $value = json_encode(array(
//     'username' => 'username1',
//     'password' => 'username',
//     'userType' => 'doctor'
// ));

// echo '   '.$value.'<br><br><br>';

// $data = json_decode($value);

require'connection.php';

class Login {
  private $username;
  private $password;
  private $user_type;

  public function __construct($data){
    $this->username = $data->username;
    $this->password = $data->password;
    $this->user_type = $data->userType;
  }

  public function getUserData($con){
    $table;
    if($this->user_type == 'patient'){
      $table = 'patient';
    }
    if($this->user_type == 'doctor'){
      $table = 'doctors';
    }
    $result = mysqli_query($con, "SELECT * from $table where username ='$this->username'");

    $rows = [];
    if(mysqli_num_rows($result) > 0){
      $rows = mysqli_fetch_array($result);
      return $rows;
    } else {
      return $rows;
    }
  }

  public function wrongUsernameOrPasswordResponse(){
    echo json_encode($this->response(false, 'Incorrect Username or Password'));
  }

  public function response($success, $message){
    $response = [];
    array_push($response, array('success' => $success, 'message' => $message));
    return $response;
  }
}

$login = new Login($data);

$rows = $login->getUserData($con);

if(password_verify($data->password, $rows['password'])){
  $_SESSION['login'] = true;
  $_SESSION['name'] = $rows['name'];
  if($data->userType == 'doctor'){
    $_SESSION['user_type'] = 'doctor';
    $_SESSION['user_id'] = $rows['doctor_id'];
  }
  if($data->userType == 'patient'){
    $_SESSION['user_type'] = 'patient';
    $_SESSION['user_id'] = $rows['patient_id'];
  }
  $response = $login->response(true, 'Successfully logged in');
  array_push($response, array('login' => $_SESSION['login'], 'userId' => $_SESSION['user_id'], 'name' => $_SESSION['name'], 'userType' => $_SESSION['user_type']));
  echo json_encode($response);
} else {
  $login->wrongUsernameOrPasswordResponse();
}