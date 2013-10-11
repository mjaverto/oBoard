<?php

/*************************************************************
 * Make call to:
 * http://bamboo.otreva.com:8085/rest/api/1.0/plan/CA/CAINT
 * and check if building, if not:
 * http://bamboo.otreva.com:8085/rest/api/1.0/result/CA-CAINT
 * and see if most recent build state is Successful or failed
 * 
 *************************************************************/


$action 			= $_GET["action"];
$projectName 		= $_GET["projectName"];
$bambooProjectKey 	= $_GET["bambooProjectKey"];
$bambooShortKey 	= $_GET["bambooShortKey"];
$bambooServer 		= $_GET["bambooServer"];



$bamboo = new bamboo();


switch ($action) {
	case "getBambooBuilds":
        $bamboo->getBambooBuilds($projectName,$bambooProjectKey,$bambooShortKey, $bambooServer);
        break;
	case "getBambooBuildResults":
		$bamboo->getBambooBuildResults($projectName,$bambooProjectKey,$bambooShortKey, $bambooServer);
		break;

} 

 
class bamboo{
	public function __construct(){
		$this->config = include_once("../config.php");
	}
	
	public function getBambooBuilds($projectName, $bambooProjectKey, $bambooShortKey, $bambooServer){	
		$content = file_get_contents(
		$this->config["ciBuildServers"]["bamboo"]["servers"][$bambooServer]["bambooProtocol"].
		$this->config["ciBuildServers"]["bamboo"]["servers"][$bambooServer]["bambooHost"].
		'/rest/api/1.0/plan/'.
		$bambooProjectKey.
		'/'.
		$bambooShortKey.
		'/'.
		'.json?os_authType=basic&os_username='.
		$this->config["ciBuildServers"]["bamboo"]["servers"][$bambooServer]["bambooUsername"].	
		'&os_password='.
		$this->config["ciBuildServers"]["bamboo"]["servers"][$bambooServer]["bambooPassword"]	
		);
		
		print $content;
		
	}
	
	public function getBambooBuildResults($projectName, $bambooProjectKey, $bambooShortKey, $bambooServer){	
		$content = file_get_contents(
			$this->config["ciBuildServers"]["bamboo"]["servers"][$bambooServer]["bambooProtocol"].
			$this->config["ciBuildServers"]["bamboo"]["servers"][$bambooServer]["bambooHost"].
			'/rest/api/1.0/result/'.
			$bambooProjectKey.
			'-'.
			$bambooShortKey.
			'/'.
			'.json?os_authType=basic&os_username='.
			$this->config["ciBuildServers"]["bamboo"]["servers"][$bambooServer]["bambooUsername"].			
			'&os_password='.
			$this->config["ciBuildServers"]["bamboo"]["servers"][$bambooServer]["bambooPassword"]		
		);
		
		print $content;
		
	}
}

