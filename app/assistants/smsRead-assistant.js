function SmsReadAssistant(smsId, sn){
	msgId = smsId;

		sendNumber = sn;
	
	}
var email;
var msgId;
var password;
var msgList;
var lastTime;
var intID;
var sendNumber;
SmsReadAssistant.prototype.setup = function() {
	//Mojo.Controller.errorDialog(msgId);
	jQuery.noConflict();
	Voogle.markRead(kt.cookies.get("voogle_userString"), msgId, function() {});
	//Setup widgets
	//email = kt.cookies.get("voogle_userString").split('||')[0];
	//password = kt.cookies.get("voogle_userString").split('||')[1];
	msgList = Array();
this.controller.setupWidget("msgScroller",
        this.attributes = {
            mode: 'vertical'
        },
        this.model = {
        }
    ); 
	
	this.controller.setupWidget("smsMsg",
	this.attributes = {
		focus: true,
		enterSubmits: true,
		multiline:true,
		hintText: "Enter message here..."
	},
	this.emailmodel = {
		value: "",
		disabled: false
	});
	
	this.controller.setupWidget("loader",
        this.attributes = {
            spinnerSize: "large"
        },
        this.model = {
            spinning: true 
        }
    );
	
	this.controller.setupWidget("smsMsgSending",
        this.attributes = {
            spinnerSize: "small"
        },
        this.model = {
            spinning: true 
        }
    );

	
	this.keyHandler = this.keyDown.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.document, 'keydown',this.keyHandler, true);
	intID = setInterval('update();', 30000);
													
		/*this.controller.setupWidget("msgs",
        this.attributes = {
            itemTemplate: "smsRead/msgs-list",

            swipeToDelete: false,
            reorderable: false
         },
         this.inboxmodel = {
             listTitle: "Messages",
             items : msgList
          }
    );		*/						
								
	Voogle.getConvo(kt.cookies.get("voogle_userString"), function(data) {
		
		document.getElementById('loader').style.display = "none";
		document.getElementById('msgs').innerHTML = "";
		var json = data.substr(data.indexOf("<json><![CDATA") + 14);
		json = json.substr(0, json.indexOf("]></json>"));
		json = jQuery.parseJSON(json);
		var xmlData = data.substr(data.indexOf('<html><![CDATA[') + 15);
		xmlData = xmlData.substr(0, xmlData.indexOf(']]></html>'));
		//var oldList = inboxList;
		var messages = json[0]["messages"];
		var convos = xmlData.split('<span class="gc-message-name">');
		var x = 1;
		jQuery.each(messages, function(i, msg){
			var id = msg.id;
			var convo = convos[x];
			//Mojo.Controller.errorDialog(convo);
			var label = msg.labels[1];
			//Mojo.Controller.errorDialog(label);
			if (label == "unread" || label == "inbox" || label == "starred") {
				label = msg.labels[2];
			}
			if (label == "unread") {
				label = msg.labels[3];
			}
			if ((label == "sms" || label == "all") && msg.id == msgId) {
				var rows = convo.split('<div class="gc-message-sms-row">');
				var xi = 1;
				var lastTime;
				jQuery.each(rows, function(i, mess){
					if (xi > 0) {
						var lastIndex = rows[xi].lastIndexOf('<span class="gc-message-sms-text">');
						var recentMsg = rows[xi].substr(lastIndex + 34);
						recentMsg = recentMsg.substr(0, recentMsg.indexOf('</span>'));
						var fromIndex = rows[xi].lastIndexOf('<span class="gc-message-sms-from">');
						var from = rows[xi].substr(fromIndex + 34);
						from = from.substr(0, from.indexOf('</span>'));
						var timeIndex = rows[xi].lastIndexOf('<span class="gc-message-sms-time">');
						var time = rows[xi].substr(timeIndex + 34);
						time = time.substr(0, time.indexOf('</span>'));
						
						var dateaIndex = convos[x].lastIndexOf('<span class="gc-message-time">');
						var datea = convos[x].substr(dateaIndex + 30);
						datea = datea.substr(0, datea.indexOf('</span>'));
						//Mojo.Controller.errorDialog(datea);
						var date = new Date();
						var strDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2);
						if (datea.indexOf(strDate) == -1) {
							if (time != lastTime) {
								//Add time divider...
								document.getElementById('msgs').innerHTML += '<table class="palm-divider labeled"><tbody><tr><td class="right"></td><td class="left"></td><td class="label">' + datea.split(' ')[0] + ' ' + time + '</td><td class="right"></td><td class="left"></td></tr></tbody></table>';
								lastTime = time;
							}
						}
						else {
							if (time != lastTime) {
								//Add time divider...
								document.getElementById('msgs').innerHTML += '<table class="palm-divider labeled"><tbody><tr><td class="right"></td><td class="left"></td><td class="label">' + time + '</td><td class="right"></td><td class="left"></td></tr></tbody></table>';
								lastTime = time;
							}
						}
						if (from != "") {
						
							var side = "right";
							
							if (from.indexOf('Me:') != -1) {
								side = "from";
							}
							if (from.indexOf('Me:') == -1) {
								document.getElementById('convoname').innerHTML = from.substr(0, from.lastIndexOf(':'));
								if (sendNumber == null) {
									sendNumber = msg.phoneNumber;
								}
							}
							//Mojo.Controller.errorDialog(from);
							document.getElementById('msgs').innerHTML += '<div class="' + side + 'Message" id="msg_' + msg.id + '"><div style="font-size:17px; margin-left:5px;">' + recentMsg + '</div></div>';
							msgScroller.mojo.revealBottom();
						/*msgList.push({
						 "body": recentMsg,
						 "id": msg.id,
						 "side": side
						 });*/
						}
					}
					if (document.getElementById('convoname').innerHTML == "") {
						var fromIndex = xmlData.indexOf('<a class="gc-under gc-message-name-link" title="Go to contact" href="javascript://">');
						var from = xmlData.substr(fromIndex + 84);
						from = from.substr(0, from.indexOf('</a>'));
						document.getElementById('convoname').innerHTML = from;
					}
					xi++;
				}
.bind(this));
			}
			
			
			x++;
			
		});
		
	}.bind(this));
	

};

SmsReadAssistant.prototype.keyDown = function(event) {
	if(Mojo.Char.isEnterKey(event.keyCode))
	{
		this.send().bind(this);
	}
}

function urlencode (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Lars Fischer
    // +      input by: Ratheous
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Joris
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // %          note 1: This reflects PHP 5.3/6.0+ behavior
    // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
    // %        note 2: pages served as UTF-8
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'

    str = (str+'').toString();
    
    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
                                                                    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function callUser() {
	Mojo.Controller.stageController.pushScene("dialer", sendNumber);
}

SmsReadAssistant.prototype.send = function()
{
	
	var value = smsMsg.mojo.getValue();
	if(value != "")
	{
		var date = new Date();
		var hour = date.getHours();
		var amPM = "AM";
		if(hour == 0)
		{
			hour = 12;
		}
		if(hour > 12)
		{
			amPM = "PM";
			hour = hour % 12;
		}
		if(date.getMinutes().toString().length == 1)
		{
			var minutes = "0"+date.getMinutes();
		}
		else
		{
			var minutes = date.getMinutes();
		}
		var time = hour+":"+minutes+" "+amPM.toUpperCase();
		//Mojo.Controller.errorDialog(value);
		
		
		
		smsMsg.mojo.setValue("");
		document.getElementById('smsMsgSending').style.visibility = "visible";
		Voogle.sendTxt(kt.cookies.get("voogle_userString"), {"number": sendNumber, "message": value}, function(data) {document.getElementById('smsMsgSending').style.visibility = "hidden";
				if(time != lastTime)
				{
					//Add time divider...
					document.getElementById('msgs').innerHTML += '<table class="palm-divider labeled"><tbody><tr><td class="right"></td><td class="left"></td><td class="label">'+time+'</td><td class="right"></td><td class="left"></td></tr></tbody></table>';
					lastTime = time;
				}
				var side = "from";
				document.getElementById('msgs').innerHTML += '<div class="'+side+'Message" id="msg_1"><div style="font-size:17px; margin-left:5px;">'+value+'</div></div>';
				msgScroller.mojo.revealBottom();
			});
	}
}

function update() {
	Voogle.getConvo(kt.cookies.get("voogle_userString"), function(data){
		document.getElementById('loader').style.display = "none";
		document.getElementById('msgs').innerHTML = "";
		var json = data.substr(data.indexOf("<json><![CDATA") + 14);
		json = json.substr(0, json.indexOf("]></json>"));
		json = jQuery.parseJSON(json);
		var xmlData = data.substr(data.indexOf('<html><![CDATA[') + 15);
		xmlData = xmlData.substr(0, xmlData.indexOf(']]></html>'));
		//var oldList = inboxList;
		var messages = json[0]["messages"];
		var convos = xmlData.split('<span class="gc-message-name">');
		var x = 1;
		jQuery.each(messages, function(i, msg){
			var id = msg.id;
			var convo = convos[x];
			//Mojo.Controller.errorDialog(convo);
			var label = msg.labels[1];
			//Mojo.Controller.errorDialog(label);
			if (label == "unread" || label == "inbox" || label == "starred") {
				label = msg.labels[2];
			}
			if (label == "unread") {
				label = msg.labels[3];
			}
			if ((label == "sms" || label == "all") && msg.id == msgId) {
				var rows = convo.split('<div class="gc-message-sms-row">');
				var xi = 1;
				var lastTime;
				jQuery.each(rows, function(i, mess){
					if (xi > 0) {
						var lastIndex = rows[xi].lastIndexOf('<span class="gc-message-sms-text">');
						var recentMsg = rows[xi].substr(lastIndex + 34);
						recentMsg = recentMsg.substr(0, recentMsg.indexOf('</span>'));
						var fromIndex = rows[xi].lastIndexOf('<span class="gc-message-sms-from">');
						var from = rows[xi].substr(fromIndex + 34);
						from = from.substr(0, from.indexOf('</span>'));
						var timeIndex = rows[xi].lastIndexOf('<span class="gc-message-sms-time">');
						var time = rows[xi].substr(timeIndex + 34);
						time = time.substr(0, time.indexOf('</span>'));
						
						var dateaIndex = convos[x].lastIndexOf('<span class="gc-message-time">');
						var datea = convos[x].substr(dateaIndex + 30);
						datea = datea.substr(0, datea.indexOf('</span>'));
						//Mojo.Controller.errorDialog(datea);
						var date = new Date();
						var strDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2);
						if (datea.indexOf(strDate) == -1) {
							if (time != lastTime) {
								//Add time divider...
								document.getElementById('msgs').innerHTML += '<table class="palm-divider labeled"><tbody><tr><td class="right"></td><td class="left"></td><td class="label">' + datea.split(' ')[0] + ' ' + time + '</td><td class="right"></td><td class="left"></td></tr></tbody></table>';
								lastTime = time;
							}
						}
						else {
							if (time != lastTime) {
								//Add time divider...
								document.getElementById('msgs').innerHTML += '<table class="palm-divider labeled"><tbody><tr><td class="right"></td><td class="left"></td><td class="label">' + time + '</td><td class="right"></td><td class="left"></td></tr></tbody></table>';
								lastTime = time;
							}
						}
						if (from != "") {
						
							var side = "right";
							
							if (from.indexOf('Me:') != -1) {
								side = "from";
							}
							if (from.indexOf('Me:') == -1) {
								document.getElementById('convoname').innerHTML = from.substr(0, from.lastIndexOf(':'));
								if (sendNumber == null) {
									sendNumber = msg.phoneNumber;
								}
							}
							//Mojo.Controller.errorDialog(from);
							document.getElementById('msgs').innerHTML += '<div class="' + side + 'Message" id="msg_' + msg.id + '"><div style="font-size:17px; margin-left:5px;">' + recentMsg + '</div></div>';
							msgScroller.mojo.revealBottom();
						/*msgList.push({
						 "body": recentMsg,
						 "id": msg.id,
						 "side": side
						 });*/
						}
					}
					if (document.getElementById('convoname').innerHTML == "") {
						var fromIndex = xmlData.indexOf('<a class="gc-under gc-message-name-link" title="Go to contact" href="javascript://">');
						var from = xmlData.substr(fromIndex + 84);
						from = from.substr(0, from.indexOf('</a>'));
						document.getElementById('convoname').innerHTML = from;
					}
					xi++;
				}
.bind(this));
			}
			
			
			x++;
			
		});
		
	}.bind(this));

}

SmsReadAssistant.prototype.handleCommand = function(event) {
	if(event.type == Mojo.Event.back)
	{
		clearInterval(intID);
	}
}