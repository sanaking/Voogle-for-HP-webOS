/*
 * Voogle2
 * Version 2.x of Voogle
 * Copyright 2011 - C2 Partners, LLC. DBA kandutech
 * THIS SOURCE CODE MAY NOT BE DISTRBUTED IN ANY WAY WITHOUT PERMISSION FROM C2 PARTNERS, LCC. DBA KANDUTECH.
 * DISTRIBUTING THIS SOURCE CODE WILL RESULT IN PROMPT LEGAL ACTION.
 * DEVELOPED BY: CONNOR LACOMBE & THE KANDUTECH TEAM.
 * FOR CONTACT INFORMATION VISIT: HTTP://KANDUTECH.COM
 */
function SetupWizard1Assistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SetupWizard1Assistant.prototype.setup = function() {
	this.controller.setupWidget("continue", {label: "Continue"}, {});
	Mojo.Event.listen(this.controller.get("continue"), Mojo.Event.tap, this.continueTap.bind(this));
};

SetupWizard1Assistant.prototype.continueTap = function() {
	/*var oauthConfig = {
		callbackScene:"setupWizard2",
		requestTokenUrl: "https://www.google.com/accounts/OAuthGetRequestToken",
		requestTokenMethod: "POST",
		authorizeUrl: "https://www.google.com/accounts/OAuthAuthorizeToken",
		accessTokenUrl: "https://www.google.com/accounts/OAuthGetAccessToken",
		accessTokenMethod: "POST",
		consumer_key: "kandutech.net",
		consumer_key_secret: "WIhcleYlga2i9b5NrV0db5yT"
	};*/
	this.controller.stageController.swapScene("setupWizard2");
};

SetupWizard1Assistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SetupWizard1Assistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SetupWizard1Assistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
