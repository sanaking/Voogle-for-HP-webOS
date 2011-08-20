<?php

class GoogleVoice
{
	// Our credentials
	private $_login;
	private $_pass;
	private $_rnr_se; // some crazy google thing that we need later

	// Our private curl handle
	private $_ch;

	// The location of our cookies
	private $_cookieFile;

	// Are we logged in already?
	private $_loggedIn = FALSE;

	public function __construct($login, $pass)
	{
		$this->_login = $login;
		$this->_pass = $pass;

		$this->_cookieFile = '/tmp/gvCookies-'.md5($login).'.txt';

		$this->_ch = curl_init();
		curl_setopt($this->_ch, CURLOPT_COOKIEJAR, $this->_cookieFile);
		curl_setopt($this->_ch, CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($this->_ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($this->_ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($this->_ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)");
	}
	
	public function auth() {
		$this->_logIn();
		echo("authSuccess");
	}
	
	private function _logIn()
	{
		global $conf;

		if( $this->_loggedIn )
			return TRUE;

		// fetch the login page
		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/accounts/ServiceLogin?passive=true&service=grandcentral');
		$html = curl_exec($this->_ch);

		if(preg_match('/name="GALX"\s*value="([^"]+)"/', $html, $match))
			$GALX = $match[1];
		else
			die('authFailed');

		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/accounts/ServiceLoginAuth?service=grandcentral');
		curl_setopt($this->_ch, CURLOPT_POST, TRUE);
		curl_setopt($this->_ch, CURLOPT_POSTFIELDS, array(
			'Email' => $this->_login,
			'Passwd' => $this->_pass,
			'continue' => 'https://www.google.com/voice/account/signin',
			'service' => 'grandcentral',
			'GALX' => $GALX
			));
	
		$html = curl_exec($this->_ch);
		if( preg_match('/name="_rnr_se".*?value="(.*?)"/', $html, $match) )
		{
			$this->_rnr_se = $match[1];
		}
		else
		{
			die('authFailed');
		}
	}

	/**
	 * Place a call to $number connecting first to $fromNumber
	 * @param $number The 10-digit phone number to call (formatted with parens and hyphens or none)
	 * @param $fromNumber The 10-digit number on your account to connect the call (no hyphens or spaces)
	 * @param $phoneType (mobile, work, home, gizmo) The type of phone the $fromNumber is. The call will not be connected without this value. 
	 */
	public function callNumber($number, $fromNumber, $phoneType='mobile')
	{
		$types = array(
			'mobile' => 2,
			'work' => 3,
			'home' => 1,
			'gizmo' => 7
		);
	
		if(!array_key_exists($phoneType, $types))
			throw new Exception('Phone type must be mobile, work, home or gizmo');
		
		$this->_logIn();
		
		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/voice/call/connect/');
		curl_setopt($this->_ch, CURLOPT_POST, TRUE);
		curl_setopt($this->_ch, CURLOPT_POSTFIELDS, array(
			'_rnr_se'=>$this->_rnr_se,
			'forwardingNumber'=>'+1' . $fromNumber,
			'outgoingNumber'=>$number,
			'phoneType'=>$types[$phoneType],
			'remember'=>0,
			'subscriberNumber'=>'undefined'
			));
		curl_exec($this->_ch);
	}

	public function sendSMS($number, $message)
	{
		$this->_logIn();

		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/voice/sms/send/');
		curl_setopt($this->_ch, CURLOPT_POST, TRUE);
		curl_setopt($this->_ch, CURLOPT_POSTFIELDS, array(
			'_rnr_se'=>$this->_rnr_se,
			'phoneNumber'=>'+1' . $number,
			'text'=>$message
			));
		curl_exec($this->_ch);
	}
	
	public function getNewSMS() {
		return $this->getSMS("unread", TRUE);
	}
	
	public function getSMS($in_label="unread", $ignore_me=TRUE)
	{
		$this->_logIn();
		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/voice/inbox/recent/sms/');
		curl_setopt($this->_ch, CURLOPT_POST, FALSE);
		curl_setopt($this->_ch, CURLOPT_RETURNTRANSFER, TRUE);
		$xml = curl_exec($this->_ch);

		$dom = new DOMDocument();

		// load the "wrapper" xml (contains two elements, json and html)
		$dom->loadXML($xml);
		$json = $dom->documentElement->getElementsByTagName("json")->item(0)->nodeValue;
		$json = json_decode($json);

		// now make a dom parser which can parse the contents of the HTML tag
		$html = $dom->documentElement->getElementsByTagName("html")->item(0)->nodeValue;
		// replace all "&" with "&amp;" so it can be parsed
		$html = str_replace("&", "&amp;", $html);
		$dom->loadHTML($html);
		$xpath = new DOMXPath($dom);
		
		$results = array();
		
		foreach( $json->messages as $mid=>$convo )
		{
			$elements = $xpath->query("//div[@id='$mid']//div[@class='gc-message-sms-row']");

			if(!is_null($elements))
			{
				if( in_array($in_label, $convo->labels) )
				{
					foreach($elements as $i=>$element)
					{
						$XMsgFrom = $xpath->query("span[@class='gc-message-sms-from']", $element);
						$msgFrom = '';
						foreach($XMsgFrom as $m)
							$msgFrom = trim($m->nodeValue);

						if( !$ignore_me || ($ignore_me && $msgFrom != "Me:") )
						{
							$XMsgText = $xpath->query("span[@class='gc-message-sms-text']", $element);
							$msgText = '';
							foreach($XMsgText as $m)
								$msgText = trim($m->nodeValue);
	
							$XMsgTime = $xpath->query("span[@class='gc-message-sms-time']", $element);
							$msgTime = '';
							foreach($XMsgTime as $m)
								$msgTime = trim($m->nodeValue);
	
							$results[] = array(
												'msgID'=>$mid,
												'phoneNumber'=>$convo->phoneNumber,
												'message'=>$msgText,
												'type' => $msgFrom != "Me:" ? 'received' : 'sent',
												'date'=>date('Y-m-d H:i:s', strtotime(date('m/d/Y ',intval($convo->startTime/1000)).$msgTime)));
						}
					}
				}
				else
				{
					//echo "This message is not unread\n";	
				}
			}
			else
			{
				//echo "gc-message-sms-row query failed\n";
			}
		}
		
		return $results;
	}
	
	public function deleteMsg($msgID)
	{
		$this->_logIn();

		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/voice/inbox/deleteMessages/');
		curl_setopt($this->_ch, CURLOPT_POST, TRUE);
		curl_setopt($this->_ch, CURLOPT_POSTFIELDS, array(
			'_rnr_se'=>$this->_rnr_se,
			'messages'=>$msgID,
			'trash'=>1
			));
		curl_exec($this->_ch);
	}
	
	public function markMsg($msgID)
	{
		$this->_logIn();

		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/voice/inbox/mark/');
		curl_setopt($this->_ch, CURLOPT_POST, TRUE);
		curl_setopt($this->_ch, CURLOPT_POSTFIELDS, array(
			'_rnr_se'=>$this->_rnr_se,
			'messages'=>$msgID,
			'read'=>1
			));
		curl_exec($this->_ch);
	}
	
	public function object_to_array($data) 
{
  if(is_array($data) || is_object($data))
  {
    $result = array(); 
    foreach($data as $key => $value)
    { 
      $result[$key] = $this->object_to_array($value); 
    }
    return $result;
  }
  return $data;
}
	
	public function getPhones()
	{
		$this->_logIn();
		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/voice/#contacts');
		curl_setopt($this->_ch, CURLOPT_POST, FALSE);
		curl_setopt($this->_ch, CURLOPT_RETURNTRANSFER, TRUE);
		$xml = curl_exec($this->_ch);

		$json = substr($xml, strpos($xml, "var _gcData = ")+14);
		$json = substr($json, 0, strpos($json, "};"))."}";
		$json = str_replace("'", '"', $json);
		$json = json_decode($json);
		$json = $this->object_to_array($json);
		$phones = $json["phones"];
		$phoneList = "";
		foreach($phones as $phone) {
			if($phone["telephonyVerified"] == 1) {
				$phoneList .= str_replace("+", "", $phone["phoneNumber"])."|";
			}
		}
		return $phoneList;
	}
	
	public function getGVNum() {
		$this->_logIn();
		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/voice/#contacts');
		curl_setopt($this->_ch, CURLOPT_POST, FALSE);
		curl_setopt($this->_ch, CURLOPT_RETURNTRANSFER, TRUE);
		$xml = curl_exec($this->_ch);

		$json = substr($xml, strpos($xml, "var _gcData = ")+14);
		$json = substr($json, 0, strpos($json, "};"))."}";
		$json = str_replace("'", '"', $json);
		$json = json_decode($json);
		$json = $this->object_to_array($json);
		$phones = $json["number"];
		return $phones["raw"];
	}
	
	public function getFolder($n) {
		$this->_logIn();
		$n = strtolower($n);
		if($n == "voicemails") $n = "voicemail";
		if($n == "texts" || $n == "txts") $n = "sms";
		if($n == "unread") $n = "all";
		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/voice/inbox/recent/'.$n.'/');
		curl_setopt($this->_ch, CURLOPT_POST, FALSE);
		curl_setopt($this->_ch, CURLOPT_RETURNTRANSFER, TRUE);
		$xml = curl_exec($this->_ch);
		return $xml;
	}

	public function getNewVoicemail()
	{
		$this->_logIn();
		curl_setopt($this->_ch, CURLOPT_URL, 'https://www.google.com/voice/inbox/recent/voicemail/');
		curl_setopt($this->_ch, CURLOPT_POST, FALSE);
		curl_setopt($this->_ch, CURLOPT_RETURNTRANSFER, TRUE);
		$xml = curl_exec($this->_ch);

		$dom = new DOMDocument();

		// load the "wrapper" xml (contains two elements, json and html)
		$dom->loadXML($xml);
		$json = $dom->documentElement->getElementsByTagName("json")->item(0)->nodeValue;
		$json = json_decode($json);

		// now make a dom parser which can parse the contents of the HTML tag
		$html = $dom->documentElement->getElementsByTagName("html")->item(0)->nodeValue;
		// replace all "&" with "&amp;" so it can be parsed
		$html = str_replace("&", "&amp;", $html);
		$dom->loadHTML($html);
		$xpath = new DOMXPath($dom);
		
		$results = array();
		
		foreach( $json->messages as $mid=>$convo )
		{
			$elements = $xpath->query("//div[@id='$mid']");
			if(!is_null($elements))
			{
				if( $convo->isRead == false )
				{
					$element = $elements->item(0);
					$XMsg = $xpath->query("//div[@class='gc-message-message-display']", $element);
					$XMsgPart = $xpath->query("span|a", $XMsg->item(0));
					
					$msgText = '';
					$msgWords = array();
					foreach($XMsgPart as $m)
					{
						$word = $this->_unhtmlentities(trim($m->nodeValue));
						$msgText .= $word . ' ';
						if(preg_match('/gc-word-(.+)/', $m->attributes->getNamedItem('class')->textContent, $match))
							$confidence = $match[1];
						else
							$confidence = '';
						$msgWords[] = array('word'=>$word, 'confidence'=>$confidence);
					}
						
					$results[] = array('msgID'=>$mid, 'phoneNumber'=>$convo->phoneNumber, 'message'=>$msgText, 'date'=>date('Y-m-d H:i:s', intval($convo->startTime/1000)), 'words'=>$msgWords);
				}
				else
				{
					echo "This message ($mid) is not unread\n";
				}
			}
			else
			{
				echo "Could not find HTML version of message: $mid\n";
			}
		}
		
		return $results;
	}
	
	public function dom_dump($obj) {
		if ($classname = get_class($obj)) {
			$retval = "Instance of $classname, node list: \n";
			switch (true) {
				case ($obj instanceof DOMDocument):
					$retval .= "XPath: {$obj->getNodePath()}\n".$obj->saveXML($obj);
					break;
				case ($obj instanceof DOMElement):
					$retval .= "XPath: {$obj->getNodePath()}\n".$obj->ownerDocument->saveXML($obj);
					break;
				case ($obj instanceof DOMAttr):
					$retval .= "XPath: {$obj->getNodePath()}\n".$obj->ownerDocument->saveXML($obj);
					break;
				case ($obj instanceof DOMNodeList):
					for ($i = 0; $i < $obj->length; $i++) {
						$retval .= "Item #$i, XPath: {$obj->item($i)->getNodePath()}\n"."{$obj->item($i)->ownerDocument->saveXML($obj->item($i))}\n";
					}
					break;
				default:
					return "Instance of unknown class";
			}
		} else {
			return 'no elements...';
		}
		return htmlspecialchars($retval);
	}
	
	private function _unhtmlentities($string)
	{
		// replace numeric entities
		$string = preg_replace('~&#x([0-9a-f]+);~ei', 'chr(hexdec("\\1"))', $string);
		$string = preg_replace('~&#([0-9]+);~e', 'chr("\\1")', $string);
		// replace literal entities
		$string = html_entity_decode($string);
		return $string;
	}
}



//Start Voogle Shit

$gv = new GoogleVoice($_REQUEST["email"], $_REQUEST["password"]);
$cmd = $_REQUEST["cmd"];
if($cmd == "login") {
	$gv->auth();
}
else if($cmd == "getPhones") {
	echo($gv->getPhones());
}
else if($cmd == "getGoogleNumber") {
	echo(str_replace("+", "", $gv->getGVNum()));
}
else if(substr($cmd, 0, 3) == "get") {
	echo($gv->getFolder(substr($cmd, 3)));
}
if($cmd == "sendSMS") {
	$gv->sendSMS($_REQUEST["sendTo"], $_REQUEST["msg"]);
}
if($cmd == "placeCall") {
	$gv->callNumber($_REQUEST["callTo"], $_REQUEST["callFrom"]);
	echo("true");
}
if($cmd == "markRead") {
	$gv->markMsg($_REQUEST["id"]);
}
if($cmd == "deleteMsg") {
	$gv->deleteMsg($_REQUEST["id"]);
}
//

?>