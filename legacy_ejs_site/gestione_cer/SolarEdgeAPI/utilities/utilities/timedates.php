<?php

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

    public function data_to_datetime(&$data){
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                foreach ($this->DICT_KEY_CONTAIN_CONVERT_DATETIME as $key_pattern) {
                    if (stripos($key, $key_pattern) !== false) {
                        $data[$key] = $this->string_to_datetime($value);
                        break;
                    }
                }
            }
        }
    }
}
?>