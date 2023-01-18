<?php
require_once 'db_connection.php';
require_once 'actions.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $response['data'] = rand(1, 4);
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'));
    $imageId = $data->imageId;

    if (empty($data->action)) {
        echo "Missed action";
    }

    switch ($data->action) {
        case INCREASE_VIEW_NUMBER;
            $response['message'] = increase_view_count($imageId);
            $response['data'] = get_current_view_count($imageId);
            break;
        case GET_CURRENT_VIEW_COUNT;
            $response['data'] = get_current_view_count($imageId);
            break;
    }
}

function increase_view_count($imageId)
{
    global $conn;
    $ipAddress = $_SERVER['REMOTE_ADDR'];

    $sql = "SELECT * FROM logs WHERE ip_address='$ipAddress' AND image_mark='$imageId' LIMIT 1";
    $query = mysqli_query($conn, $sql);
    $numRows = mysqli_num_rows($query);
    if ($numRows > 0) {
        $sql = "UPDATE logs SET view_count = view_count + , view_date = now() WHERE ip_address='$ipAddress' AND image_mark='$imageId'";
    } else {
        $sql = "INSERT INTO logs (ip_address, view_date, image_mark, view_count) VALUES ('$ipAddress', now(), '$imageId', 1)";
    }

    return query($conn, $sql);
}

function query($conn, $sql)
{
    if (mysqli_query($conn, $sql)) {
        $result = "Records processed successfully.";
    } else {
        $result = "ERROR: Could not able to execute $sql. " . mysqli_error($conn);
    }

    return $result;
}

function get_current_view_count($imageId)
{
    global $conn;
    $result = mysqli_query($conn, "SELECT SUM(view_count) AS view_count_sum FROM logs WHERE image_mark = '$imageId'");
    $row = mysqli_fetch_assoc($result);
    return $row['view_count_sum'];
}

echo json_encode($response);
die;