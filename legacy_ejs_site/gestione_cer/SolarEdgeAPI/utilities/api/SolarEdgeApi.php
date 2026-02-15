<?php
include "../init.php";
include "../exceptions/SolarEdgeInterfaceException.php";
include "../utilities/http_request.php";
include "../utilities/json.php";
include "../utilities/timedates.php";

class SolarEdgeAPI{
    public $api_key="";
    public $du;
    public $in;


    public function __construct ($api_key){
        if($api_key=="") throw new SolarEdgeInterfaceException("Must provide a SolarEdge api_key value.");
        $this->api_key=$api_key;
        $this->du=new Date_utilities();
        $this->in=new Init();
        
        echo "stampo apikey: ".$api_key;
    }

    public function response_wrapper($response, $site_id){
        $response->data=json_decode($response["data"]);
        if($response->data!=""){
            $this->du->data_to_datetime($response->data);
        }
        return $response;
    }

    public function get_site_power_details($site_id, $start_time, $end_time, $meters=""){
        $partList=[];
        $partList[]= $this->in->solaredge_api_baseurl;
        $partList[]="site";
        $partList[]=$site_id;
        $partList[]="powerDetails";
        
        $url = implode('/', $partList);

        $no=new stdClass;
        $no->api_key=$this->api_key;
        $no->startTime=$start_time;
        $no->endTime=$end_time;

        $params=json_encode($no);

        if($meters!="") $params['meters']=$meters;
        return $this->response_wrapper(http_request($url, $params,  $this->in->http_request_timeout), $site_id);
    }
}
?>