<?php


$action 			= $_GET["action"];

$builds = new builds();


switch ($action) {
    case "getBuilds":
        $builds->getBuilds();
        break;
} 

 
class builds{
	public function __construct(){
		$this->config = include_once("../config.php");
	}
	
	
	public function getBuilds(){
		$arr = $this->config["ciBuildServers"];
		print json_encode($arr);
	}	

}

