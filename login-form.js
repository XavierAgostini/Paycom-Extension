// Load in stored login details
updateInfo();

//start clock
var loginStatus = {};
var myTimer;
// encryption salt
var my_salt = "salty";

// Open up paycom login page
$("#loginBtn").click(function() {
	chrome.tabs.update({url: "https://www.paycomonline.net/v4/ee/ee-login.php"});
});

// Open login details form
$("#updateInfo").click(function() {
	console.log("signedIn")
	dummySignIn();

	$(this).toggleClass("active");
	if($(this).hasClass("active")) {
		$("#infoPage").show();
	} else {
		$("#infoPage").hide();
	}
});

$("#settingsBtn").click(function() {
	console.log("signed out");
	dummySignOut();
	
	console.log('w');
	$(this).toggleClass("active");
	if($(this).hasClass("active")) {
		$("#settingsPage").show();
	} else {
		$("#settingsPage").hide();
	}
	
});

// Redirect to github repository
$("#repoBtn").click(function() {
	chrome.tabs.update({url: "https://github.com/XavierAgostini/Paycom-Extension"});
});

// Store login info on login details form submission
$("#loginInfo").submit(function(e) {
	e.preventDefault();
	var loginDetails = {
		userID: $('input[name="userId"]').val(),
		userPass: $('input[name="userPass"]').val(),
		userPin: $('input[name="userPin"]').val()
	};
	var encryptedDetails =  CryptoJS.AES.encrypt(JSON.stringify(loginDetails), my_salt);
	chrome.storage.sync.set( {"loginInfo": encryptedDetails}, function() {});
	// var loginInfo = {} ;
	// chrome.storage.sync.get(["loginInfo"], function(result) {
	// 	loginInfo = CryptoJS.AES.decrypt(result.loginInfo, "test");
	// 	console.log("info now: ");
	// 	console.log(loginInfo);
	// });
	// $("#infoPage").append("<div>")
	$("#infoPage").hide();
});

// Get stored login info and write it into login details form
function updateInfo() {
	// User Information
	var loginInfo = {} ;
	chrome.storage.sync.get(["loginInfo"], function(result) {
		if(result.loginInfo) {
			loginInfo = JSON.parse(CryptoJS.AES.decrypt(result.loginInfo, my_salt).toString(CryptoJS.enc.Utf8));
			var my_username = loginInfo.userID;
			var my_password = loginInfo.userPass;
			var my_pin = loginInfo.userPin;

			$('input[name="userId"]').val(my_username);
			$('input[name="userPass"]').val(my_password);
			$('input[name="userPin"]').val(my_pin);
		} 

	});	
}

function dummy() {
	chrome.storage.sync.get(["loginStatus"], function(result) {
		if(result.loginStatus) {
			loginStatus = result.loginStatus;
			if(loginStatus.signedIn) {
				//update status to loged in
				updateTime(loginStatus.timeIn);
				//tell clock to start counting
				$("#status").text("In");
			} else {
				//update to status to loged off
				$("#status").text("Out");
				//kill clock
				clearInterval(window.myTimer);
			}
		}
	});
}
function dummySignIn() {
	loginStatus.signedIn = true;
	loginStatus.timeIn = "8:00 AM";
	chrome.storage.sync.set( {"loginStatus": loginStatus}, function() {});
	myTimer = window.setInterval(function() {
		var time = roundedTimeWorked(roundedTime(loginStatus.timeIn), roundedTime(moment().format("hh:mm a")));
		$("#clock").text(time);
	}, 1000);
}

function dummySignOut() {
	loginStatus.signedIn = false;
	loginStatus.timeout = moment().format("hh:mm a");
	chrome.storage.sync.set( {"loginStatus": loginStatus}, function() {});
	window.clearInterval(myTimer);
}


/* Clock funciontality */
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
	console.log("rounded time worked: " + roundedTimeWorked);
	return roundedTimeWorked;
} 