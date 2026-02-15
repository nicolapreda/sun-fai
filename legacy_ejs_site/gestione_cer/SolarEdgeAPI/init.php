<?php
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
?>