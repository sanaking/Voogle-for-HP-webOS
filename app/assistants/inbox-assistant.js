function InboxAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

InboxAssistant.prototype.setup = function() {
	
	jQuery.noConflict();
	this.oldList = Array();
	InboxAssistant.Metrix = new Metrix(); //Instantiate Metrix Library
	InboxAssistant.Metrix.initialize();
	InboxAssistant.Metrix.postDeviceData();
	Mojo.Event.listen(this.controller.get("folderSelect"), Mojo.Event.tap, this.folderSelect.bind(this)); 
	Mojo.Event.listen(this.controller.get("refreshButton"), "click", this.refreshButton.bind(this));
	
	this.controller.setupWidget(Mojo.Menu.appMenu,
    {
        omitDefaultItems: true
    },
    {
		visible: true,
		items: [{
			label: "Preferences",
			command: 'preferences'
		}, /*{
			label: "Support",
			command: 'do-Support'
		},*/ {
			label: "Logout",
			command: 'logout'
		}]
	}
);
	this.controller.setupWidget(Mojo.Menu.commandMenu,
    {
        spacerHeight: 0
    },
    {
        visible: true,
        items: [ {},
            {items: [
				{iconPath:"images/menu-icon-dtmfpad.png", command: "dialer"},
				{iconPath:"images/menu-icon-newchat.png", command: "newTxt"},
			//	{iconPath:"images/menu-icon-favorites.png", command: "favorites"}//,
				//{iconPath:"images/menu-icon-directory.png", command: "directory"}
				]},
				{}
        ]
    }
);

	this.controller.setupWidget("inboxMsgs",
        {
			itemTemplate: "inbox/inbox-list",
			swipeToDelete: true,
			reorderable: false
		},
         this.inboxmodel = {
		 	listTitle: "Inbox",
		 	items: []
		 }
    );
	this.controller.setupWidget("scroller",
        {
            mode: 'vertical'
        },
        {}
    ); 
	this.controller.setupWidget("inboxLoader",
        {
            spinnerSize: "large"
        },
        {
            spinning: true 
        }
    );
	this.controller.setupWidget("smallLoader",
        {
            spinnerSize: "small"
        },
        {
            spinning: true 
        }
    );
	
	setTimeout(function() {this.loadFolder().bind(this);}.bind(this), 200);
	this.refreshId = setInterval(function() {this.loadFolder().bind(this);}.bind(this), 30000);
	Mojo.Event.listen(this.controller.get("inboxMsgs"), Mojo.Event.listTap, this.listTap.bind(this));
	Mojo.Event.listen(this.controller.get("inboxMsgs"), Mojo.Event.listDelete, this.listDelete.bind(this));
};

InboxAssistant.prototype.folderSelect = function(event) {

	var dynamicList = Array();
	var foldernames = ["Inbox", "Starred", "Voicemail", "Texts", "Recorded", "Placed", "Received", "Missed", "All", "Unread"];
	for(var i = 0; i < foldernames.length; i ++) {
		if(foldernames[i] == document.getElementById("folderSelect").innerHTML) {
			dynamicList.push({label:foldernames[i], command:foldernames[i], chosen:true});
		}
		else {
			dynamicList.push({label:foldernames[i], command:foldernames[i]});
		}
	}
	this.controller.popupSubmenu({
             onChoose:this.folderChoose.bind(this),
             placeNear:this.controller.get("folderSelect"),
             items: dynamicList
             });
};

function star(obj) {

}

InboxAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.command) {
		switch(event.command) {
			case "preferences":
			this.controller.stageController.pushScene("preferences");
			break;
			case "logout":
			kt.cookies.set("voogle_userString", "");
			Mojo.Controller.stageController.popScene();
			Mojo.Controller.stageController.swapScene("setupWizard1");
			break;
			case "dialer":
			this.controller.stageController.pushScene("dialer");
			break;
			case "newTxt":
			this.controller.stageController.pushScene("newTxt");
			break;
		}
	}
};


InboxAssistant.prototype.listTap = function(event) {
	var index = event.index;
	var id = this.inboxmodel.items[index].msgid;
	var type = this.inboxmodel.items[index].type;
	var number = this.inboxmodel.items[index].sendNumber;
	if(type == "recieved" || type == "missed") {
		
	}
	else {
		this.controller.stageController.pushScene(type+"Read", id, number);
	}
};

InboxAssistant.prototype.listDelete = function(event) {
	var index = event.index;
	var id = this.inboxmodel.items[index].msgid;
	document.getElementById("smallLoader").style.visibility = "visible";
	clearInterval(this.refreshId);
	Voogle.deleteItem(kt.cookies.get("voogle_userString"), id, function(){
		if (this.inboxmodel.items.length == 0) {
			document.getElementById('noMsgsAlert').style.display = "";
		}
		this.refreshId = setInterval(function() {this.loadFolder().bind(this);}.bind(this), 30000);
		this.inboxmodel.items.splice(index, 1);
		document.getElementById("smallLoader").style.visibility = "hidden";
		//setTimeout(function() {this.loadFolder().bind(this);}.bind(this), 200);
	}.bind(this));
};

InboxAssistant.prototype.refreshButton = function() {
	document.getElementById("inboxMsgs").style.display = "none";
	document.getElementById("inboxLoader").style.display = "";
	document.getElementById("noMsgsAlert").style.display = "none";
	this.loadFolder().bind(this);
};

InboxAssistant.prototype.loadFolder = function(event) {
	Voogle.getFolder(kt.cookies.get("voogle_userString"), document.getElementById("folderSelect").innerHTML, function(folder) {
		document.getElementById("inboxMsgs").style.display = "";
		document.getElementById("inboxLoader").style.display = "none";
		if (folder != this.oldList) {
			this.inboxmodel.items = folder;
			this.controller.modelChanged(this.inboxmodel);
			this.oldList = folder;
		}
		if (folder.length == 0) {
			document.getElementById('noMsgsAlert').style.display = "";
		}
		for (x = 0; x <= folder.length; x++) {
			var msg = folder[x];
			if (msg.isRead == false) {
				var objID = "unread_" + msg.num;
				document.getElementById(objID).style.display = "";
			}
			if (msg.star == true) {
				var objID = "star_" + msg.num;
				document.getElementById(objID).src = "images/ui/active_star.png";
			}
		}
	}.bind(this));
};

var tid;
function list_down(obj)
{
	tid = setTimeout(function(){
		obj.className = "leftMessageAct";
	}, 200);
}

function list_up(obj)
{
	obj.className = "leftMessage";
	clearTimeout(tid);
}

InboxAssistant.prototype.folderChoose = function(command){
	if (command != undefined) {
		document.getElementById("folderSelect").innerHTML = command;
		document.getElementById("inboxMsgs").style.display = "none";
		document.getElementById("inboxLoader").style.display = "";
		document.getElementById("noMsgsAlert").style.display = "none";
		setTimeout(function(){
			this.loadFolder().bind(this);
		}
.bind(this), 300);
	}
};
