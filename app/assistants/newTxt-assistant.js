function NewTxtAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	  
}

var strictNumber = "";
NewTxtAssistant.prototype.setup = function() {
	jQuery.noConflict();
	
	this.controller.setupWidget("loader",
        {
            spinnerSize: "large"
        },
        this.model = {
            spinning: true 
        }
    );
	document.getElementById('loader').style.visibility = "hidden";
	this.controller.setupWidget("smsMsg",
	{
		focus: false,
		multiline: true,
		enterSubmits: true,
		hintText: "Enter message here..."
	},
	this.emailmodel = {
		value: "",
		disabled: false
	});	
	
	this.controller.setupWidget("smsNum",
	{
		focus: true,
		hintText: "Enter number...",
		modifierState: Mojo.Widget.numLock
	},
	this.emailmodel = {
		value: "",
		disabled: false
	});
	
	this.keyHandler = this.keyDown.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.document, 'keydown',this.keyHandler, true);

};

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

NewTxtAssistant.prototype.keyDown = function(event) {
	if(Mojo.Char.isEnterKey(event.keyCode))
	{
		this.sendMsg().bind(this);
	}
};

function contacts() {
	Mojo.Controller.stageController.pushScene(
        {
            appId: "com.palm.app.contacts",
            name: "list"
        },
        {
            mode: "picker",
            message: "Pick a contact to text"
        }
    );
};

NewTxtAssistant.prototype.activate = function(response) {
 if (response) {

 	var numbers;
 	//Mojo.Controller.errorDialog(Mojo.Environment.DeviceInfo.platformVersionMajor);
		if (Mojo.Environment.DeviceInfo.platformVersionMajor == 1) {
			numbers = response.details.record.phoneNumbers;
		}
		else {
			numbers = response.phoneNumbers;
		}
		
		if (numbers != undefined || numbers != null) {
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
					smsNum.mojo.setValue(strictNumber);
				},
				message: 'Please select a number associated with this contact.',
				choices: nums
			});
			
			
		}
		else {
			//strictNumber = response;
			//smsNum.mojo.setValue(response);
		}
	}
	else {
		if(response == undefined) {
			//strictNumber = "";
			//smsNum.mojo.setValue("");
		}
	}
};

NewTxtAssistant.prototype.sendMsg = function() {
	var value = smsMsg.mojo.getValue();
	if(value != "")
	{
		document.getElementById('loader').style.visibility = "visible";
		smsMsg.mojo.setValue("");
		var sendNumber = defancifyNumber(smsNum.mojo.getValue());
		Voogle.sendTxt(kt.cookies.get("voogle_userString"), {"number": sendNumber, "message": value}, function(data) {
			Voogle.getRecentTxtId(kt.cookies.get("voogle_userString"), function(id) {
				this.controller.stageController.swapScene("smsRead", id);
			}.bind(this));
		}.bind(this));
	}
};


NewTxtAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

NewTxtAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
