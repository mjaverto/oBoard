<?php

/*************************************************************
 * Make call to:
 * http://jenkins.otreva.com:8085/rest/api/1.0/plan/CA/CAINT
 * and check if building, if not:
 * http://jenkins.otreva.com:8085/rest/api/1.0/result/CA-CAINT
 * and see if most recent build state is Successful or failed
 * 
 *************************************************************/


$action 		= $_GET["action"];
$jobName 		= $_GET["jobName"];
$serverName 	= $_GET["serverName"];

$jenkins = new jenkins();

switch ($action) {

	case "getJenkinsStatus":
			$jenkins->getJenkinsStatus($jobName, $serverName);
		break;
} 

 
class jenkins{
	public function __construct(){
		$this->config = include_once("../config.php");
	}
	
	public function getJenkinsStatus($jobName, $serverName){		
		
		$content = file_get_contents(
			$this->config["ciBuildServers"]["jenkins"]['servers'][$serverName]["jenkinsProtocol"].
			$this->config["ciBuildServers"]["jenkins"]['servers'][$serverName]["jenkinsHost"].
			'/job/'.
			$jobName.
			'/api/json'
		);
		
		print $content;
		
	}		
		
}

