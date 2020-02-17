<?php
session_start();
// session_destroy();
$response = array('success' => false, 'message' => 'User is not authenticated');
if(isset($_SESSION['login'])){
  $response = array(
    'success'=> true,
    'user_id' => $_SESSION['user_id'],
    'name' => $_SESSION['name'],
    'user_type' => $_SESSION['user_type']
  );
}

echo json_encode($response);
