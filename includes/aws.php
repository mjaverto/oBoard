<?php

require 'aws/aws-autoloader.php';

use Aws\ElasticBeanstalk\ElasticBeanstalkClient;



$action 			= $_GET["action"];
$applicationName 	= $_GET["applicationName"];

// Instantiate the class
$bean = new AmazonElasticBeanstalk();


switch ($action) {
    case "describeEnvironments":
        $bean->describeEnvironments($applicationName);
        break;
} 




class AmazonElasticBeanstalk{
	public function __construct(){
		$this->config = include_once("../config.php");
		
	}	
	public function describeEnvironments($applicationName){
		$key = $this->config["aws"]['application'][$applicationName]["key"];
		$secret = $this->config["aws"]['application'][$applicationName]["secret"];
		$region = $this->config["aws"]['application'][$applicationName]["region"];
		
		$this->beanstalk = ElasticBeanstalkClient::factory(array(
		    'key'    => $key,
		    'secret' => $secret,
		    'region' => $region
		));
		$app = $this->beanstalk->describeEnvironments(array(
			"ApplicationName " => $applicationName
			
		));
		 
		// Success?
		print json_encode($app->toArray());
	}
}