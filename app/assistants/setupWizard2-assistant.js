/*
 * Voogle2
 * Version 2.x of Voogle
 * Copyright 2011 - C2 Partners, LLC. DBA kandutech
 * THIS SOURCE CODE MAY NOT BE DISTRBUTED IN ANY WAY WITHOUT PERMISSION FROM C2 PARTNERS, LCC. DBA KANDUTECH.
 * DISTRIBUTING THIS SOURCE CODE WILL RESULT IN PROMPT LEGAL ACTION.
 * DEVELOPED BY: CONNOR LACOMBE & THE KANDUTECH TEAM.
 * FOR CONTACT INFORMATION VISIT: HTTP://KANDUTECH.COM
 */
function SetupWizard2Assistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SetupWizard2Assistant.prototype.setup = function() {
	jQuery.noConflict();
	this.controller.setupWidget("email",
	{
		multiline:false,
		enterSubmits:false,
		focus:true,
		textCase: Mojo.Widget.steModeLowerCase
	},
	{
		value: "",
		disabled: false
	});
	this.controller.setupWidget("password",
	{
		multiline:false,
		enterSubmits:false,
		focus:false
	},
	{
		value: "",
		disabled: false
	});
	this.controller.setupWidget("cont",
	{
		label: "Continue",
		type: Mojo.Widget.activityButton
	},
	{
		
	});
	
	Mojo.Event.listen(this.controller.get("cont"), Mojo.Event.tap, this.continueTap.bind(this));
};
SetupWizard2Assistant.prototype.continueTap = function() {
	document.getElementById("errorMsg").style.visibility = "hidden";
	Voogle.Authenticate(email.mojo.getValue() + "||" + password.mojo.getValue(), function(resp) {
		cont.mojo.deactivate();
		if(resp == true)
		{
			kt.cookies.set("voogle_userString", email.mojo.getValue() + "||" + password.mojo.getValue());
			kt.cookies.set("voogle_defaultScene", "inbox");
			Mojo.Controller.stageController.swapScene("setupWizard3");
		}
		if(resp == false) {
			document.getElementById("errorMsg").style.visibility = "visible";
		}
	}.bind(this));
};

SetupWizard2Assistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SetupWizard2Assistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SetupWizard2Assistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
