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

$("#punchinForm").submit(function(e) {
	e.preventDefault();
	var timeIn = $('input[name="timeIn"]').val();
	loginStatus = {
    	signedIn: true,
    	timeIn: moment(timeIn, "hh:mm a").format("hh:mm a"),
    	timeOut: ""
    };
	chrome.storage.sync.set( {"loginStatus": JSON.stringify(loginStatus)}, function() {});
	updateClockPage();
});

$("#punchoutForm").submit(function(e) {
	e.preventDefault();
	var timeOut = $('input[name="timeOut"]').val();
	chrome.storage.sync.get(["loginStatus"], function(result) {
		if(result.loginStatus) {
			loginStatus = JSON.parse(result.loginStatus);
			loginStatus.signedIn = false;
			loginStatus.timeOut = moment(timeOut, "hh:mm a").format("hh:mm a");
			chrome.storage.sync.set( {"loginStatus": JSON.stringify(loginStatus)}, function() {});
			updateClockPage();
		}
	});
	
});

$('input[type="checkbox"]').on('change', function() {
	updateSettings();
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
				$("#clock").show();
			} else {
				$("#clock").hide();
			}
			
		}
	});	
}

function updateSettings() {
	var switchStates = {};
	$('.switch input[type="checkbox').each(function() {
		var id = "#" + $(this).attr('id');
		var state = $(this).is(":checked");
		switchStates[id] = state;
		if (id == "#showClockSwitch") {
			if(state) $("#clock").hide();
			else $("#clock").show();
		}
		if (id == "#showManualSwitch") {
			if (state) {
				$("#punch").hide();
				$("#punch").hide();
			} else {
				$("#punch").show();
				$("#punch").show();
			}
		}
	});
	chrome.storage.sync.set( {"appSettings": JSON.stringify(switchStates)}, function() {});
}

// Message listener for communication between popup and content script
chrome.runtime.onMessage.addListener(
  function(request) {
    if(request.updateStatus) {
    	var state = request.updateStatus;
    	updateClockPage();
    }
 });

function updateClockPage() {
	chrome.storage.sync.get(["loginStatus"], function(result) {
		if(result.loginStatus) {
			loginStatus = JSON.parse(result.loginStatus);
			
			var logedIn = loginStatus.signedIn ? "In" : "Out";
			var timeIn = loginStatus.signedIn ? loginStatus.timeIn : "N/A";
			var timeOut = loginStatus.timeOut == "" ? moment().format("hh:mm A") : loginStatus.timeOut;
			
			var roundedTime = loginStatus.signedIn ? roundedTimeWorked(timeIn, timeOut) : "N/A";
			var realTime = loginStatus.signedIn ? realTimeWorked(timeIn, timeOut) : "N/A";
			var interval = loginStatus.signedIn ? nextInterval() : "N/A";
			
			$("#timeClock").text(roundedTime);
			$("#loginStatus").text(logedIn);
			$("#timeIn").text(timeIn);
			$("#exactTime").text(realTime);
			$("#roundedTime").text(roundedTime);
			$("#nextInterval").text(interval);

			if (loginStatus.signedIn) {
				$("#punchinArea").hide();
				$("#punchoutArea").show();
			} else {
				$("#punchinArea").show();	
				$("#punchoutArea").hide();
			}
		}
	});
}

/* Clock funciontality */

function realTimeWorked(timeIn, timeOut) {
	var timeWorked = moment.utc(moment(timeOut, "hh:mm A").diff(moment(timeIn,"hh:mm A"))).format("HH:mm");
	return timeWorked;
}

function nextInterval() {
	var minutes = moment().minutes() % 15;
	var interval = minutes <= 5 ? 6 - minutes : 15 - minutes + 6;
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
function nextT(time) {
	var minutes = moment(time, "hh:mm A").minutes() % 15;
	var interval = minutes <= 5 ? 6 - minutes : 15 - minutes + 6;
	return interval
}