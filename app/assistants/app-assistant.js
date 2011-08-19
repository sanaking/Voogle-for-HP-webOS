/*
 * Voogle2
 * Version 2.x of Voogle
 * Copyright 2011 - C2 Partners, LLC. DBA kandutech
 * THIS SOURCE CODE MAY NOT BE DISTRBUTED IN ANY WAY WITHOUT PERMISSION FROM C2 PARTNERS, LCC. DBA KANDUTECH.
 * DISTRIBUTING THIS SOURCE CODE WILL RESULT IN PROMPT LEGAL ACTION.
 * DEVELOPED BY: CONNOR LACOMBE & THE KANDUTECH TEAM.
 * FOR CONTACT INFORMATION VISIT: HTTP://KANDUTECH.COM
 */
function AppAssistant() {}

AppAssistant.prototype.setup = function() {

		var userCookie = kt.cookies.get("voogle_userString");
		
		if (userCookie != null && userCookie != "") {
			//this.noParamsLaunchScene = kt.cookies.get("voogle_defaultScene");
			this.noParamsLaunchScene = "inbox";
		}
		else {
			this.noParamsLaunchScene = "setupWizard1";
		}
	
}

AppAssistant.prototype.handleLaunch = function(params) {
	var currentCard = this.controller.getStageController("voogle");
	if (!params) {
		if (currentCard) {
			currentCard.activate();
		}
		else {
		
			var stageArguments = {
				name: this.noParamsLaunchScene
			};
			this.controller.createStageWithCallback(stageArguments, function(stageController){
				stageController.pushScene(this.noParamsLaunchScene);
			}
.bind(this), "card");
		}
	}
	else {
		if (params.action == "notificationcheck" && kt.cookies.get("voogle_notifications") == "on") {
			Voogle.getFolder(kt.cookies.get("voogle_userString"), "Inbox", function(folder){
				folder = folder.reverse();
				for (msg in folder) {
					if (msg.isRead == false) {
					//var db = 
					}
				}
			});
		}
		if (params.action == "dial") {
			var stageArguments = {
				name: "dialer"
			};
			this.controller.createStageWithCallback(stageArguments, function(stageController){
				stageController.pushScene("dialer", params.number);
			}
.bind(this), "card");
		}
		if (launchParams.action == "launchInbox") {
			var stageControllera = Mojo.Controller.getAppController().getStageController("dashboard");
			if (stageControllera) {
				stageControllera.window.close();
			}
			stageController.pushScene("inbox");
		}
	}
}

