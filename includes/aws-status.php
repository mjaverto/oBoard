<?php

/*************************************************************
 * Make calls to AWS RSS Feeds
 * 
 *************************************************************/


$serviceKey = $_GET["serviceKey"];
$action 	= $_GET["action"];


$awsStatus = new awsStatus();

switch ($action) {
    case "getServices":
        $awsStatus->getServices();
        break;
	case "getServiceFeed":
		$awsStatus->getServiceFeed($serviceKey);
		break;
} 
 
class awsStatus{
	
	public function __construct(){
		$this->config = include_once("../config.php");
	}
	
	public function getServices(){
		$arr = $this->config["awsServices"];
		print json_encode($arr);
	}	
	
	public function getServiceFeed($serviceKey){	
		header('Content-Type: application/json');
		$feed = new DOMDocument();
		$content = file_get_contents(
			"http://status.aws.amazon.com/rss/".
			$serviceKey.
			".rss"		
		);
		$feed->load("http://status.aws.amazon.com/rss/".$serviceKey.".rss");
		$json = array();
		
		$json['title'] = $feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('title')->item(0)->firstChild->nodeValue;
		$json['description'] = $feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('description')->item(0)->firstChild->nodeValue;
		$json['link'] = $feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('link')->item(0)->firstChild->nodeValue;
		
		$items = $feed->getElementsByTagName('channel')->item(0)->getElementsByTagName('item');
		
		$json['item'] = array();
		$i = 0;
		
		
		foreach($items as $item) {
		
		   $title = $item->getElementsByTagName('title')->item(0)->firstChild->nodeValue;
		   $description = $item->getElementsByTagName('description')->item(0)->firstChild->nodeValue;
		   $pubDate = $item->getElementsByTagName('pubDate')->item(0)->firstChild->nodeValue;
		   $guid = $item->getElementsByTagName('guid')->item(0)->firstChild->nodeValue;
		   
		   $json['item'][$i++]['title'] = $title;
		   $json['item'][$i++]['description'] = $description;
		   $json['item'][$i++]['pubdate'] = $pubDate;
		   $json['item'][$i++]['guid'] = $guid;   
		   if (++$i == 2) break;  
		}
		
		
		echo json_encode($json);
	}
}

