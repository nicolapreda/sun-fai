<?php

function http_request($url, $params, $timeout){
    $queryString = http_build_query($params);
    $full_url=$url.'?'.$queryString;
    $response = file_get_contents($full_url);
    $json_response=json_decode($response);
    return $json_response;
}
?>