<?php

class SingleCurl {
    private $handler;
    private $response;

    public function __construct(string $url){
        $this->handler  =   curl_init();
        curl_setopt($this->handler, CURLOPT_URL, $url);
        curl_setopt($this->handler, CURLOPT_USERAGENT, "NOBODY");
        curl_setopt($this->handler, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($this->handler, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($this->handler, CURLOPT_HEADER, 0);
        curl_setopt($this->handler, CURLOPT_NOBODY, 0);
        curl_setopt($this->handler, CURLOPT_TIMEOUT, 30);
        $this->response = curl_exec($this->handler);
        curl_close($this->handler);
    }

    public function getResponse(){
        return $this->response;
    }
}