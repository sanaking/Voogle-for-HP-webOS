var ConnectingDialog = Class.create({
									  initialize: function(sceneAssistant, app) {
		this.app = app;
		this.sceneAssistant = sceneAssistant;
		this.controller = this.sceneAssistant.controller;
		
	},

	setup : function(widget) {
		this.widget = widget;
		
	}
	
									  });
									  
									  var DeletingDialog = Class.create({
									  initialize: function(sceneAssistant, app) {
		this.app = app;
		this.sceneAssistant = sceneAssistant;
		this.controller = this.sceneAssistant.controller;
		
	},

	setup : function(widget) {
		this.widget = widget;
		
	}
	
									  });
								
								