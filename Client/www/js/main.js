// -- APP Namespace --------------------
var app = {};

(function(){
	var online = false;

	// Public function to load the app and check the connection
	this.initialize = function() {
		document.addEventListener('deviceready', DeviceReady, false);
		document.addEventListener('offline', DeviceOffline, false);
		document.addEventListener('online', DeviceOnline, false);
		window.addEventListener('push', PageLoad, false);
	}

	// Private function to see if the app is connected
	function DeviceOffline() {
		alert("Please check your internet connection");
		online = false;
	}

	// Private function to see if the app is connected
	function DeviceOnline() {
		online = true;
	}

	// Triggers is the device has loaded the app contents (After splash screen)
	function DeviceReady() {
		StatusBar.styleLightContent();
		
	}

	// Triggers every time a page is loaded
	function PageLoad() {
		// Save url
		www.PushCurrentURL();

		// Check backbutton
		ui.CreateBackButton("NavBackButton");

		//console.log(JSON.parse(ajax.ValidateKey().responseText).status);

		//ui.lowerTab();
	}

}).apply(app);

// -- STORAGE Namespace ----------------
var storage = {};
(function(){

	// Public function
	this.write = function(item, data) {
		return localStorage.setItem(item, data);
	}

	// Public function
	this.read = function(item) {
		return localStorage.getItem(item);
	}

	// Public function
	this.writeKey = function(key) {
		return localStorage.setItem("__userKey", key);
	}

	// Public function
	this.readKey = function() {
		return localStorage.getItem("__userKey");
	}

}).apply(storage); 

// -- WWW Namespace --------------------
var www = {};
(function(){
	var lastPage = ["index.html"];

	// Public function
	this.PushCurrentURL = function() {
		// Check and cut length of the history stack
		if(lastPage.length > 10)
			lastPage.splice(0, lastPage.length - 10);

		// Push target url to the history stack
		lastPage.push(window.location.href);
	}

	// Public function
	this.PushURL = function() {
		var url = arguments[0];

		// Check and cut length of the history stack
		if(lastPage.length > 10)
			lastPage.splice(0, lastPage.length - 10);

		// Push target url to the history stack
		lastPage.push(url);
	}

	// Public function
	// Return: Page URL
	this.GetLastURL = function() {
		return lastPage[lastPage.length - 2];
	}

	// Public function
	// Return: Page Array
	this.GetStack = function() {
		return lastPage;
	}

	// Public function
	this.RemoveLastURL = function() {
		if(lastPage.length > 2){
			lastPage.splice(lastPage.length - 2, 2);
		}else{
			lastPage.splice(lastPage.length - 2, 2);
			lastPage.push("index.html");
		}
	}

}).apply(www);

// -- UI Namespace --------------------
var ui = {};
(function(){

	// Public function
	// Argument : String of ID
	this.CreateBackButton = function() {
		var elem = document.getElementById(arguments[0]);

		if(elem != null){
			elem.addEventListener('touchstart', ClickBackButton);
			elem.href = www.GetLastURL();
		}
	}

	// Private function
	function ClickBackButton() {
		www.RemoveLastURL();
		return true;
	}

	// Public function
	this.lowerTab = function() {
		if(JSON.parse(ajax.ValidateKey().responseText).status == true) {
			LoginContainer();
		} else {
			LogoutContainer();
		}
	}

	// Public function
 	function LoginContainer() {
		var cnt = document.getElementById('modalContainer');

		cnt.innerHTML = `
			<a class="tab-item" href="#modalLogin">
                <span class="icon icon-person"></span>
                <span class="tab-label">Aad</span>
            </a>
            <a class="tab-item" href="#modalRegister">
                <span class="icon icon-compose"></span>
                <span class="tab-label">is cool</span>
            </a>
        `;
        
	}

	// Public function
	function LogoutContainer() {
		var cnt = document.getElementById('modalContainer');

		cnt.innerHTML = `
            <a class="tab-item" href="#modalLogin">
                <span class="icon icon-person"></span>
                <span class="tab-label">Login</span>
            </a>
            <a class="tab-item" href="#modalRegister">
                <span class="icon icon-compose"></span>
                <span class="tab-label">Registreer</span>
            </a>
        `;
        
	}

}).apply(ui);


// -- UI Namespace --------------------
var deviceIO = {};
(function(){

	// Public function
	// Argument : Message (String), Title (String), Buttonname (String), Invoke (Callback method)
	this.Alert = function() {

		var msg = 		 (typeof arguments[0] != 'undefined') ? arguments[0] : "";
		var title = 	 (typeof arguments[1] != 'undefined') ? arguments[1] : "Alert";
		var buttonName = (typeof arguments[2] != 'undefined') ? arguments[2] : "Ok";
		var invoke =	 (typeof arguments[3] != 'undefined') ? arguments[3] : null;
		// TODO: Verander Oke naar iets beters
		navigator.notification.alert(msg, invoke, title, buttonName);
	}

	// Public function
	this.Vibrate = function() {
		// Vibrate phone
		navigator.notification.vibrate(2500);
	}

	// Public function
	// Let the phone beep
	this.Beep = function() {
		var amount = (typeof arguments[0] != 'undefined') ? arguments[0] : 1;
		navigator.notification.beep(amount);
	}

	// Public function
	// Argument : Message (String), Placeholder (String), Title (String), Buttonname (Array), Invoke (Callback method)
	this.Prompt = function() {
		var msg = 		 (typeof arguments[0] != 'undefined') ? arguments[0] : "";
		var defaultText= (typeof arguments[1] != 'undefined') ? arguments[1] : "placeholder";
		var title = 	 (typeof arguments[2] != 'undefined') ? arguments[2] : "Alert";
		var buttonName = (typeof arguments[3] != 'undefined') ? arguments[3] : ["Cancel", "Oke"];
		var invoke =	 (typeof arguments[4] != 'undefined') ? arguments[4] : null;

		return navigator.notification.prompt(msg, invoke, title, buttonName, defaultText);
	}

}).apply(deviceIO);


// -- AJAX Namespace --------------------
var ajax = {};
(function(){
	var userlogin = false;

	// Public login
	// Let the user login
	this.UserLogin = function() {
		var username = arguments[0],
		 	password = arguments[1];

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/login.php",
			data: "username=" 	+ username 
				+ "&password=" 	+ password
				+ "&uuid=" 		+ device.uuid,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				console.log("Data: " + data);
				obj = JSON.parse(data);
				
				if(obj.status == true) {
					userlogin = true;
					storage.writeKey(obj.key);
					deviceIO.Alert("Je bent nu ingelogd", "Melding");
				}else {
					userlogin = false;
					deviceIO.Alert("Er ging iets fout, probeer het opnieuw", "Melding");
				}
			},
			error: function(data) {
				deviceIO.Alert("Probeer het zo meteen opnieuw!", "Oh nee! Een error!");
			}
		}); 
	}

	// Public function
	// Remove the user data from devices db
	this.UserLogout = function() {


		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/removekey.php",
			data: "uuid=" 	+ device.uuid 
				+ "&key=" 	+ storage.readKey(),
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				obj = JSON.parse(data);
				if(obj.status == true) {
					userlogin = false;
					deviceIO.Alert("Je bent nu uitgelogd", "Melding");
				}else {
					userlogin = false;
					deviceIO.Alert("Er ging iets fout, probeer het opnieuw", "Melding");
				}
			},
			error: function(data) {
				console.log("Error: " + data);
				deviceIO.Alert("Probeer het zo meteen opnieuw!", "Oh nee! Een error!");
			}
		});
	}

	// Public function
	// Check if the user is logged in on device key
	this.ValidateKey = function() {
		

		return $.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/validatekey.php",
			data: "uuid=" 	+ device.uuid 
				+ "&key=" 	+ storage.readKey(),
			type: "POST",
			async: false,
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				//deviceIO.Alert(data, "Login bericht");

				obj = JSON.parse(data);
				if(obj.status == true) {
					//console.log(obj);
					console.log("Je bent nu ingelogd");
					//deviceIO.Alert("Je bent nu ingelogd", "Melding");
					return true;
				}else {
					console.log("Je bent nu uitgelogd");
					//deviceIO.Alert("Je bent nu uitgelogd", "Melding");
					return false;
				}
			},
			error: function(data) {
				console.log("Error: " + data);
				deviceIO.Alert("Probeer het zo meteen opnieuw!", "Oh nee! Een error!");
				return false;
			}
		});
	}

	// Public function
	// Let the user register
	// Arg : Email (string), Username (string), Password (string)
	this.UserRegister = function() {
		var email 		= arguments[0];
		var username 	= arguments[1];
		var password 	= arguments[2];

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/register.php",
			data: "email=" 		+ email
				+ "&username=" 	+ username
				+ "&password=" 	+ password
				+ "&uuid="		+ device.uuid,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				//deviceIO.Alert(data, "???");
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				if(obj.status === true) {
					// Login
				}else{
					// Error
					console.log(obj.msg);
					deviceIO.Alert(obj.msg, "Melding");
				}

			},
			error: function(data) {
				//deviceIO.Alert(data);
				console.log("Error: " + data);
			}
		});	
	}

}).apply(ajax);

var formVal = {};
(function(){

	// Public function
	// Arg: Register form
	this.ValidateRegister = function() {

		var form = arguments[0];
		var email 		= form.email.value;
		var username 	= form.username.value;
		var password 	= form.password.value;
		var errors = [];
		var errorsTxt = "";


		if(!validateEmail(email))
			errors.push("Ongeldig email adres");
		
		if(username.length <= 3)
			errors.push("De gebruikersnaam is te kort");

		if(password.length <= 6)
			errors.push("Het wachtwoord is te kort");

		if(!containsNumber(password))
			errors.push("Het wachtwoord heeft geen cijfer");

		if(errors.length == 0) {
			// Do an ajax request to the server to register an new account
			ajax.UserRegister(email, username, password);

		}else {
			// Show errors
			// Foreach to make the error message if there is one
			errors.forEach(function(element, index, array) {
				errorsTxt += element + "\n";
			});
			console.log(errorsTxt);
			deviceIO.Alert(errorsTxt, "Melding");
		}
	}

	// Public function
	// Validates login modal
	this.ValidateLogin = function() {
		var form = arguments[0];
		var username = form.username.value;
		var password = form.password.value;

		if(username.length <= 3)
			errors.push("De gebruikersnaam is ongeldig");

		if(password.length <= 6)
			errors.push("Het wachtwoord is ongeldig");


		ajax.UserLogin(username, password);
	}


	// Private function
	// Validate the email
	function validateEmail(email) {
    	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	}

	// Private function
	// Validate of the string contains a number
	function containsNumber(str) {
		var re = /\d/;
		return re.test(str);
	} 
	
}).apply(formVal);

// EOF