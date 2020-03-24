<?php
    session_start();
    $_SESSION = array();
    session_destroy();
    echo json_encode(array(
		"success" => true
	));
?>