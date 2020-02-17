<?php
$data = json_decode(file_get_contents('php://input'));

// require_once(dirname(dirname(__FILE__))."../connection.php");

// $data = json_decode($value);

// $response = [];
// array_push($response, array('success' => true));
// echo json_encode($data);

require'connection.php';

class RegisterUser
{
    private $names;
    private $phone;
    private $email;
    private $username;
    private $password;
    private $department;

    // constructor
    public function __construct($data)
    {
        $this->names = $data->names;
        $this->phone = $data->phone;
        $this->email = $data->email;
        $this->username = $data->username;
        $this->password = $data->password;
        if (isset($data->department)) {
            $this->department = $data->department;
        }
    }

    // check if the username is available
    public function isUsernameAvailable($con, $table)
    {
        $result = mysqli_query($con, "SELECT email FROM $table where username = '$this->username'");
        return mysqli_num_rows($result) > 0 ? false : true;
    }

    // register doctor
    public function registerDoctor($con)
    {
        $hashed_password = $this->hashPassword($this->password);

        $insert_doctor_query = "INSERT into doctors (name, email, phone, username, password, department) VALUES ('$this->names', '$this->email', '$this->phone', '$this->username', '$hashed_password', '$this->department')";

        $result_register_doctor = mysqli_query($con, $insert_doctor_query);

        if($result_register_doctor){
            echo json_encode($this->response(true, 'Successfully registered! Use your username and password to login'));
        } else {
            echo json_encode($this->response(false, 'Registration Failed. Please try again!'));
        }
    }

    // register patient
    public function registerPatient($con)
    {
        $hashed_password = $this->hashPassword($this->password);

        $insert_patient_query = "INSERT into patient (name, email, phone, username, password) VALUES ('$this->names', '$this->email', '$this->phone', '$this->username', '$hashed_password')";

        $result_register_patient = mysqli_query($con, $insert_patient_query);

        if($result_register_patient){
            echo json_encode($this->response(true, 'Successfully registered! Use your username and password to login.'));
        } else {
            echo json_encode($this->response(false, 'Registration Failed. Please try again!'));
        }
    }

    // hash password
    public function hashPassword($password){
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        return $hashedPassword;
    }

    // response message
    public function response($success, $message)
    {
        $response = [];
        array_push($response, array('success' => $success, 'message' => $message));
        return $response;
    }
}

$register_user = new RegisterUser($data);

// validate email
if(filter_var($data->email, FILTER_VALIDATE_EMAIL)){
    // check if the username is available
    $isUsernameAvailable;
    if(isset($data->department)){
    $isUsernameAvailable = $register_user->isUsernameAvailable($con, 'doctors');
    } else {
        $isUsernameAvailable = $register_user->isUsernameAvailable($con, 'patient');
    }

    if ($isUsernameAvailable) {
        isset($data->department) ?  $register_user->registerDoctor($con) : $register_user->registerPatient($con);
    } else {
        echo json_encode($register_user->response(false, "Username is not available"));
    }
} else {
    echo json_encode($register_user->response(false, "Your email address is invalid. Please enter a valid address."));
}

