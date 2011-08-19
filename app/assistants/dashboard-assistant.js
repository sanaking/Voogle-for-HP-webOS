var id;
DashboardAssistant = Class.create({
	setup: function(event) {
		this.switchHandler = this.launchMain.bindAsEventListener(this);
    	this.controller.listen("dashboardinfo", Mojo.Event.tap, this.switchHandler);
		this.updateDisplay();
	},
	
	initialize: function(messageText) {
    	
		this.messageText = messageText[1];
		this.messageTitle = messageText[0];
		this.count = messageText[2];
		id = messageText[3];
	},
	
	launchMain: function(){
		var appController = Mojo.Controller.getAppController();
	    appController.assistant.handleLaunch({action: "launchInbox"});
	    this.controller.window.close();
			},
	
	update: function(messageText) {
		this.messageText = messageText[1];
		this.messageTitle = messageText[0];
		this.count = messageText[2];
		this.id = messageText[3];
		this.updateDisplay();
	},
	
	updateDisplay: function(){
		var props = {
			title: this.messageTitle,
			message: this.messageText,
			count: this.count
		};
		this.setWakeupAlarm("com.kandutech.voogle", 30, true);
		var messageText = Mojo.View.render({
			object: props,
			template: 'dashboard/dashboard-message'
		});
		var messageDiv = this.controller.get('dashboardinfo');
		Element.update(messageDiv, messageText);
	},
	setWakeupAlarm : function(appId, alarmTimeInSeconds, wakeupDevice) {
	// Use the JavaScript Date object to setup the alarm
	// time by getting the current system time and adding
	// the specified time interval to it (in milliseconds).
	var alarm = new Date();
	var alarmTimeInMiliseconds = alarm.getTime() + (1000 * alarmTimeInSeconds);
	alarm.setTime(alarmTimeInMiliseconds);
	
	// webOS Alarm service requires calendar-based
	// alarms to be in UTC and in the following format:
	//		mm/dd/yyyy hh:mm:ss
	var month = alarm.getUTCMonth()+1;
	var day = alarm.getUTCDate();
	var year = alarm.getUTCFullYear();
	var hours = alarm.getUTCHours();
	var minutes = alarm.getUTCMinutes();
	var seconds = alarm.getUTCSeconds();
	var alarmString = this.padZeroes(month, 2) + "/" + this.padZeroes(day, 2) + "/" + year + 
		" " + this.padZeroes(hours, 2) + ":" + this.padZeroes(minutes, 2) + ":" + this.padZeroes(seconds, 2);

	// Set the webOS calendar-based alarm.
	new Mojo.Service.Request("palm://com.palm.power/timeout", {
		method: "set",
		parameters: {
			key: appId + ".timer",
			at: alarmString,
			wakeup: wakeupDevice,
			uri: "palm://com.palm.applicationManager/open",
			params: {
				id: appId,
				params: {action: "checkNotifications"}
			}
		},
		onSuccess: function(response) {
			Mojo.Log.info(".....Alarm Set Succeeded!");
		},
		onFailure: function(response) {
			Mojo.Log.info(".....Alarm Set Failed!", response.errorText);
		}
	});
	Mojo.Log.info(".....Wakeup Alarm Timeout Set For", alarmString);
},

padZeroes:function(number, length) {
	var str = "" + number;
	while (str.length < length) {
		str = "0" + str;
	}
	return str;
}


});

