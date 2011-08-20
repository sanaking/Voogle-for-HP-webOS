<?php

	include('class.googlevoice.php');
	$gv = new GoogleVoice($_REQUEST['email'], $_REQUEST['password']);
	$vm = $gv->getLoginAuth();
	$file = $gv->downloadMsg($_REQUEST['msgid']);
	$len = $file[0];;
header('Content-type: audio/mpeg');
header('Content-Disposition: attachment; filename='.$_REQUEST['msgid'].".mp3");
header('Content-Length: '.$len);

	
	print($file[1]);

?>