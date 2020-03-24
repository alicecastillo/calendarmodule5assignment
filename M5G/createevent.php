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
$year = $json_obj['year'];
$month = $json_obj['month'];
$day = $json_obj['day'];
$hour = $json_obj['hour'];
$minute = $json_obj['minute'];
$tag = $json_obj['tag'];
$token = $json_obj['token'];


if ($token != $_SESSION['token']) {
	echo json_encode(array("failure" => "token mismatch"));
	exit;
}


$stmt = $mysqli->prepare("insert into events (username, title, year, month, day, hour, minute, tag) values (?, ?, ?, ?, ?, ?, ?, ?)");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->bind_param('ssiiiiis', $username, $title, $year, $month, $day, $hour, $minute, $tag);

$stmt->execute();

$stmt->close();

echo json_encode(array(
		"username" => $username,
		"title" => $title
	));

?>