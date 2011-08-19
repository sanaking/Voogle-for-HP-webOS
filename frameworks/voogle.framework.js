/*
 * Voogle2
 * Version 2.x of Voogle
 * Copyright 2011 - C2 Partners, LLC. DBA kandutech
 * THIS SOURCE CODE MAY NOT BE DISTRBUTED IN ANY WAY WITHOUT PERMISSION FROM C2 PARTNERS, LCC. DBA KANDUTECH.
 * DISTRIBUTING THIS SOURCE CODE WILL RESULT IN PROMPT LEGAL ACTION.
 * DEVELOPED BY: CONNOR LACOMBE & THE KANDUTECH TEAM.
 * FOR CONTACT INFORMATION VISIT: https://KANDUTECH.COM
 */

var Voogle = {
	Authenticate: function(userString, cb) {
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.get("https://kandutech.net/voogle/?email="+email+"&password="+pass+"&cmd=login",
			function(data) {
				if(data == "authSuccess") {
					//Authentication was successful
					cb(true);
				}
				if(data == "authFailed") {
					cb(false);
				}
			});
	},
	getConvo: function(userString, cb){
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.ajax({
			url: "https://kandutech.net/voogle/?email=" + email + "&password=" + pass + "&cmd=getTxts",
			type: 'GET',
			success: function(data){
				cb(data);
			}
		});
	},
	getRecorded: function(userString, cb) {
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.ajax({
			url: "https://kandutech.net/voogle/?email=" + email + "&password=" + pass + "&cmd=getRecorded",
			type: 'GET',
			success: function(data){
				cb(data);
			}
		});
	},
	getVoicemail: function(userString, msgId, cb){
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.ajax({
			url: "https://kandutech.net/voogle/?email=" + email + "&password=" + pass + "&cmd=getVoicemails",
			type: 'GET',
			success: function(data){
				cb(data);
			}
		});
	},
	sendText: function(userString, value, sendNumber, cb){
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.ajax({
		url: "https://kandutech.net/voogle/?email="+email+"&password="+pass+"&cmd=sendSMS&sendTo="+sendNumber+"&msg="+value,
		type: 'GET',
		success: function(data) {
			cb(data);
		}});
	},
	markRead: function(userString, msidd, cb) {
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.get("https://kandutech.net/voogle/?email="+email+"&password="+pass+"&cmd=markRead&id="+msidd,
			function(data) {
				cb("balls.");
			});
	},
	getPhones: function(userString, cb) {
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.get("https://kandutech.net/voogle/?email="+email+"&password="+pass+"&cmd=getPhones",
			function(data) {
				if(data == "authFailed") {
					cb(false);
				}
				else {
					cb(data.split("|"));
				}
			});
	},
	deleteItem: function(userString,  msidd, cb) {
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.ajax({
		url: "https://kandutech.net/voogle/?email="+email+"&password="+pass+"&cmd=deleteMsg&id="+ msidd,
		type: 'GET',
		success: function(data){
			cb(true);
		}.bind(this)
		});
	},
	getGVNumber: function(userString, cb) {
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.get("https://kandutech.net/voogle/?email="+email+"&password="+pass+"&cmd=getGoogleNumber",
			function(data) {
				if(data == "authFailed") {
					cb(false);
				}
				else {
					cb(data);
				}
			});
	},
	makeCall: function(userString, number, cb){
		var thisNumber = kt.cookies.get("voogle_phoneNumber");
		
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.ajax({
			url: "https://kandutech.net/voogle/?email=" + email + "&password=" + pass + "&cmd=placeCall&callTo=" + number + "&callFrom=" + thisNumber,
			type: 'GET',
			success: function(data){
				cb(data);
			}
		});
	},
	sendTxt: function(userString, txtParams, cb) {
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.get("https://kandutech.net/voogle/?email="+email+"&password="+pass+"&cmd=sendSMS&sendTo="+txtParams["number"]+"&msg="+encodeURIComponent(txtParams["message"]),
			function(data) {
				if(data == "authFailed") {
					cb(false);
				}
				else {
					cb(data);
				}
			});
	},
	getRecentTxtId: function(userString, cb){
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		jQuery.get("https://kandutech.net/voogle/?email=" + email + "&password=" + pass + "&cmd=getTexts", function(data){
			if (data == "authFailed") {
				cb(false);
			}
			else {
				var json = data.substr(data.indexOf("<json><![CDATA") + 14);
				json = json.substr(0, json.indexOf("]></json>"));
				json = jQuery.parseJSON(json);
				var xmlData = data.substr(data.indexOf('<html><![CDATA[') + 15);
				xmlData = xmlData.substr(0, xmlData.indexOf(']]></html>'));
				var messages = json[0]["messages"];
				var convos = xmlData.split('<span class="gc-message-name">');
				var x = 0;
				jQuery.each(messages, function(i, msg){
					if (x == 0) {
						var id = msg.id;
						Mojo.Controller.stageController.popScene();
						Mojo.Controller.stageController.pushScene("smsRead", id, smsNum.mojo.getValue());
						x++;
					//this.break;
					}
					
					
				});
			}
		});
	},
	getFolder: function(userString, folderName, cb){
		var email = encodeURIComponent(userString.split("||")[0]);
		var pass = encodeURIComponent(userString.split("||")[1]);
		if (folderName == "Voicemail") 
			folderName = "Voicemails";
		jQuery.get("https://kandutech.net/voogle/?email=" + email + "&password=" + pass + "&cmd=get" + folderName, function(data){
			if (data == "authFailed") {
				cb(false);
			}
			else {
				var folderList = Array();
				var json = data.substr(data.indexOf("<json><![CDATA") + 14);
				json = json.substr(0, json.indexOf("]></json>"));
				json = jQuery.parseJSON(json);
				var xmlData = data.substr(data.indexOf('<html><![CDATA[') + 15);
				xmlData = xmlData.substr(0, xmlData.indexOf(']]></html>'));
				var messages = json[0]["messages"];
				var convos = xmlData.split('<span class="gc-message-name">');
				
				
				var x = 1;
				jQuery.each(messages, function(i, msg){
					var isread = false;
					if(msg.isRead) {isread = msg.isRead;}
					var id = msg.id;
					var convo = convos[x];
					var label = msg.labels[1];
					if (label == "unread" || label == "inbox" || label == "starred") {
						label = msg.labels[2];
					}
					if (label == "unread") {
						label = msg.labels[3];
					}
					if (msg.labels[0] == "placed") {
						label = "placed";
					}
					if (msg.labels[0] == "received") {
						label = "received";
					}
					if (label == "all") {
						label = msg.labels[0];
					}
					if (label == "sms") {
						var lastIndex = convo.lastIndexOf('<span class="gc-message-sms-text">');
						var recentMsg = convo.substr(lastIndex + 34);
						recentMsg = recentMsg.substr(0, recentMsg.indexOf('</span>'));
						
						if (convo.indexOf('<span title="">Unknown</span>') != -1) {
							from = "Unknown";
						}
						else {
							var fromIndex = convo.lastIndexOf('<a class="gc-under gc-message-name-link" title="Go to contact" href="javascript://">');
							var from = convo.substr(fromIndex + 84);
							from = from.substr(0, from.indexOf('</a>'));
						}
					}
					else 
						if (label == "received") {
							var lastIndex = convo.lastIndexOf('<span class="gc-message-time">');
							recentMsg = convo.substr(lastIndex + 30);
							var recentMsg = recentMsg.substr(0, recentMsg.indexOf('</span>'));
							
							if (convo.indexOf('<span title="">Unknown</span>') != -1) {
								from = "Unknown";
							}
							else {
								var fromIndex = convo.lastIndexOf('<a class="gc-under gc-message-name-link" title="Go to contact" href="javascript://">');
								var from = convo.substr(fromIndex + 84);
								from = from.substr(0, from.indexOf('</a>'));
							}
						}
						else 
							if (label == "missed") {
								var lastIndex = convo.lastIndexOf('<span class="gc-message-time">');
								recentMsg = convo.substr(lastIndex + 30);
								var recentMsg = recentMsg.substr(0, recentMsg.indexOf('</span>'));
								if (convo.indexOf('<span title="">Unknown</span>') != -1) {
									from = "Unknown";
								}
								else {
									var fromIndex = convo.lastIndexOf('<a class="gc-under gc-message-name-link" title="Go to contact" href="javascript://">');
									var from = convo.substr(fromIndex + 84);
									from = from.substr(0, from.indexOf('</a>'));
								}
							}
							else 
								if (label == "placed") {
									var lastIndex = convo.lastIndexOf('<span class="gc-message-time">');
									recentMsg = convo.substr(lastIndex + 30);
									var recentMsg = recentMsg.substr(0, recentMsg.indexOf('</span>'));
									
									if (convo.indexOf('<span title="">Unknown</span>') != -1) {
										from = "Unknown";
									}
									else {
										var fromIndex = convo.lastIndexOf('<a class="gc-under gc-message-name-link" title="Go to contact" href="javascript://">');
										var from = convo.substr(fromIndex + 84);
										from = from.substr(0, from.indexOf('</a>'));
									}
								}
								else 
									if (label == "recorded") {
										if (convo.indexOf('<span title="">Unknown</span>') != -1) {
											from = "Unknown";
										}
										else {
											var fromIndex = convo.lastIndexOf('<a class="gc-under gc-message-name-link" title="Go to contact" href="javascript://">');
											var from = convo.substr(fromIndex + 84);
											from = from.substr(0, from.indexOf('</a>'));
										}
										
										recentMsg = "No transcript.";
									}
									else 
										if (label == "voicemail") {
											var lastIndex = convo.lastIndexOf('<div class="gc-message-message-display">');
											var recentMsg = convo.substr(lastIndex + 40);
											recentMsg = recentMsg.substr(0, recentMsg.indexOf('</div>'));
											
											if (convo.indexOf('<span title="">Unknown</span>') != -1) {
												from = "Unknown";
											}
											else {
												var fromIndex = convo.lastIndexOf('<a class="gc-under gc-message-name-link" title="Go to contact" href="javascript://">');
												var from = convo.substr(fromIndex + 84);
												from = from.substr(0, from.indexOf('</a>'));
											}
										}
					if(folderName == "Unread" && isread == false || folderName != "Unread") {
						folderList.push({
							"num": (x - 1),
							"type": label,
							"name": from,
							"body": recentMsg,
							"isRead": isread,
							"msgid": msg.id,
							"star": msg.star,
							"sendNumber": msg.phoneNumber
						});
					}
					
					x++;
					
				});
				cb(folderList);
			}
		});
	}
};
