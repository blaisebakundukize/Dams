<?php
session_start();
session_unset();
session_destroy();
$response = array('success' => false, 'message' => 'User is not authenticated');
echo json_encode($response);