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
    case "getjenkinsBuilds":
        $jenkins->getjenkinsBuilds($jobName);
        break;
	case "getjenkinsBuildResults":
		$jenkins->getjenkinsBuildResults($projectName,$jenkinsProjectKey,$jenkinsShortKey);
		break;
	case "getjenkinsProjects":
		$jenkins->getjenkinsProjects();
		break;
	case "getCurrentJenkinsStatus":
			$jenkins->getCurrentJenkinsStatus($jobName, $serverName);
		break;
} 

 
class jenkins{
	public function __construct(){
		$this->config = include_once("../config.php");
	}
	
	
	public function getjenkinsProjects(){
		$arr = $this->config["jenkins"]["servers"];
		print json_encode($arr);
	}	
	
	
	public function getCurrentJenkinsStatus($jobName, $serverName){		
		
		$content = file_get_contents(
			$this->config["jenkins"]['servers'][$serverName]["jenkinsProtocol"].
			$this->config["jenkins"]['servers'][$serverName]["jenkinsHost"].
			'/job/'.
			$jobName.
			'/api/json'
		);
		
		print $content;
		
	}
	
	public function getjenkinsBuildResults($projectName, $jenkinsProjectKey, $jenkinsShortKey){	
		$content = file_get_contents(
			$this->config["jenkins"]["jenkinsProtocol"].
			$this->config["jenkins"]["jenkinsHost"].
			'/rest/api/1.0/result/'.
			$jenkinsProjectKey.
			'-'.
			$jenkinsShortKey.
			'/'.
			'.json?os_authType=basic&os_username='.
			$this->config["jenkins"]["jenkinsUsername"].			
			'&os_password='.
			$this->config["jenkins"]["jenkinsPassword"]		
		);
		
		print $content;
		
	}
	
		
		
}

