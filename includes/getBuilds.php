<?php

include_once('../config.php');

$content = file_get_contents($bambooProtocol.$bambooHost.'/rest/api/1.0/plan/'.$bambooProjectKey.'/'.$bambooShortKey.'/'.'.json?os_authType=basic&os_username='.$bambooUsername.'&os_password='.$bambooPassword);
echo $content;

?>