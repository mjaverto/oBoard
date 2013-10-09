<?php
	return array(
		//Currently only support 1 single Atlassian Bamboo server. Multiple support to follow
		"bamboo" => array(
			"bambooProtocol" => "http://", 				// http:// or https://
			"bambooHost" => "bamboo.example.com:8085", 	// bamboo.example.com:8085
			"bambooUsername" => "statusboard", 			// a bamboo user
			"bambooPassword" => "password",				// a bamboo password
			"project" => array(
	            "ChannelApe" => array(					//Use any name here you want
		            "bambooProjectKey" => "KEY",		//Must match Bamboo Project Key
		            "bambooShortKey" => "TEST",			//Must match exact Bamboo Short Key
		            "awsApplicationName" => "sample1" 	//refers to AWS application below
		        )
	        )
			
		),
		"aws" => array(
			"application" => array(												//Currently only supports AWS ElasticBeanstalk but support for 1 or many applications.
	            "sample1" => array(												//Use any name you want for the key here
					'key'    => 'AKIAxxxxxxxxxxxx',								//AWS Account or IAM user Key
				    'secret' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',		//AWS Account or IAM user Secret
				    'region' => 'us-east-1'
				),
				"sample2" => array(
					'key'    => 'AKIAxxxxxxxxxxxx',
				    'secret' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				    'region' => 'us-east-1'
				)
	        )
		),
		"awsServices" => array(
			//Go to http://status.aws.amazon.com/, click the RSS feed icon and take the last part of the URL withOUT .rss The key (name) doesn't matter as it will be replaced with Amazon's offical title on load.
			"EC2 US N. Virginia" 	=> "ec2-us-east-1",
			"Elastic Beanstalk"		=> "elasticbeanstalk-us-east-1",
			"ELB N. Virginia" 		=> "elb-us-east-1",
			"Route 53" 				=> "route53",
			"RDS N. Virginia"		=> "rds-us-east-1",
			"DynamoDB N. Virginia"	=> "dynamodb-us-east-1",
			"SES N. Virginia"		=> "ses-us-east-1",
			"S3"					=> "s3-us-standard"
			
		),
		"jenkins" => array(
			"servers"=> array(
				"wdl" => array(												//Use anything here for Server key name.
					"jenkinsProtocol" => "http://", 						// http:// or https://
					"jenkinsHost" => "jenkins.example.com:8080", 			// jenkins.example.com:8080
					"jenkinsUsername" => "jenkins", 						// a jenkins user
					"jenkinsPassword" => "password",						// a jenkins password
						"job" => array(
							'testjob1'=> array(
					            "jobKey" => "testjob1Name" // The name you'd see in the URL of Jenkins including %20 if you have spaces
					        ),
					        'testjob2'=> array(
					            "jobKey" => "testjob2",
					            "awsApplicationName" => "sample2"
					        )
				        ),
					)
			),	
		),
		"statusBoard" => array(
			"refreshRate" => 7500
		)
	);
?>