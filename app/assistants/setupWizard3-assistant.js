/*
 * Voogle2
 * Version 2.x of Voogle
 * Copyright 2011 - C2 Partners, LLC. DBA kandutech
 * THIS SOURCE CODE MAY NOT BE DISTRBUTED IN ANY WAY WITHOUT PERMISSION FROM C2 PARTNERS, LCC. DBA KANDUTECH.
 * DISTRIBUTING THIS SOURCE CODE WILL RESULT IN PROMPT LEGAL ACTION.
 * DEVELOPED BY: CONNOR LACOMBE & THE KANDUTECH TEAM.
 * FOR CONTACT INFORMATION VISIT: HTTP://KANDUTECH.COM
 */
function SetupWizard3Assistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SetupWizard3Assistant.prototype.setup = function() {
	jQuery.noConflict();
	this.controller.setupWidget("cont",{}, this.contbutton = {label: "Skip"});
	document.getElementById("cont").style.display = "none";
	this.controller.setupWidget("phoneLoader", {
		spinnerSize: "large"
	}, {
		spinning: true
	});
	this.controller.setupWidget("scroller", {}, {});
	this.controller.setupWidget("phoneList",
        {
            itemTemplate: "setupWizard3/list",
            swipeToDelete: false,
            reorderable: false
         },
         this.listModel = {
             listTitle: "Phones",
             items : []
          }
    ); 
	document.getElementById("scroller").style.display = "none";
	Mojo.Event.listen(this.controller.get("phoneList"), Mojo.Event.listTap, this.listTap.bind(this));
	//Get phones
	var phoneList = Array();
		Voogle.getPhones(kt.cookies.get("voogle_userString"), function(phones){
			for (var i = 0; i < phones.length - 1; i++) {
				phoneList.push({
					number: phones[i]
				});
			}
			if (phoneList.length == 0) {
				document.getElementById("errorMsg").style.visibility = "visible";
				document.getElementById("cont").style.display = "";
				Mojo.Event.listen(this.controller.get("cont"), Mojo.Event.tap, this.skipButton.bind(this));
			}
			else {
				this.listModel.items = phoneList;
				this.controller.modelChanged(this.listModel);
			}
			document.getElementById("phoneLoader").style.display = "none";
			document.getElementById("scroller").style.display = "";
		}.bind(this));
};

SetupWizard3Assistant.prototype.skipButton = function() {
	kt.cookies.set("voogle_phoneNumber", "noNum");
	this.controller.stageController.swapScene("setupWizard4");
};

SetupWizard3Assistant.prototype.listTap = function(event) {
	var num = event.item.number;
	kt.cookies.set("voogle_phoneNumber", num);
	this.controller.stageController.swapScene("setupWizard4");
};

SetupWizard3Assistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SetupWizard3Assistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SetupWizard3Assistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
