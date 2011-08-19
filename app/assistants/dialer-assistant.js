function DialerAssistant(passedNumber) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	  passedNumbera = passedNumber;
	  if (passedNumber) {
	  	strictNumber = passedNumber;
	  }
}

var toneSetting = "vibrate";
var strictNumber = "";
var self;
var passedNumbera;

DialerAssistant.prototype.setup = function() {
	jQuery.noConflict();
	if (Mojo.Environment.DeviceInfo.screenHeight <= 400) {
		var keys = document.getElementsByClassName("keypad-digit");
		jQuery.each(keys, function(index, value) {
			
				value.style.fontSize = "25px";
				if (index != 0) {
					value.style.marginRight = "45px";
					value.style.marginBottom = "8px";
				//value.style.marginTop = "-7px";
				}
				else {
					value.style.marginBottom = "-6px";
				}
					
				
		});
		var keysA = document.getElementsByClassName("keypad-letters");
		jQuery.each(keysA, function(index, value) {
			value.style.fontSize = "13px";
			value.style.marginTop = "-30px";
			value.style.paddingLeft = "40px";
		});
		//document.writeIn('<style>.keypad-letters {float: right; margin-top: 3px; font-size: 12px; color: #C2C9CF;} .keypad-digit {-webkit-box-sizing: border-box; float:left; font-weight: bold; line-height: 30px; font-size: 25px; color: #FFF;}</style>');
	}
	if(strictNumber != "") {
		var newNum = fancifyNumber(strictNumber);
		document.getElementById("dialNumber").innerHTML = newNum;
		if (strictNumber == "") {
			document.getElementById("dial_hinttext").style.display = "";
		}
		else {
			document.getElementById("dial_hinttext").style.display = "none";
		}
	}
	this.controller.setupWidget(Mojo.Menu.commandMenu,
    {
        spacerHeight: 0,
		menuClass: "no-fade"
    },
    {
        visible: true,
        items: [ {},
            
				{iconPath:"images/menu-icon-addcontact.png", command: "addContact"}
			//	{iconPath:"images/menu-icon-favorites.png", command: "favorites"}//,
				//{iconPath:"images/menu-icon-directory.png", command: "directory"}
				,
				{}
        ]
    }
);
	
	if(kt.cookies.get("voogle_toneSetting") != null) toneSetting = kt.cookies.get("voogle_toneSetting");
	Mojo.Event.listen(this.controller.get("dial_button"), Mojo.Event.tap, this.placeCall.bind(this));
	this.controller.get('delete_button').observe(Mojo.Event.tap, this.backspace.bindAsEventListener(this));
	this.controller.get('delete_button').observe(Mojo.Event.hold, this.clearNumber.bindAsEventListener(this));
	//Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageActivate, this.activate);
	self = this;
};

function getContact() {
	Mojo.Controller.stageController.pushScene(
        {
            appId: "com.palm.app.contacts",
            name: "list"
        },
        {
            mode: "picker",
            message: "Pick a contact to call"
        }
    );
};

DialerAssistant.prototype.placeCall = function(event){
	
	if (strictNumber == "") {
		this.controller.showAlertDialog({
			title: 'Error',
			message: 'You must dial a number before placing a call.',
			choices: [{
				label: 'Ok',
				value: 'Ok',
				type: 'default'
			}]
		});
	}
	else {
		var dialog = this.controller.showDialog({
			template: 'dialogs/connecting-dialog',
			assistant: new ConnectingDialog(this),
			preventCancel: true
		});
		Voogle.makeCall(kt.cookies.get("voogle_userString"), strictNumber, function(data){
			if (data.indexOf("true") != -1) {
					dialog.mojo.close();
					this.controller.showAlertDialog({
						title: 'Calling',
						message: 'Voogle is currently connecting you to the number you dialed. You\'\ll receive an phone call from ' + kt.cookies.get("voogle_googleNumber") + ', answer that call and you\'\ll be connected.',
						choices: [{
							label: 'Ok',
							value: 'Ok',
							type: 'default'
						}]
					});
				}
				else {
					dialog.mojo.close();
					this.controller.showAlertDialog({
						title: 'Disconnected',
						message: 'Voogle encountered an error while trying to connect you to ' + document.getElementById('dialNumber').innerHTML,
						choices: [{
							label: 'Ok',
							value: 'Ok',
							type: 'default'
						}]
					});
				}
		}.bind(this));
	}
	
}

DialerAssistant.prototype.clearNumber = function() {
	
	strictNumber = "";
	document.getElementById('dialNumber').innerHTML = "";
	if(strictNumber == "") {
		document.getElementById("dial_hinttext").style.display = "";
	}
	else {
		document.getElementById("dial_hinttext").style.display = "none";
	}
};

DialerAssistant.prototype.backspace = function() {
	strictNumber = strictNumber.substr(0, strictNumber.length-1);
	document.getElementById('dialNumber').innerHTML = fancifyNumber(strictNumber);
	if(strictNumber == "") {
		document.getElementById("dial_hinttext").style.display = "";
	}
	else {
		document.getElementById("dial_hinttext").style.display = "none";
	}
}

function keyPad(num){
	if(toneSetting == "vibrate")
	{
		var appController = Mojo.Controller.getAppController();
		appController.playSoundNotification("vibrate", "", "1");
	}
	else
	{
		self.controller.serviceRequest("palm://com.palm.audio/systemsounds", {
			method: "playFeedback",
			parameters: {
				name: "dtmf_"+num.toString() 	
			},
			onSuccess:{},
			onFailure:{}
		});
	}
	strictNumber = strictNumber + num.toString();
	var newNum = fancifyNumber(strictNumber);
	document.getElementById("dialNumber").innerHTML = newNum;
	if(strictNumber == "") {
		document.getElementById("dial_hinttext").style.display = "";
	}
	else {
		document.getElementById("dial_hinttext").style.display = "none";
	}
}

function defancifyNumber(number)
{
	//defancify the number to a strict number
	var newNumber = "";
	for(var i = 0; i < number.length; i ++)
	{
		if(number[i] != ")" && number[i] != "(" && number[i] != " " && number[i] != "." && number[i] != "-" && number[i] != "+")
		{
			newNumber += number[i];
		}
	}
	return newNumber;
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
		return number.substr(0, 3)+"-"+number.substr(3,4);
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

DialerAssistant.prototype.activate = function(response){
	if (response) {
		var numbers;
		//Mojo.Controller.errorDialog(Mojo.Environment.DeviceInfo.platformVersionMajor);
		if (Mojo.Environment.DeviceInfo.platformVersionMajor == 1) {
			numbers = response.details.record.phoneNumbers;
		}
		else {
			numbers = response.phoneNumbers;
		}
		if (numbers != undefined) {
			var nums = Array();
			if (numbers.length == 0) {
				Mojo.Controller.errorDialog("The contact you selected does not have any numbers associated with it.");
			}
			for (var i = 0; i < numbers.length; i++) {
				var ln = numbers[i].label;
				var l = "Other";
				switch (ln) {
					case 0:
						l = "Home"
						break;
					case 1:
						l = "Work"
						break;
					case 2:
						l = "Other"
						break;
					case 3:
						l = "Mobile"
						break;
					case 4:
						l = "Pager"
						break;
					case 5:
						l = "Personal Fax"
						break;
					case 6:
						l = "Work Fax"
						break;
					case 7:
						l = "Main"
						break;
					case 8:
						l = "SIM"
						break;
				}
				nums.push({
					value: numbers[i].value,
					type: "default",
					label: l + ": " + numbers[i].value
				});
			}
			this.controller.showAlertDialog({
				title: 'Select Number',
				onChoose: function(value){
					strictNumber = defancifyNumber(value);
					document.getElementById('dialNumber').innerHTML = fancifyNumber(strictNumber);
					if (strictNumber == "") {
						document.getElementById("dial_hinttext").style.display = "";
					}
					else {
						document.getElementById("dial_hinttext").style.display = "none";
					}
				},
				message: 'Please select a number associated with this contact.',
				choices: nums
			});
			
			
		}
		
	}
	else {
		if (!passedNumbera) {
			strictNumber = "";
			document.getElementById('dialNumber').innerHTML = "";
			if (strictNumber == "") {
				document.getElementById("dial_hinttext").style.display = "";
			}
			else {
				document.getElementById("dial_hinttext").style.display = "none";
			}
		}
		
	}
};

DialerAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.command) {
		switch(event.command) {
			case "addContact":
			getContact();
			break;
			case "newTxt":
			Mojo.Controller.stageController.pushScene("newTxt", strictNumber);
			break;
		}
	}
};

DialerAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

DialerAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
