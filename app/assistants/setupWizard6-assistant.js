function SetupWizard6Assistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SetupWizard6Assistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
	this.controller.setupWidget("goInbox", {label: "Go To My Inbox"}, {});
	kt.cookies.set("voogle_v2", "true");
	Mojo.Event.listen(this.controller.get("goInbox"), Mojo.Event.tap, this.goToInbox.bind(this));
	kt.cookies.set("voogle_defaultScene", "inbox");
	kt.cookies.set("voogle_toneSetting", "sound");
	kt.cookies.set("voogle_notifications", "on");
};

SetupWizard6Assistant.prototype.goToInbox = function() {
	this.controller.stageController.swapScene("inbox");
};

SetupWizard6Assistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SetupWizard6Assistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SetupWizard6Assistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
