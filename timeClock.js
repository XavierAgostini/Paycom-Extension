// Get the current browser url
var url = window.location.href;
console.log("url: ", url);
// Paycom URL's for login and timesheet

var login_url = "https://www.paycomonline.net/v4/ee/ee-login.php";
var menu_url = "https://www.paycomonline.net/v4/ee/ee-menu.php";
var timesheet_url = "https://www.paycomonline.net/v4/ee/ee-tawebclock.php?clockid="



var firstLogin = localStorage.getItem("firstLogin") || false;
// If the browser is open to the login url
if(url === login_url) {

	// User Information
	var loginInfo = {};
	chrome.storage.sync.get(["loginInfo"], function(result) {
		loginInfo = JSON.parse(result.loginInfo);
		var my_username = loginInfo.userID;
		var my_password = loginInfo.userPass;
		var my_pin = loginInfo.userPin;

		// Fill in login form with user data
		$("#txtlogin").val(my_username);
		$("#txtpass").val(my_password);
		$("#userpinid").val(my_pin);
		// Submit form
		$("#btnSubmit").click();	
	});

	
} 

// If the browser is open to the timesheet URL
if(url.includes(timesheet_url)) {
	var punchStatus = $(".punchStatus").val();

	// If user is not signed in
	if(punchStatus != "Current Status: IN DAY") {
		$("cmdpunchid").click();
	}
	updateTime();

}
function updateTime() {
	// Get todaay's sign in time
	var timeIn = $(".timeClockTable:first-child .float-right").text();
	// Get current time
	var currTime = moment().format("hh:mm A");
	
	//Add in time worked to be underneath the clock

	var interval = nextInterval(currTime);
	var realTime = realTimeWorked(timeIn, currTime);
	var roundedTime = roundedTimeWorked(timeIn, currTime);

	var updatedClock = '<div class="customClock formGroup centerText" >Total Time Worked:' + realTime +'</div><\
						<div class="customClock formGroup centerText" >Rounded Time Worked: '+ roundedTime +'</div>\
						<div class="customClock formGroup centerText" >Time to next 15 Min Interval: '+ interval +' minutes</div>';
	$("#mywebclock").parent().append(updatedClock);

	var style = { color: "black", fontSize: "25px" };
	$(".customClock").css(style);
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
	var roundedTimeIn = (moment(hours, "HH").add(minutes, "minutes")).format("hh:mm A");
	return roundedTimeIn;
}


function realTimeWorked(timeIn, timeOut) {
	var realIn = moment(timeIn, "hh:mm A");
	var realOut = moment(timeOut, "hh:mm A");
	var timeWorked = moment.utc(moment(timeOut, "hh:mm A").diff(moment(timeIn,"hh:mm A"))).format("hh:mm");
	console.log("real time worked: " + timeWorked);
	return timeWorked;
}
function roundedTimeWorked(timeIn, timeOut) {
	var roundedIn = roundedTime(timeIn);
	var roundedOut = roundedTime(timeOut);
	var roundedTimeWorked = moment.utc(moment(roundedOut, "hh:mm").diff(moment(roundedIn,"hh:mm"))).format("hh:mm");
	console.log("rounded time worked: " + roundedTimeWorked);
	return roundedTimeWorked;
} 

function nextInterval(time) {
	var minutes = 15 - moment(time,"hh:mm A").minutes() % 15;
	console.log("next interval: " + minutes);
	return minutes
}

