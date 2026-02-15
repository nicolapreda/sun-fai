<?php
// TODO: gestisci ora solare

function http_request($url, $params, $timeout)
{
    $queryString = http_build_query($params);
    $full_url = $url . '?' . $queryString;
    // echo "\n".$full_url;
    $response = file_get_contents($full_url);
    $json_response = json_decode($response);
    return $json_response;
}

class Init
{
    public $env_api_key = 'SOLAREDGE_API_KEY';
    public $env_site_id = 'SOLAREDGE_SITE_ID';
    public $env_output_format = 'SOLAREDGE_OUTPUT_FORMAT';

    public $output_format_default = 'json';

    public $config_file_user = '~/.solaredge-interface';
    public $config_file_system = '/etc/solaredge-interface';
    public $config_section_name = 'solaredge-interface';

    public $solaredge_api_baseurl = 'https://monitoringapi.solaredge.com';
    public $http_request_timeout = 10;

    public function __construct() {}
}

class Date_utilities
{

    public $FORMAT_DATE_STRING = '%Y-%m-%d';
    public $FORMAT_DATETIME_STRING = '%Y-%m-%d %H:%M:%S';
    public $FORMAT_DATETIME_TIMEZONE_STRING = '%Y-%m-%d %H:%M:%S %Z%z';
    public $DICT_KEY_CONTAIN_CONVERT_DATETIME = ['date', 'time'];

    public function _constructor() {}

    public function string_to_datetime($string)
    {
        try {
            $dt = new DateTime($string);
        } catch (Exception $e) {
            return $string;
        }
        return $dt;
    }

    public function set_datetime_tzinfo(&$data, $tz = 'Europe/Rome')
    {
        if (is_array($data)) {
            foreach ($data as &$item) {
                $this->set_datetime_tzinfo($item, $tz);
            }
        } elseif (is_object($data)) {
            foreach ($data as $key => &$value) {
                $this->set_datetime_tzinfo($value, $tz);
            }
        } elseif ($data instanceof DateTime) {
            if ($data->getTimezone()->getName() === 'Z' && $tz) {
                $timezone = new DateTimeZone($tz);
                $data->setTimezone($timezone);
            }
        }
        return $data;
    }
}


class SolarEdgeAPI
{
    public $api_key = "";
    public $du;
    public $in;


    public function __construct($api_key)
    {
        if ($api_key == "") throw new SolarEdgeInterfaceException("Must provide a SolarEdge api_key value.");
        $this->api_key = $api_key;
        $this->du = new Date_utilities();
        $this->in = new Init();
    }

    public function response_energy_wrapper($response, $site_id)
    {
        foreach ($response->energyDetails->meters as &$meter) {
            foreach ($meter->values as &$value) {
                $value->date = $this->du->string_to_datetime($value->date);
                $value->date = $this->du->set_datetime_tzinfo($value->date);
            }
        }
        return $response;
    }

    public function response_power_wrapper($response, $site_id)
    {
        foreach ($response->powerDetails->meters as &$meter) {
            foreach ($meter->values as &$value) {
                $value->date = $this->du->string_to_datetime($value->date);
                $value->date = $this->du->set_datetime_tzinfo($value->date);
            }
        }
        return $response;
    }


    public function get_site_energy_details($site_id, $start_time, $end_time, $unit_time = "", $meters = "")
    {
        $partList = [];
        $partList[] = $this->in->solaredge_api_baseurl;
        $partList[] = "site";
        $partList[] = $site_id;
        $partList[] = "energyDetails";

        $url = implode('/', $partList);


        $params = [
            'meters' => $meters,
            'timeUnit' => $unit_time,
            'api_key' => $this->api_key,
            'startTime' => $start_time,
            'endTime' => $end_time
        ];


        $response_wrapped = $this->response_energy_wrapper(http_request($url, $params, $this->in->http_request_timeout), $site_id);

        return $response_wrapped;
    }


    public function get_site_power_details($site_id, $start_time, $end_time, $unit_time = "", $meters = "")
    {
        $partList = [];
        $partList[] = $this->in->solaredge_api_baseurl;
        $partList[] = "site";
        $partList[] = $site_id;
        $partList[] = "powerDetails";

        $url = implode('/', $partList);

        $params = [
            'meters' => $meters,
            'timeUnit' => $unit_time,
            'api_key' => $this->api_key,
            'startTime' => $start_time,
            'endTime' => $end_time
        ];

        $response_wrapped = $this->response_power_wrapper(http_request($url, $params, $this->in->http_request_timeout), $site_id);

        return $response_wrapped;
    }
}

class HuaweiAPI{
    public $token = "";
    public $user_name = "";
    public $system_code = "";
    public $base_url = "https://intl.fusionsolar.huawei.com/thirdData";
    public $du;
    public $station_list;

    public function __construct($token, $user_name, $system_code)
    {
        $this->token = $token;
        $this->user_name = $user_name;
        $this->system_code = $system_code;
        $this->du = new Date_utilities();
        $this->station_list = $this->get_station_list();
    }

    public function get_station_list(){
        $query = "getStationList";
        $url = $this->base_url . '/' . $query;
        $params = [];
        $response = http_request($url, $params, 10);
        $this->station_list = $response->data ?? [];
        return $this->station_list;
    }
    
    public function get_dev_list($station_code){
        $query = "getDevList";
        $url = $this->base_url . '/' . $query;
        $body = [
            "station_code" => $station_code,
        ];

        $response = http_request($url, $body, 10);
        return $response->data ?? [];
    }

    public function get_station_kpi_real($station_code, $date){
        $query = "getStationRealKpi";
        $url = $this->base_url . '/' . $query;
        $body = [
            "station_code" => $station_code,
        ];

        $response = http_request($url, $body, 10);
        return $response->data ?? [];

    }

    public function get_dev_kpi_hist($device_id, $device_type_id, $start_time, $end_time){
        $timezone = new DateTimeZone('Europe/Rome');   
        $start_dt = new DateTime($start_time, $timezone);
        $end_dt = new DateTime($end_time, $timezone);
        $start_timestamp_ms = $start_dt->getTimestamp() * 1000;
        $end_timestamp_ms = $end_dt->getTimestamp() * 1000;
        $body = [
            "devIds" => $device_id,
            "devTypeId" => $device_type_id,
            "startTime" => $start_timestamp_ms,
            "endTime" => $end_timestamp_ms,
        ];
        $query = "getDevHistoryKpi";
        $url = $this->base_url . '/' . $query;
        $response = http_request($url, $body, 10);
        return $response->data ?? [];
    }

}

function arrotonda_15($minute)
{
    $minute = (int)$minute;
    return str_pad((floor($minute / 15) * 15), 2, '0', STR_PAD_LEFT);
}


function date_arrotondate($istant)
{
    // Create dates in Europe/Rome timezone which handles DST automatically
    $delta = new DateInterval('PT2880M');
    $time_1giornofa = clone $istant;
    $time_1giornofa->sub($delta);

    // Format using the timezone-aware DateTime object
    $minuto_iniziale_arrotondato = arrotonda_15($time_1giornofa->format('i'));
    $data_iniziale_arrotondata = $time_1giornofa->format("Y-m-d H:{$minuto_iniziale_arrotondato}:00");

    $minuto_finale_arrotondato = arrotonda_15($istant->format('i'));
    $data_finale = $istant->format("Y-m-d H:{$minuto_finale_arrotondato}:00");

    return [$data_iniziale_arrotondata, $data_finale];
}

// ==================================================================== //
// ==================================================================== //
// ============================= MAIN CODE ============================ //
// ==================================================================== //
// ==================================================================== //

include "connect.php";
$query_account_solaredge = "SELECT API_KEY, SITE_ID FROM Account_Solaredge";
$query_account_huawei = "SELECT DEV_ID, DEV_TYPE_ID FROM Account_Huawei";
$query_token = "SELECT * FROM Token";
$query_get_token = "SELECT username, pwd FROM Token";

try {
    $result_get_token = $conn->query($query_get_token);
    $result_account_solaredge = $conn->query($query_account_solaredge);
    $result_account_huawei = $conn->query($query_account_huawei);
    $result_token = $conn->query($query_token);
    $error = false;
} catch (PDOException $e) {
    echo "DB Error on Query: " . $e->getMessage();
    $error = true;
}
if (!$error) {
    $rows_get_token = $result_get_token->fetchAll(PDO::FETCH_ASSOC);
    $username = $rows_get_token[0]["username"];
    $system_code = $rows_get_token[0]["pwd"];
} else {
    $token_response = null;
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
}

$action = $_GET["action"] ?? "";
if ($action == "get_token") {

    $token_url = "https://eu5.fusionsolar.huawei.com/thirdData/login";
    $token_body = [
        "username" => $username,
        "system_code" => $system_code
    ];
    $token_response = http_request($token_url, $token_body, 10);
    header('Content-Type: application/json');
    $query_set_token = "UPDATE Token SET token='" . $token_response->data->token . "' WHERE username='" . $username . "'";
    try {
        $result_set_token = $conn->query($query_set_token);
        $error_set = false;
    } catch (PDOException $e) {
        echo "DB Error on Query: " . $e->getMessage();
        $error_set = true;
    }
    exit();
}

if (!$error) {
    $rows_account_solaredge = $result_account_solaredge->fetchAll(PDO::FETCH_ASSOC);
    $rows_token = $result_token->fetchAll(PDO::FETCH_ASSOC);
    $rows_account_huawei = $result_account_huawei->fetchAll(PDO::FETCH_ASSOC);
    $timezone = new DateTimeZone('Europe/Rome');
    $istant = new DateTime('now', $timezone);
    list($data_inizio, $data_fine) = date_arrotondate($istant);

    $start_date = $_GET["data_inizio"] ?? $data_inizio;
    $final_date = $_GET["data_fine"] ?? $data_fine;

    // echo "\nData inizio: ".$start_date;
    // echo "\nData fine: ".$data_fine;

    $start_date_obj = new DateTime($start_date, $timezone);
    $final_date_obj = new DateTime($final_date, $timezone);
    $interval = $start_date_obj->diff($final_date_obj);
    $minutes = ($interval->days * 24 * 60) + ($interval->h * 60) + $interval->i;
    $numero_rivelazioni = $minutes / 15;

    $responses_energy = [];
    $responses_power = [];

    foreach ($rows_account_solaredge as $account) {
        $api = new SolarEdgeAPI($account["API_KEY"]);
        $responses_energy[] = $api->get_site_energy_details($account["SITE_ID"], $start_date, $final_date, "QUARTER_OF_AN_HOUR", "FeedIn");
        $responses_power[] = $api->get_site_power_details($account["SITE_ID"], $start_date, $final_date, "QUARTER_OF_AN_HOUR", "FeedIn");
    }

    if(count($rows_account_huawei) ==0){
        $api = new HuaweiAPI($rows_token[0]["token"], $username, $system_code);
        $station_list = $api->get_station_list();
        foreach ($station_list as $station) {
            $dev_list = $api->get_dev_list($station->station_code);
            foreach ($dev_list as $device) {
                $query = "INSERT INTO Account_Huawei (DEV_ID, DEV_TYPE_ID) VALUES ('" . $device->devId . "', '" . $device->devTypeId . "')";
                try {
                    $result_insert_device = $conn->query($query);
                    $error_insert = false;
                } catch (PDOException $e) {
                    echo "DB Error on Query: " . $e->getMessage();
                    $error_insert = true;
                }
                $rows_account_huawei[] = [
                    "DEV_ID" => $device->devId,
                    "DEV_TYPE_ID" => $device->devTypeId
                ];
            }
        }
    }

    foreach( $rows_account_huawei as $account_huawei ) {
        $api_huawei = new HuaweiAPI($rows_token[0]["token"], $username, $system_code);
        $difference_in_seconds = ($final_date_obj->getTimestamp() - $start_date_obj->getTimestamp());
        $intermediate = [];
        while ($difference_in_seconds > 129600) { //129600 seconds = 36 hours
            $final_date_int = $intial_date_obj->modify('+36 hours');
            $intermediate[] = $api_huawei->get_dev_kpi_hist($account_huawei["DEV_ID"], $account_huawei["DEV_TYPE_ID"], $start_date, $final_date_int->format("Y-m-d H:i:s"))['day_cap'];
            for($i = 0; $i < count($intermediate); $i+=3){
                $responses_energy[] = $intermediate[$i]+$intermediate[$i+1]+$intermediate[$i+2];
            }
            $start_date_obj = clone $final_date_int;
            $difference_in_seconds = ($final_date_obj->getTimestamp() - $start_date_obj->getTimestamp());
        }
        if ($difference_in_seconds > 0) {
            $intermediate[] = $api_huawei->get_dev_kpi_hist($account_huawei["DEV_ID"], $account_huawei["DEV_TYPE_ID"], $start_date, $final_date)['day_cap'];
            for($i = 0; $i < count($intermediate); $i+=3){
                $responses_energy[] = $intermediate[$i]+$intermediate[$i+1]+$intermediate[$i+2];
            }
        }
    }



    $i = 0;

    $misure = [];

    $somma_totale_periodo = 0;

    while ($i < $numero_rivelazioni) {
        $somma_energia = 0;
        $somma_potenza = 0;
        $data_ora = new DateTime($start_date);
        if ($i > 0) {
            $minute = "PT" . strval(15 * $i) . "M";
            $data_ora = $data_ora->add(new DateInterval($minute));
        }

        foreach ($responses_energy as $response) {
            $value_flt = floatval($response->energyDetails->meters[0]->values[$i]->value);
            $valore_add = $value_flt / 1000;
            $somma_energia += $valore_add;
        }

        foreach ($responses_power as $response) {
            $value_flt = floatval($response->powerDetails->meters[0]->values[$i]->value);
            $valore_add = $value_flt / 1000;
            $somma_potenza += $valore_add;
        }

        $somma_potenza = round($somma_potenza, 2);

        $somma_round = round($somma_energia, 2);

        $somma_totale_periodo += $somma_round;

        $risultato = [
            'data_ora' => $data_ora->format("Y-m-d H:i:s"),
            'somma_energia' => $somma_round,
            'potenza' => $somma_potenza,
        ];

        $misure[] = $risultato;

        $i += 1;
    }

    $response_final = [
        'misure' => $misure,
        'somma_totale_periodo' => round($somma_totale_periodo, 2) // arrotonda alla seconda cifra decimale
    ];

    header('Content-Type: application/json');
    echo "\n" . json_encode($response_final);
}
