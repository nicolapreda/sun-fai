<?php
// TODO: gestisci ora solare
include "connect.php";

function http_request($url, $params, $timeout){
    $queryString = http_build_query($params);
    $full_url = $url.'?'.$queryString;
    // echo "\n".$full_url;
    $response = file_get_contents($full_url);
    $json_response = json_decode($response);
    return $json_response;
}

class Init{
    public $env_api_key = 'SOLAREDGE_API_KEY';
    public $env_site_id = 'SOLAREDGE_SITE_ID';
    public $env_output_format = 'SOLAREDGE_OUTPUT_FORMAT';

    public $output_format_default = 'json';

    public $config_file_user= '~/.solaredge-interface';
    public $config_file_system = '/etc/solaredge-interface';
    public $config_section_name = 'solaredge-interface';

    public $solaredge_api_baseurl = 'https://monitoringapi.solaredge.com';
    public $http_request_timeout = 10;

    public function __construct()
    {}
}

class Date_utilities{

    public $FORMAT_DATE_STRING = '%Y-%m-%d';
    public $FORMAT_DATETIME_STRING = '%Y-%m-%d %H:%M:%S';
    public $FORMAT_DATETIME_TIMEZONE_STRING = '%Y-%m-%d %H:%M:%S %Z%z';
    public $DICT_KEY_CONTAIN_CONVERT_DATETIME = ['date', 'time'];

    public function _constructor(){}

    public function string_to_datetime($string){
        try {
            $dt = new DateTime($string);
        } catch (Exception $e) {
            return $string;
        }
        return $dt;
    }

    public function set_datetime_tzinfo(&$data, $tz = 'Europe/Rome') {
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


class SolarEdgeAPI{
    public $api_key="";
    public $du;
    public $in;


    public function __construct ($api_key){
        if($api_key=="") throw new SolarEdgeInterfaceException("Must provide a SolarEdge api_key value.");
        $this->api_key=$api_key;
        $this->du=new Date_utilities();
        $this->in=new Init();
    }

    public function response_energy_wrapper($response, $site_id){
        foreach ($response->energyDetails->meters as &$meter) {
            foreach ($meter->values as &$value) {
                $value->date = $this->du->string_to_datetime($value->date);
                $value->date = $this->du->set_datetime_tzinfo($value->date);
            }
        }
        return $response;
    }

    public function response_power_wrapper($response, $site_id){
        foreach ($response->powerDetails->meters as &$meter) {
            foreach ($meter->values as &$value) {
                $value->date = $this->du->string_to_datetime($value->date);
                $value->date = $this->du->set_datetime_tzinfo($value->date);
            }
        }
        return $response;
    }


    public function get_site_energy_details($site_id, $start_time, $end_time, $unit_time="", $meters=""){
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


    public function get_site_power_details($site_id, $start_time, $end_time, $unit_time="", $meters=""){
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

function arrotonda_15($minute) {
    $minute = (int)$minute;
    return str_pad((floor($minute / 15) * 15), 2, '0', STR_PAD_LEFT);
}


function date_arrotondate($istant) {
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

//per quando implementeremo tutto
// $query="SELECT * FROM Account_Solaredge";
$query = "SELECT API_KEY, SITE_ID FROM Account_Solaredge";

try {
    $result = $conn->query($query);

    
} catch (PDOException $e) {
    echo "DB Error on Query: " . $e->getMessage();
    $error = true;
}

if(!$error){
    $rows=$result->fetchAll(PDO::FETCH_ASSOC);
    $timezone = new DateTimeZone('Europe/Rome');
    $istant = new DateTime('now', $timezone);
    list($data_inizio, $data_fine) = date_arrotondate($istant);
    
    $start_date=$_GET["data_inizio"]??$data_inizio;
    $final_date=$_GET["data_fine"]??$data_fine;

    // echo "\nData inizio: ".$start_date;
    // echo "\nData fine: ".$data_fine;

    $start_date_obj = new DateTime($start_date, $timezone);
    $final_date_obj = new DateTime($final_date, $timezone);
    $interval = $start_date_obj->diff($final_date_obj);
    $minutes = ($interval->days * 24 * 60) + ($interval->h * 60) + $interval->i;
    $numero_rivelazioni = $minutes / 15;
    
    // echo "https://monitoringapi.solaredge.com/site/3204900/energyDetails?meters=FeedIn&timeUnit=QUARTER_OF_AN_HOUR&startTime=2025-03-30%2021:45:00&endTime=2025-03-31%2021:30:00&api_key=K6WKSZ8XBV1F4A7VPNHR3TXC20QIO0TG";

    $responses_energy=[];
    $responses_power=[];

    

    foreach($rows as $Account_Solaredge){
        $api=new SolarEdgeAPI($Account_Solaredge["API_KEY"]);
        $responses_energy[]=$api->get_site_energy_details($Account_Solaredge["SITE_ID"], $start_date, $final_date, "QUARTER_OF_AN_HOUR","FeedIn");
        $responses_power[]=$api->get_site_power_details($Account_Solaredge["SITE_ID"], $start_date, $final_date, "QUARTER_OF_AN_HOUR","FeedIn");
    }
    
    $i=0;
    
    $misure=[];
    
    $somma_totale_periodo=0;
    
    while($i<$numero_rivelazioni){
        $somma_energia=0;
        $somma_potenza=0;
        $data_ora=new DateTime($start_date);
        if($i>0){
            $minute="PT".strval(15*$i)."M";
            $data_ora=$data_ora->add(new DateInterval($minute));
        }
        
        foreach($responses_energy as $response){
            $value_flt=floatval($response->energyDetails->meters[0]->values[$i]->value);
            $valore_add=$value_flt/1000;
            $somma_energia+=$valore_add;
        }

        foreach($responses_power as $response){
            $value_flt=floatval($response->powerDetails->meters[0]->values[$i]->value);
            $valore_add=$value_flt/1000;
            $somma_potenza+=$valore_add;
        }
        
        $somma_potenza=round($somma_potenza, 2);

        $somma_round=round($somma_energia, 2);
        
        $somma_totale_periodo+=$somma_round;
        
        $risultato=[
            'data_ora'=>$data_ora->format("Y-m-d H:i:s"),
            'somma_energia'=>$somma_round,
            'potenza'=>$somma_potenza,
        ];
        
        $misure[]=$risultato;
        
        $i+=1;
    }
    
    $response_final = [
        'misure' => $misure,
        'somma_totale_periodo' => round($somma_totale_periodo, 2) // arrotonda alla seconda cifra decimale
    ];
    
    header('Content-Type: application/json');
    echo "\n".json_encode($response_final);
    
}
?>