oBoard
======

Jenkins, Bamboo, AWS Continuous Integration Monitoring Board


Features:

Single Bamboo Server
  - Multiple Bamboo Servers
  - Multiple Jenkins Servers
  - Multiple AWS ElasticBeanstalk Applications
  - Multiple AWS Service Monitoring


Future Development:

  - Javascript cleanup & optimization
  - (Requests from you)
  
  
To use:

1. Download Repo and place on PHP 5.3 compatible web server.

2. Clone or rename config.sample.php to config.php.

3. Open config.php and configure with your Jenkins, Bamboo, AWS ElasticBeanstalk or AWS Services

4. Open a browser and browse to the location where you placed download from Step 1.

5. That's it. The page should automatically update every few seconds depending on the setting in config.php by default without refresh to show you the current status of your builds, AWS Beanstalk Applications or AWS Services.