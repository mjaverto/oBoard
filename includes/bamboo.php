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



$bamboo = new bamboo();


switch ($action) {
    case "getBambooBuilds":
        $bamboo->getBambooBuilds($projectName,$bambooProjectKey,$bambooShortKey);
        break;
	case "getBambooBuildResults":
		$bamboo->getBambooBuildResults($projectName,$bambooProjectKey,$bambooShortKey);
		break;
	case "getBambooProjects":
		$bamboo->getBambooProjects();
		break;
} 

 
class bamboo{
	public function __construct(){
		$this->config = include_once("../config.php");
	}
	
	
	public function getBambooProjects(){
		$arr = $this->config["bamboo"]["project"];
		print json_encode($arr);
	}	
	
	
	public function getBambooBuilds($projectName, $bambooProjectKey, $bambooShortKey){	
		$content = file_get_contents(
			$this->config["bamboo"]["bambooProtocol"].
			$this->config["bamboo"]["bambooHost"].
			'/rest/api/1.0/plan/'.
			$bambooProjectKey.
			'/'.
			$bambooShortKey.
			'/'.
			'.json?os_authType=basic&os_username='.
			$this->config["bamboo"]["bambooUsername"].			
			'&os_password='.
			$this->config["bamboo"]["bambooPassword"]		
		);
		
		print $content;
		
	}
	
	public function getBambooBuildResults($projectName, $bambooProjectKey, $bambooShortKey){	
		$content = file_get_contents(
			$this->config["bamboo"]["bambooProtocol"].
			$this->config["bamboo"]["bambooHost"].
			'/rest/api/1.0/result/'.
			$bambooProjectKey.
			'-'.
			$bambooShortKey.
			'/'.
			'.json?os_authType=basic&os_username='.
			$this->config["bamboo"]["bambooUsername"].			
			'&os_password='.
			$this->config["bamboo"]["bambooPassword"]		
		);
		
		print $content;
		
	}
}

