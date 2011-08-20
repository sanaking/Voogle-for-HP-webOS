<?PHP
/*
Version     0.2
License     This code is released under the MIT Open Source License. Feel free to do whatever you want with it.
Author      lostleon@gmail.com, http://www.lostleon.com/
LastUpdate  05/28/2010
*/
class GoogleVoice
{
    public $username;
    public $password;
    public $status;
    private $lastURL;
    private $login_auth;
    private $inboxURL = 'https://www.google.com/voice/m/';
    private $loginURL = 'https://www.google.com/accounts/ClientLogin';
    private $smsURL = 'https://www.google.com/voice/m/sendsms';
	private $voicemailURL = 'https://www.google.com/voice/b/0/media/send_voicemail/';

    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    public function getLoginAuth()
    {
        $login_param = "accountType=GOOGLE&Email={$this->username}&Passwd={$this->password}&service=grandcentral";
        $ch = curl_init($this->loginURL);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-us) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4");
        curl_setopt($ch, CURLOPT_REFERER, $this->lastURL);
        curl_setopt($ch, CURLOPT_POST, "application/x-www-form-urlencoded");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $login_param);
        $html = curl_exec($ch);
        $this->lastURL = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        curl_close($ch);
        $this->login_auth = $this->match('/Auth=([A-z0-9_-]+)/', $html, 1);
        return $this->login_auth;
    }

    public function get_rnr_se()
    {
        $this->getLoginAuth();
        $ch = curl_init($this->inboxURL);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-us) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4");
        $headers = array("Authorization: GoogleLogin auth=".$this->login_auth, 'User-Agent: Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5H11 Safari/525.20');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $html = curl_exec($ch);
        $this->lastURL = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        curl_close($ch);
        $_rnr_se = $this->match('!<input.*?name="_rnr_se".*?value="(.*?)"!ms', $html, 1);
        return $_rnr_se;
    }
	
	public function downloadMsg($msgId)
	{
		$shit = array();
		$_rnr_se = $this->get_rnr_se();
        $sms_param = urlencode($msgId);
        $ch = curl_init($this->voicemailURL.$sms_param);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $headers = array("Authorization: GoogleLogin auth=".$this->login_auth, 'User-Agent: Mozilla/5.0 (webOS/1.0; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.0');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_REFERER, $this->lastURL);   
        $this->status = curl_exec($ch);
        $this->lastURL = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
		array_push($shit, curl_getinfo($ch, CURLINFO_CONTENT_LENGTH_DOWNLOAD));
		array_push($shit, $this->status);
		 curl_close($ch);
        return $shit;
	}
	
	public function downloadMsgBETA($msgId)
	{
		$_rnr_se = $this->get_rnr_se();
        $sms_param = urlencode($msgId);
        $ch = curl_init("https://www.google.com/voice/media/send_voicemail?id=".$sms_param);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-us) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4");
        $headers = array("Authorization: GoogleLogin auth=".$this->login_auth, 'User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-us) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_REFERER, $this->lastURL);   
        $this->status = curl_exec($ch);
        $this->lastURL = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        curl_close($ch);
        return $this->status;
	}

    public function sms($to_phonenumber, $smstxt)
    {
        $_rnr_se = $this->get_rnr_se();
        $sms_param = "id=&c=&number=".urlencode($to_phonenumber)."&smstext=".urlencode($smstxt)."&_rnr_se=".urlencode($_rnr_se);
        $ch = curl_init($this->smsURL);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $headers = array("Authorization: GoogleLogin auth=".$this->login_auth, 'User-Agent: Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5H11 Safari/525.20');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_REFERER, $this->lastURL);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $sms_param);      
        $this->status = curl_exec($ch);
        $this->lastURL = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        curl_close($ch);
        return $this->status;
    }

    private function match($regex, $str, $out_ary = 0)
    {
        return preg_match($regex, $str, $match) == 1 ? $match[$out_ary] : false;
    }
}
?>
