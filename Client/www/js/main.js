// TODO LIST
// 
// NOTIFICATIONS MENU
// EMAIL RESET
// 


// -- APP Namespace --------------------
var app = {};

var username, online;

online = false;

(function(){
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
		ui.lowerTab();
	}

	// Triggers every time a page is loaded
	function PageLoad() {
		// Save url
		www.PushCurrentURL();

		// Check backbutton
		ui.CreateBackButton("NavBackButton");

		ui.lowerTab();
		
		www.getPage(location.pathname);
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

	// Public function
	this.removeKey = function() {
		return localStorage.removeItem("__userKey");
	}

	// Public function
	this.writeUsername = function(username) {
		return localStorage.setItem("__username", username);
	}

	// Public function
	this.readUsername = function() {
		return localStorage.getItem("__username");
	}

	// Public function
	this.removeUsername = function() {
		return localStorage.removeItem("__username");
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


	this.getPage = function(pathName) {
		var url = pathName.split("/"),
			url_str = url[url.length-1];

		var urlParams = www.getQueryParams();
		switch(url_str) {
			case "steden.html": ajax.getSteden(0, 5); console.log("Loading landen tips / steden"); break;
			case "stedentips.html": ajax.getStedenTip(); console.log("Loading steden tips"); break;
			case "landen.html": ajax.getLanden(0, 20); console.log("Loading landen data"); break;
			case "landtip.html": ajax.getLandTip(urlParams.tip); console.log("Loading land tip data"); break;
			case "tipmaken.html": ajax.getTipMaken(); console.log("Loading tip maken"); break;
			case "notifications.html": ajax.getNotifications(); console.log("Loading notifications"); break;
		}
	}

	this.getQueryParams = function() {
		qs = document.location.search;
		qs = qs.split('+').join(' ');

	    var params = {},
	        tokens,
	        re = /[?&]?([^=]+)=([^&]*)/g;

	    while (tokens = re.exec(qs)) {
	        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	    }

	    return params;
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
			LoginContainer(storage.readUsername());
		} else {
			LogoutContainer();
		}
	}

	// Private function
 	function LoginContainer(username) {
		var cnt = document.getElementById('modalContainer');

		cnt.innerHTML = `
			<a class="tab-item" href="#modalProfile">
                <span class="icon icon-person"></span>
                <span class="tab-label">` + username + `</span>
            </a>
            <a class="tab-item" href="notifications.html" data-transition="slide-in">
                <span class="icon icon-compose"></span>
                <span class="tab-label">Berichten</span>
            </a>
        `;
        
	}

	// Private function
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

	// Public function
	this.getStars = function(amount) {
		switch (amount) {
			case 0: return "<a class='icon icon-star'></a><a class='icon icon-star'></a><a class='icon icon-star'></a><a class='icon icon-star'></a><a class='icon icon-star'></a>";
			case 1: return "<a class='icon icon-star-filled'></a><a class='icon icon-star'><a class='icon icon-star'></a><a class='icon icon-star'></a><a class='icon icon-star'></a></a>";
			case 2: return "<a class='icon icon-star-filled'></a><a class='icon icon-star-filled'></a><a class='icon icon-star'></a><a class='icon icon-star'></a><a class='icon icon-star'></a>";
			case 3: return "<a class='icon icon-star-filled'></a><a class='icon icon-star-filled'></a><a class='icon icon-star-filled'></a><a class='icon icon-star'></a><a class='icon icon-star'></a>";
			case 4: return "<a class='icon icon-star-filled'></a><a class='icon icon-star-filled'></a><a class='icon icon-star-filled'></a><a class='icon icon-star-filled'></a><a class='icon icon-star'></a>";
			case 5: return "<a class='icon icon-star-filled'></a><a class='icon icon-star-filled'></a><a class='icon icon-star-filled'></a><a class='icon icon-star-filled'></a><a class='icon icon-star-filled'></a>";
			default: return "<a class='icon icon-star'></a><a class='icon icon-star'></a><a class='icon icon-star'></a><a class='icon icon-star'></a><a class='icon icon-star'></a>";
		}
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


	var lastLandID, lastLandTipsID, lastStedenTipsID;


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

					// Write random user key for secure login
					storage.writeKey(obj.key);

					// Write username for UI only
					storage.writeUsername(obj.username);

					// Update the nav bar
					ui.lowerTab();

					deviceIO.Alert("Je bent nu ingelogd", "Melding");

					ajax.AccountValidate();

					//window.location.href = "index.html";
				}else {
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
					
					// Remove the key
					storage.removeKey();

					// Remove the username
					storage.removeUsername();

					// Redirect to index page
					window.location.href = "index.html";
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
					console.log("Je bent nu ingelogd");
					return true;
				}else {
					console.log("Je bent nu uitgelogd");
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
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				if(obj.status === true) {
					// TODOL Login
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


	// Public function
	// Load landen data
	this.getLanden = function(start, limit) {

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/getlanden.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&start=" 	+ start
				+ "&limit="		+ limit,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				// Load the JSON data to the div
				var landenHTML = "<div class=\"landenContainer\">";

				obj.landen.forEach(function(element, index, array) {
					landenHTML += "<li class=\"table-view-cell\">";
					landenHTML += "<a class=\"navigate-right\" href=steden.html?land=" + element.id + " data-transition=\"slide-in\">";
					landenHTML += "<span class=\"badge\">" + element.tips + "</span>";
					landenHTML += element.landnaam + "</a>";
					landenHTML += "</li>";
				});

				landenHTML += "</div>";


				var addLandenButton = `
					<li class="table-view-divider"></li>
					<li class="table-view-cell">
    					<a id=\"ShowMoreCountries\">
     					Toon meer landen
    					</a>
  					</li>
				`;

				console.log("Data toe gevoegd");
				$("#landenContainer").html(landenHTML + addLandenButton);

				// Save last land ID
				lastLandID = start + limit;


				// Click event
				$('#ShowMoreCountries').on('click', function() {
					ajax.addLanden(lastLandID, 20);
				});


			},
			error: function(data) {
				//deviceIO.Alert(data);
				console.log("Error: " + data);
			}
		});
	}

	// Public function
	// Add landen data
	this.addLanden = function(start, limit) {
		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/getlanden.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&start=" 	+ start
				+ "&limit="		+ limit,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);
				// Load the JSON data to the div
				
				if(obj.landen.length == 0) {
					console.log("Alle landen worden getoond");
					deviceIO.Alert("Alle landen worden getoond", "Melding");
				}

				var landenHTML = "";

				obj.landen.forEach(function(element, index, array) {
					landenHTML += "<li class=\"table-view-cell\">";
					landenHTML += "<a class=\"navigate-right\" href=steden.html?land=" + element.id + " data-transition=\"slide-in\">";
					landenHTML += "<span class=\"badge\">" + element.tips + "</span>";
					landenHTML += element.landnaam + "</a>";
					landenHTML += "</li>";
				});

				// Add html to the bottom
				$('.landenContainer').append(landenHTML);


				// Save last land id
				lastLandID = start + limit;
				
			}
		});
	}

	// Public function
	// Load tip data from db
	this.getLandTip = function(tip_id) {
		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/getlandentip.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&tip_id="	+ tip_id,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				console.log(obj.tip);

				// Load the JSON data to the div
				var landenHTML = "<div>";

					landenHTML += "<li class=\"table-view-cell\">";
					landenHTML += "<a>";
					landenHTML += "<h3>" + obj.tip.title + "</h3>";
					landenHTML += "<h6>" + obj.tip.poster + "</h6>";
					landenHTML += obj.tip.post + "</a>";
					landenHTML += "</li>";
					if(obj.status == true) {
						landenHTML += "<label for=\"rate\" id=\"rateLabel\">" + ui.getStars(parseInt(obj.tip.rating / 10)) + "</label>";
						landenHTML += "<select id=\"rate\" onchange=\"ajax.rateLandTip(this.value)\"><option disabled selected>Keis een rating</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>";
					} else {//ajax.rateLandTip(obj.tip.id, this.value);
						landenHTML += "<label>" + ui.getStars(parseInt(obj.tip.rating / 10)) + "</label>";
					}	
					// Voeg poster toe
				landenHTML += "</div>";


				console.log("Data toe gevoegd");
				$("#tipsContainer").html(landenHTML);


			},
			error: function(data) {
				//deviceIO.Alert(data);
				console.log("Error: " + data);
			}
		});
	}

	this.rateLandTip = function(value) {

		var urlParams = www.getQueryParams();

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/ratelanden.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&tip_id="	+ urlParams.tip
				+ "&value="		+ value,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				console.log(obj);

				if(obj.succes == true) {
					console.log("Rating is toegevoegd");
					deviceIO.Alert("Rating is toegevoegd", "Melding");
				} else {
					deviceIO.Alert("Rating is niet toegevoegd", "Melding");
				}

			}
		});
	}

	this.getSteden = function(start, limit) {

		var params = www.getQueryParams();

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/getlandentips.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&start=" 	+ start
				+ "&limit="		+ limit
				+ "&land_id=" 	+ params.land,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				console.log(obj);

				// Load the JSON data to the div
				var landenHTML = "<div class=\"landenContainer\">";

				obj.tips.forEach(function(element, index, array) {
					landenHTML += "<li class=\"table-view-cell\">";
					landenHTML += "<a class=\"navigate-right\" href=landtip.html?tip=" + element.id + " data-transition=\"slide-in\">";
					landenHTML += "<h3>" + element.title + "</h3>";
					landenHTML += element.post + "</br>Rating: " + element.rating + "</a>";
					landenHTML += "</li>";
				});

				landenHTML += "</div>";


				var addLandenButton = `
					<li class="table-view-divider"></li>
					<li class="table-view-cell">
    					<a id=\"ShowMoreCountriesTips\">
     					Toon meer tips
    					</a>
  					</li>
				`;

				console.log("Data toe gevoegd");
				$("#landenContainer").html(landenHTML + addLandenButton);

				// Save last land ID
				lastLandTipsID = start + limit;


				// Click event
				$('#ShowMoreCountriesTips').on('click', function() {
					ajax.addStedenTips(lastLandTipsID, 20);
				});


			},
			error: function(data) {
				//deviceIO.Alert(data);
				console.log("Error: " + data);
			}
		});


		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/getsteden.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&start=" 	+ start
				+ "&limit="		+ limit
				+ "&land_id="		+ params.land,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				console.log(obj);

				// Load the JSON data to the div
				var landenHTML = "<div class=\"stedenContainer\">";

				obj.steden.forEach(function(element, index, array) {
					landenHTML += "<li class=\"table-view-cell\">";
					landenHTML += "<a class=\"navigate-right\" href=\"stedentips.html?naam=" + element.stadnaam + "&land=" + params.land + "\"data-transition=\"slide-in\">";
					landenHTML += element.stadnaam  + "</a>";
					landenHTML += "</li>";
				});

				landenHTML += "</div>";


				var addLandenButton = `
					<li class="table-view-divider"></li>
					<li class="table-view-cell">
    					<a id=\"ShowMoreSteden\">
     					Toon meer steden
    					</a>
  					</li>
				`;

				console.log("Data toe gevoegd");
				$("#stedenContainer").html(landenHTML + addLandenButton);

				// Save last land ID
				lastStedenTipsID = start + limit;


				// Click event
				$('#ShowMoreSteden').on('click', function() {
					ajax.addSteden(lastStedenTipsID, 20);
				});


			},
			error: function(data) {
				//deviceIO.Alert(data);
				console.log("Error: " + data);
			}
		});
	}

	this.addSteden = function(start, limit) {

		var params = www.getQueryParams();

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/getsteden.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&start=" 	+ start
				+ "&limit="		+ limit
				+ "&land_id="	+ params.land,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				console.log(obj);

				// Load the JSON data to the div
				var landenHTML = "";

				obj.steden.forEach(function(element, index, array) {
					landenHTML += "<li class=\"table-view-cell\">";
					landenHTML += "<a class=\"navigate-right\" href=\"stedentips.html?naam=" + element.stadnaam + "&land=" + params.land + "\"data-transition=\"slide-in\">";
					landenHTML += element.stadnaam  + "</a>";
					landenHTML += "</li>";
				});

				$(".stedenContainer").append(landenHTML);

				console.log("Data toe gevoegd");

				// Save last land ID
				lastStedenTipsID = start + limit;

			},
			error: function(data) {
				//deviceIO.Alert(data);
				console.log("Error: " + data);
			}
		});
	}

	this.getStedenTip = function() {

		var params = www.getQueryParams();

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/getstedentips.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&naam="		+ params.naam
				+ "&land="		+ params.land,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				console.log(obj);

				
				// Load the JSON data to the div
				var stedenHTML = "<div>";

				obj.tips.forEach(function(element, index, array){

					stedenHTML += "<li class=\"table-view-cell\">";
					stedenHTML += "<a>";
					stedenHTML += "<h3>" + element.title + "</h3>";
					stedenHTML += "<h6>" + element.poster + "</h6>";
					stedenHTML += element.post + "</a>";
					stedenHTML += "</li>";
					if(obj.status == true) {
						stedenHTML += "<label for=\"rate\" id=\"rateLabel\">" + ui.getStars(parseInt(element.rating / 10)) + "</label>";
						stedenHTML += "<select id=\"rate\" onchange=\"ajax.rateStadTip(this.value, " + element.id + ")\"><option disabled selected>Keis een rating</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>";
					} else {//ajax.rateLandTip(element.id, this.value);
						stedenHTML += "<label>" + ui.getStars(parseInt(element.rating / 10)) + "</label>";
					}
					stedenHTML += "<li class=\"table-view-divider\"></li>";

				});
					// Voeg poster toe
				stedenHTML += "</div>";


				console.log("Data toe gevoegd");
				$("#stedenContainer").html(stedenHTML);
				

			},
			error: function(data) {
				//deviceIO.Alert(data);
				console.log("Error: " + data);
			}
		});
	}

	this.rateStadTip = function(value, id) {

		alert(value);

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/ratesteden.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&tip_id="	+ id
				+ "&value="		+ value,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				console.log(obj);

				if(obj.succes == true) {
					console.log("Rating is toegevoegd");
					deviceIO.Alert("Rating is toegevoegd", "Melding");
				} else {
					deviceIO.Alert("Rating is niet toegevoegd", "Melding");
				}

			}
		});

	}

 	this.addStedenTips = function(start, limit) {
		var params = www.getQueryParams();

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/getlandentips.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&start=" 	+ start
				+ "&limit="		+ limit
				+ "&land_id=" 	+ params.land,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);

				console.log(obj);

				if(obj.tips.length == 0) {
					console.log("Alle tips worden getoond");
					deviceIO.Alert("Alle tips worden getoond", "Melding");
				}

				// Load the JSON data to the div
				var landenHTML = "<div class=\"landenContainer\">";

				obj.tips.forEach(function(element, index, array) {
					landenHTML += "<li class=\"table-view-cell\">";
					landenHTML += "<a class=\"navigate-right\" href=landtip.html?tip=" + element.id + " data-transition=\"slide-in\">";
					landenHTML += "<h3>" + element.title + "</h3>";
					landenHTML += element.post + "</br>Rating: " + element.rating + "</a>";
					landenHTML += "</li>";
				});

				landenHTML += "</div>";

				console.log("Data toe gevoegd");
				$(".landenContainer").append(landenHTML);

				// Save last land ID
				lastLandTipsID = start + limit;
			}
		});
	}


	this.getTipMaken = function() {

		// Add listener for change
		$("#stadtoggle").on('click', function(){

			if(!$("#stadtoggle").hasClass("active")) {
				$("#stadnaam").hide();
			} else {
				$("#stadnaam").show()
			}
		});


		$("#sendForm").click(function(evt){
			evt.preventDefault();
			ajax.TipMaken();
		});

		// Get landen from the db
		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/getlanden.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&start=" 	+ 0
				+ "&limit="		+ 300,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);
				// Load the JSON data to the div
				
				var landenHTML = "";

				obj.landen.forEach(function(element, index, array) {
					landenHTML += "<option value=\"" + element.id + "\">";
					landenHTML += element.landnaam;
					landenHTML += "</option>";
				});

				// Add html to the bottom
				$('#tipsForm #landen').append(landenHTML);
			}
		});
	}

	this.TipMaken = function() {
		if(storage.readKey() === null) {
			console.log("Je moet ingelogd zijn om een tip te maken");
			deviceIO.Alert("Je moet ingelogd zijn om een tip te maken", "Melding");
			return;
		}


		var land = $("#landen").val(),
			stadtoggle = $("#stadtoggle").hasClass("active"),
			stadnaam = $("input#stadnaam").val(),
			title = $("input#title").val(),
			post = $("textarea#post").val();


		alert(stadnaam);

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/newtip.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&title=" 	+ title
				+ "&post="		+ post
				+ "&land="		+ land
				+ "&toggle="	+ stadtoggle
				+ "&stadnaam="	+ stadnaam,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);
				
				console.log(obj);
			}
		});
	}

	this.tipZoeken = function(keyword) {

		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/zoeken.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey()
				+ "&keyword="	+ keyword,
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);
				
				console.log(obj);

				var zoekenHTML = "";

				obj.tips.forEach(function(element, index, array) {
					console.log(element.title);

					zoekenHTML += "<li class=\"table-view-cell\">";
					zoekenHTML += "<h3>" + element.title + "</h3>";
					zoekenHTML += "<h6>" + element.land;
					(element.stadnaam != null) ? zoekenHTML += " - " + element.stadnaam + "</h6>" : zoekenHTML += "</h6>";
					zoekenHTML += element.post;
					zoekenHTML += "</br><label>" + ui.getStars(parseInt(element.rating / 10)) + "</label>";
					zoekenHTML += "</li>";
				});

				$("#zoekContainer").html(zoekenHTML);
			}
		});
	}

	this.AccountValidate = function() {
		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/accountvalidate.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey(),
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);
				
				console.log(obj);

				if(obj.status != "activated") {
					deviceIO.Alert("Uw account is nog niet geregisteerd! \n activeer uw account via de mail en probeer het opnieuw!", "Bericht", "Ok", null);
					ajax.AccountValidate();
				} else {
					window.location.href = "index.html";
				}
			}
		});
	}

	this.getNotifications = function() {
		$.ajax({
			url: "http://ap24-17.ict-lab.nl/mobile/getnotifications.php",
			data: "uuid=" 		+ device.uuid
				+ "&key=" 		+ storage.readKey(),
			type: "POST",
			dataType: "text",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			success: function(data) {
				var obj = JSON && JSON.parse(data) || $.parseJSON(data);
				
				console.log(obj);

				var notificationsHTML = "";

				if(obj.notifications.length === 0) {
					notificationsHTML += "<li class=\"table-view-cell\">";
					notificationsHTML += "Oh oh, er zijn hier geen notifications";
					notificationsHTML += "</li>";
				}

				obj.notifications.forEach(function(element, index, array) {
					notificationsHTML += "<li class=\"table-view-cell\">";
					notificationsHTML += element.post;
					notificationsHTML += "</li>";
				});

				$("#notificationsContainer").html(notificationsHTML);
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