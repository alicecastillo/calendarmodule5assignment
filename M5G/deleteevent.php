<?php
require 'database.php';

session_start();

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $_SESSION['username'];
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

$title = $json_obj['title'];
$day = $json_obj['day'];

$token = $json_obj['token'];


if ($token != $_SESSION['token']) {
	echo json_encode(array("failure" => "token mismatch"));
	exit;
}


$stmt = $mysqli->prepare("DELETE FROM events WHERE username=? AND title=? AND day=?");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->bind_param('ssi', $username, $title, $day);

$stmt->execute();

$stmt->close();

echo json_encode(array(
		"username" => $username,
		"title" => $title,
        "day" => $day
	));

?>