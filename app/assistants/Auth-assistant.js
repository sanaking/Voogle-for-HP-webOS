function AuthAssistant() {}

AuthAssistant.prototype.setup = function(event) {
	/* this.controller.get("AuthStatus").innerHTML=$L("Fetching Authentication Token");
    this.spinnerModel= {
	spinning:  true,
	spinnerSize: 'Mojo.Widget.spinnerSmall'
	}; 
	this.controller.setupWidget('authSpinner', this.spinnerModel);
	this.authSpinner=this.controller.get('authSpinner');
        this.controller.instantiateChildWidgets(this.authSpinner.up());
        this.authSpinner.mojo.start();
       
    switch (this.serviceName){
        case 'google':
	     oauth={key: 'kandutech.net', secret: 'WIhcleYlga2i9b5NrV0db5yT', callback:"YOUR_CALLBACK"}
	     args={scope:"https://voice.google.com/",xoauth_displayname:"APP_NAME"}
            this.oauth=new OAuth('google',oauth,args,this,this.handleOAuth.bind(this));
	    break
        case 'photobucket':
            oauth={key: 'kandutech.net', secret: 'WIhcleYlga2i9b5NrV0db5yT', callback:"YOUR_CALLBACK"}
	    args={format:'json'}
            this.oauth=new OAuth('photobucket',oauth,args,this,this.handleOAuth.bind(this));
    }*/
}

AuthAssistant.prototype.handleOAuth = function(o) {
	 if (o.success) {
    switch(o.service) {
	case 'google':
	    this.authInfo.googleInfo={};
            this.authInfo.googleInfo.token=o.token;
            this.authInfo.googleInfo.secret=o.secret;
			kt.cookies.set("voogle_authInfo", this.authInfo);
	    this.controller.stageController.popScene();
		this.controller.stageController.pushScene("setupWizard3", { authenticated: true,service: o.service });
	    break
	case 'photobucket':
	    this.authInfo.pbInfo={};
            this.authInfo.pbInfo.token=o.token;
            this.authInfo.pbInfo.secret=o.secret;
	    this.controller.stageController.popScene({ authenticated: true,service: o.service });
	    break
    }
	    
    Mojo.Log.info('<<<<<<<Oauth Complete!!!')
    }
    else {
	this.handleError(o);
    }
}


AuthAssistant.prototype.handleError = function(o){
    //Not informative, add a dialog or something appropriate for your app
    Mojo.Log.error('<<<<<<Token Error>>>>>>')
    
}




AuthAssistant.prototype.activate = function(event) {
  // this.controller.listen('authOK',Mojo.Event.tap,this._handleAuthButton)

}


AuthAssistant.prototype.deactivate = function(event) {
  //this.controller.stopListening('authOK',Mojo.Event.tap,this._handleAuthButton)
   

}
