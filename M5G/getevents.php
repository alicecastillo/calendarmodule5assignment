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
$token = $json_obj['token'];


if ($token != $_SESSION['token']) {
	echo json_encode(array("failure" => "token mismatch"));
	exit;
}

$stmt = $mysqli->prepare("select day, hour, minute, title, tag from events WHERE username=? AND month=? AND year=? ORDER BY hour, minute");
$stmt->bind_param('sii', $username, $month, $year);

$stmt->execute();
	
$stmt->bind_result($day, $hour, $minute, $title, $tag);

$events_array = array();
$eventCount = 0;
while($stmt->fetch()){
	$events_array[$eventCount] = array("title" => $title, "day" => $day, "hour" => $hour, "minute" => $minute, "tag" => $tag);
    $eventCount = $eventCount+1;
}

$stmt->close();

$output = json_encode($events_array);

echo $output;

?>