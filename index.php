
<?php 
    $config = include_once("config.php"); 
    $refreshRate = $config["statusBoard"]['refreshRate'];
?>

<!DOCTYPE html>
<!--[if IE 8]> 				 <html class="no-js lt-ie9" lang="en" > <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en" > <!--<![endif]-->

<head>
	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Otreva's Bamboo Board</title>

  
    <link rel="stylesheet" href="css/foundation.css">
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/app.css">
	<link rel="icon" type="image/png" href="favicon.png">
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="js/vendor/custom.modernizr.js"></script>
    <script src="js/app.js"></script>
    
    
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700,800' rel='stylesheet' type='text/css'>
    <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
    
    <script type="text/javascript" charset="utf-8">      
		var refreshRate = '<?php echo $refreshRate; ?>';
    </script>
</head>
<body>
	<div id="bambooProjects">
		<div class="row">
		</div>
	</div>	
	<hr />
	<div id="awsStatus">
		<div class="row">

		</div>
	</div>	
	
</body>
</html>
