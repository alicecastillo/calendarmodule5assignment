<?php
require 'database.php';

session_start();

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:

//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

$username = $_SESSION['username'];
$year = $json_obj['year'];
$month = $json_obj['month'];
$title = $json_obj['title'];
$recipient = $json_obj['recipient'];
$token = $json_obj['token'];
$day = $json_obj['day'];



if ($token != $_SESSION['token']) {
	echo json_encode(array("failure" => "token mismatch"));
	exit;
}

$stmt1 = $mysqli->prepare("select hour, minute from events WHERE username=? AND month=? AND year=? AND day=? AND title=?");
$stmt1->bind_param('siiis', $username, $month, $year, $day, $title);

$stmt1->execute();
	
$stmt1->bind_result($hour, $minute);

while($stmt1->fetch()){
}

$stmt1->close();

$stmt = $mysqli->prepare("insert into events (username, title, year, month, day, hour, minute, tag) values (?, ?, ?, ?, ?, ?, ?, ?)");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$tag = "shared";

$stmt->bind_param('ssiiiiis', $recipient, $title, $year, $month, $day, $hour, $minute, $tag);

$stmt->execute();

$stmt->close();

echo json_encode(array(
		"recipient" => $recipient,
		"title" => $title
	));



?>