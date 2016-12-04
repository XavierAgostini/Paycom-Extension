// Load in stored login details
updateInfo();

// Update clock page on popup open
updateClockPage();

// encryption salt
var my_salt = "salty";

//start clock
var loginStatus = {};



// Open up paycom login page
$("#loginBtn").click(function() {
	chrome.tabs.update({url: "https://www.paycomonline.net/v4/ee/ee-login.php"});
});

// Open login details form
$("#timeBtn").click(function() {
	$('.page').hide();
	$("#settingsBtn").removeClass("active");
	$(this).toggleClass("active");
	if($(this).hasClass("active")) {
		$("#timePage").show();
	}
});

$("#settingsBtn").click(function() {
	$('.page').hide();
	$("#timeBtn").removeClass("active");
	$(this).toggleClass("active");
	if($(this).hasClass("active")) {
		$("#settingsPage").show();
	}
});

// Redirect to github repository
$("#repoBtn").click(function() {
	chrome.tabs.update({url: "https://github.com/XavierAgostini/Paycom-Extension"});
});

// Store login info on login details form submission
$("#loginForm").submit(function(e) {
	e.preventDefault();
	var loginDetails = {
		userID: $('input[name="userId"]').val(),
		userPass: $('input[name="userPass"]').val(),
		userPin: $('input[name="userPin"]').val()
	};
	var encryptedDetails =  CryptoJS.AES.encrypt(JSON.stringify(loginDetails), my_salt);
	chrome.storage.sync.set( {"loginInfo": encryptedDetails}, function() {});

	$("#updateAlert").fadeIn();

	setTimeout(function() {
		$("#updateAlert").fadeOut(800);
	}, 500);
});

$('input[type="checkbox"]').on('change', function() {
	var switchStates = {};
	$('.switch input[type="checkbox').each(function() {
		var id = "#" + $(this).attr('id');
		var state = $(this).is(":checked");
		switchStates[id] = state;
		if(id == "#showClockSwitch") {
			if(state) $("#clock").hide();
			else $("#clock").show();
		}
	});
	chrome.storage.sync.set( {"appSettings": JSON.stringify(switchStates)}, function() {});

});

$("#sourceCode a").click(function() {
	chrome.tabs.update({url: "https://github.com/XavierAgostini/Paycom-Extension"});
});
// Get stored login info and write it into login details form
function updateInfo() {
	// User Information
	var loginInfo = {};
	var appSettings = {};
	var loginStatus = {};
	chrome.storage.sync.get(["loginInfo", "appSettings"], function(result) {
		// update login info into login info form
		if(result.loginInfo) {
			loginInfo = JSON.parse(CryptoJS.AES.decrypt(result.loginInfo, my_salt).toString(CryptoJS.enc.Utf8));
			var my_username = loginInfo.userID;
			var my_password = loginInfo.userPass;
			var my_pin = loginInfo.userPin;

			$('input[name="userId"]').val(my_username);
			$('input[name="userPass"]').val(my_password);
			$('input[name="userPin"]').val(my_pin);
		}
		// update app settings 
		if(result.appSettings) {
			appSettings = JSON.parse(result.appSettings);
			// console.log(appSettings);
			for(var setting in appSettings)	{
				$(setting).attr("checked", appSettings[setting]);
			}
			if(!appSettings["#showClockSwitch"]) {
				console.log('working');
				$("#clock").show();
			} else {
				$("#clock").hide();
			}
		}
	});	
}

// Message listener for communication between popup and content script
chrome.runtime.onMessage.addListener(
  function(request) {
    if(request.updateStatus) {
    	var state = request.updateStatus;
    	//do something
    	console.log("state: " + state);
    	if(state === "signed in") {
			dummySignIn();
    	} else if(state === "signed out") {
			dummySignOut();
    	}
    	updateClockPage();
    }
   
 });

function updateClockPage() {
	chrome.storage.sync.get(["loginStatus"], function(result) {
		if(result.loginStatus) {
			loginStatus = JSON.parse(result.loginStatus);
			
			var logedIn = loginStatus.signedIn ? "In" : "Out";
			var timeIn = loginStatus.timeIn;
			var timeOut = loginStatus.timeOut == "" ? moment().format("hh:mm A") : loginStatus.timeOut;
			
			var roundedTime = roundedTimeWorked(timeIn, timeOut);
			var realTime = realTimeWorked(timeIn, timeOut);
			var interval = loginStatus.signedIn ? nextInterval() : "N/A";
			
			$("#timeClock").text(roundedTime);
			$("#loginStatus").text(logedIn);
			$("#timeIn").text(timeIn);
			$("#exactTime").text(realTime);
			$("#roundedTime").text(roundedTime);
			$("#nextInterval").text(interval);


			
		}
	});
}


function dummySignIn() {

	loginStatus.signedIn = true;
	loginStatus.timeIn = "8:00 AM";
	loginStatus.timeOut = "";
	chrome.storage.sync.set( {"loginStatus": JSON.stringify(loginStatus)}, function() {});
	

}

function dummySignOut() {
	loginStatus.signedIn = false;
	loginStatus.timeIn = "8:00 AM";
	loginStatus.timeOut = moment().format("hh:mm a");
	chrome.storage.sync.set( {"loginStatus": JSON.stringify(loginStatus)}, function() {});

}


/* Clock funciontality */

function realTimeWorked(timeIn, timeOut) {
	var timeWorked = moment.utc(moment(timeOut, "hh:mm A").diff(moment(timeIn,"hh:mm A"))).format("HH:mm");
	return timeWorked;
}

function nextInterval() {
	var minutes = moment().format("hh:mm A").minutes() % 15;
	var interval = minutes < 5 ? 5 - minutes : 15 - minutes;
	console.log("next interval: " + minutes);
	return interval
}

function roundedTime(time) {
	var hours = moment(time,"hh:mm A").format("HH");
	var minutes = moment(time,"hh:mm A").minutes();
	var baseMins = Math.floor(minutes/15)*15;
	var interval = minutes%15;

	if(interval <= 5) {
		minutes = baseMins;
	} else {
		minutes = baseMins + 15;
	}
	var roundedTime = (moment(hours, "HH").add(minutes, "minutes")).format("hh:mm A");
	return roundedTime;
}

function roundedTimeWorked(timeIn, timeOut) {
	var realIn = roundedTime(timeIn);
	var realOut = roundedTime(timeOut)
	var roundedTimeWorked = moment.utc(moment(realOut, "hh:mm A").diff(moment(realIn,"hh:mm A"))).format("HH:mm");
	return roundedTimeWorked;
} 