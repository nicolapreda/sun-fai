<?php

// -------------------------
// CONFIGURATION
// -------------------------
include "connect.php";

$query = "SELECT * FROM Token";

try {
    $result = $conn->query($query);
} catch (PDOException $e) {
    // echo "DB Error on Query: " . $e->getMessage();
    $error = true;
}

$rows_get_token = $result->fetchAll(PDO::FETCH_ASSOC);

$USERNAME = $rows_get_token[0]["username"];
$PASSWORD  = $rows_get_token[0]["pwd"];

$BASE_URL = "https://eu5.fusionsolar.huawei.com/thirdData";

// Will be used to store cookies in memory
$COOKIE_FILE = __DIR__ . "/fusionsolar_cookie.txt";


// -------------------------
// LOGIN FUNCTION
// -------------------------
function fs_login($username, $password, $baseUrl, $cookieFile) {
    $url = $baseUrl . "/login";
    $payload = json_encode([
        "userName" => $username,
        "systemCode" => $password,
    ]);

    // send login request
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Connection: keep-alive"
    ]);
    curl_setopt($ch, CURLOPT_HEADER, true);             // IMPORTANT: return headers
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);

    $response = curl_exec($ch);

    // split headers + body
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);

    $json = json_decode($body, true);

    if (!isset($json["success"]) || !$json["success"]) {
        die("Login failed: " . json_encode($json));
    }

    // extract XSRF token from Set-Cookie
    preg_match('/XSRF-TOKEN=([^;]+)/', $headers, $matches);
    if (!isset($matches[1])) {
        die("Could not extract XSRF-TOKEN");
    }

    $token = $matches[1];
    file_put_contents(__DIR__ . "/xsrf_token.txt", $token);

    // echo "Login successful.\n";
}



// -------------------------
// API REQUEST FUNCTION
// -------------------------
function fs_request($function, $data, $baseUrl, $cookieFile) {
    $url = $baseUrl . "/" . $function;
    $payload = json_encode($data);

    $token = trim(file_get_contents(__DIR__ . "/xsrf_token.txt"));

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Connection: keep-alive",
        "XSRF-TOKEN: $token",
        "Cookie: XSRF-TOKEN=$token"
    ]);

    $response = curl_exec($ch);

    return json_decode($response, true);
}




// -------------------------
// MAIN SCRIPT
// -------------------------
fs_login($USERNAME, $PASSWORD, $BASE_URL, $COOKIE_FILE);
// ---- Example API calls ----

// 1. Get stations
$stations = fs_request("stations", ["pageNo" => 1], $BASE_URL, $COOKIE_FILE);
// echo json_encode($stations, JSON_PRETTY_PRINT);

$stationCode = $stations['data']['list'][0]['plantCode'];
// echo "Station code: $stationCode\n";

// 2. Get real-time KPI
$kpi = fs_request("getStationRealKpi",
    ["stationCodes" => $stationCode],
    $BASE_URL,
    $COOKIE_FILE
);
// echo json_encode($kpi, JSON_PRETTY_PRINT);
$day_on_grid_energy = $kpi['data'][0]['day_on_grid_energy'];


// 3. Get device list
$devices = fs_request("getDevList",
    ["stationCodes" => $stationCode],
    $BASE_URL,
    $COOKIE_FILE
);
$devId_json = json_encode($devices, JSON_PRETTY_PRINT);
// echo $devId_json;

$devices_retrieved = [];
$grid_id ="";
$grid_type = "";
$dev_type=38;
foreach ($devices["data"] as $i){
    $devices_retrieved[] = [$i["devDn"], $i["devTypeId"], $i["devName"]];
    if($i["devTypeId"]==$dev_type){
        $grid_id .= $i["devDn"].",";
        $grid_type .= "$dev_type".",";
    }
}
$grid_id = rtrim($grid_id, ",");
$grid_type = rtrim($grid_type, ",");

// echo json_encode($devices_retrieved, JSON_PRETTY_PRINT);
// echo json_encode($grid_id, JSON_PRETTY_PRINT);

// 4. Example: get one device’s history

$startTime = strtotime("-1 days") * 1000;
$endTime = time() * 1000;

// echo "Inverter ID: ".$grid_id;
// echo "Inverter Type: ".$grid_type;

$hist = fs_request("getDevHistoryKpi",
    [
        "devIds"     => $grid_id,
        "devTypeId"  => $grid_type,
        "startTime"  => $startTime,
        "endTime"    => $endTime
    ],
    $BASE_URL,
    $COOKIE_FILE
);

// print_r($hist);
// $response = json_encode($hist, JSON_PRETTY_PRINT);

foreach ($hist['data'] as $data_get) {
    // Accediamo a dataItemMap per prendere active_cap
    $active_cap = $data_get['dataItemMap']['day_cap'];
    echo "Day Cap: " . $active_cap . "<br>";
}

foreach ($respose["data"] as $data_get)
{
    $data_retrieved[] = [$data_get["devId"], $data_get["collectTime"], $data_get["dataItemMap"], $data_get["active_cap"]];
}


// echo "\nDone.\n";
?>