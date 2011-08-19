function PreferencesAssistant() {}

PreferencesAssistant.prototype.setup = function() {
	jQuery.noConflict();
	//Setup widgets
	var tone = kt.cookies.get("voogle_toneSetting");
	var notifications = kt.cookies.get("voogle_notifications");
	var gvnum = kt.cookies.get("voogle_googleNumber");
	if(tone == "vibrate")
	{
		tone = true;
	}
	else
	{
		tone = false;
	}
	if(notifications == "on")
	{
		notifications = true;
	}
	else
	{
		notifications = false;
	}
	jQuery("#gvnum").text(fancifyNumber(gvnum));
	this.controller.setupWidget("prefsscroller",
        this.attributes = {
            mode: 'vertical'
        },
        this.model = {
        }
    ); 
	this.controller.setupWidget("dialpad-toggle",
        this.attributes = {
            trueValue: true,
            falseValue: false,
			trueLabel: "Vibrate",
			falseLabel: "Sound" 
        },
        this.model = {
            value: tone,
            disabled: false
        }
    ); 
	/*this.controller.setupWidget("notifications-toggle",
        this.attributes = {
            trueValue: true,
            falseValue: false
        },
        this.model = {
            value: notifications,
            disabled: false
        }
    );*/
	this.controller.setupWidget("email",
	this.attributes = {
		focus: true,
		hintText: $L("Email"),
		textCase: Mojo.Widget.steModeLowerCase
	},
	this.emailmodel = {
		value: "",
		disabled: false
	});
	
	this.controller.setupWidget("password",
	this.attributes = {
		hintText: $L("Password"),
		focus: false
	},
	this.passwordmodel = {
		value: "",
		disabled: false
	});
	
	this.controller.setupWidget("clearCreds",
	this.attributes = {
		label: "Clear Credentials",
		type: Mojo.Widget.activityButton
	},
	this.model = {
	});
	
	Mojo.Event.listen(this.controller.get("clearCreds"), Mojo.Event.tap, this.updateButton); 
	Mojo.Event.listen(this.controller.get("dialpad-toggle"), Mojo.Event.propertyChange, this.dialpadToggle);
	//Mojo.Event.listen(this.controller.get("notifications-toggle"), Mojo.Event.propertyChange, this.notificationsToggle);
}

function fancifyNumber(number)
{
	//fancy number shiz
	if(number.length < 7 || number.length > 11)
	{
		return number;
	}
	if(number.length == 7)
	{
		return number.substr(0, 3)+"-"+number.substr(3,3);
	}
	if(number.length > 7 && number.length < 10)
	{
		return number;
	}
	if(number.length == 10)
	{
		return "("+number.substr(0, 3)+") "+number.substr(3,3)+"-"+number.substr(6, 4);
	}
	if(number.length == 11)
	{
		return "+"+number.substr(0, 1)+" ("+number.substr(1, 3)+") "+number.substr(4,3)+"-"+number.substr(7, 4);
	}
}

PreferencesAssistant.prototype.dialpadToggle = function(event) {
	if(event.value == true)
	{
		kt.cookies.set("voogle_toneSetting", "vibrate");
	}
	if(event.value == false)
	{
		kt.cookies.set("voogle_toneSetting", "sound");
	}
}

PreferencesAssistant.prototype.notificationsToggle = function(event) {
	if(event.value == true)
	{
		kt.cookies.set("voogle_notifications", "on");
	}
	if(event.value == false)
	{
		kt.cookies.set("voogle_notifications", "off");
	}
}

PreferencesAssistant.prototype.updateButton = function(event) {
	
		kt.cookies.set("voogle_userString", "");
		Mojo.Controller.stageController.popScene();
		Mojo.Controller.stageController.swapScene("setupWizard1");
}