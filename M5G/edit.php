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
$title = $json_obj['title'];
$day = $json_obj['day'];
$year = $json_obj['year'];
$month = $json_obj['month'];
$token = $json_obj['token'];
$newtitle = $json_obj['newtitle'];
$newday = $json_obj['newday'];
$newhour = $json_obj['newhour'];
$newmin = $json_obj['newminute'];
$newtag = $json_obj['newtag'];



if ($token != $_SESSION['token']) {
	echo json_encode(array("failure" => "token mismatch"));
	exit;
}

$stmt1 = $mysqli->prepare("delete from events WHERE username=? AND month=? AND year=? AND title=? AND day=?");
if(!$stmt1){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt1->bind_param('siisi', $username, $month, $year, $title, $day);

$stmt1->execute();

$stmt1->close();

$stmt = $mysqli->prepare("insert into events (username, title, year, month, day, hour, minute, tag) values (?, ?, ?, ?, ?, ?, ?, ?)");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->bind_param('ssiiiiis', $username, $newtitle, $year, $month, $newday, $newhour, $newmin, $newtag);

$stmt->execute();

$stmt->close();

echo json_encode(array(
		"username" => $username,
		"title" => $title
	));

?>