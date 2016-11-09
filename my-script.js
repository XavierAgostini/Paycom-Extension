// Get the current browser url
var url = window.location.href;
console.log("url: ", url);
// Paycom URL's for login and timesheet

var login_url = "https://www.paycomonline.net/v4/ee/ee-login.php";
var menu_url = "https://www.paycomonline.net/v4/ee/ee-menu.php";
var timesheet_url = "https://www.paycomonline.net/v4/ee/ee-tawebclock.php?clockid=SALES"



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
	var currTime = getTime();
	// Determine the number of hours worked
	var diff = moment.utc(moment(currTime,"HH:mm a").diff(moment(timeIn,"HH:mm a"))).format("HH:mm");
	var minutes = moment.utc(moment(currTime,"HH:mm a").diff(moment(timeIn,"HH:mm a"))).format("mm")
	// console.log("time in: " + timeIn + ", curr time: " + currTime+", diff: " + diff	);
	//Add in time worked to be underneath the clock

	var interval = timeInterval(minutes);
	var roundedTime = moment(diff, "HH").add(interval.closerInterval, "minutes").format("HH:mm");
	console.log("hour: " + moment(diff, "HH") + ", minutes: " + moment((interval.closerInterval).toString(), "mm") + ", interval: " + interval.closerInterval);
	var updatedClock = '<div class="customClock formGroup centerText" >Total Time Worked:' + diff +'</div><\
						<div class="customClock formGroup centerText" >Rounded Time Worked: '+ roundedTime +'</div>\
						<div class="customClock formGroup centerText" >Time to next 15 Min Interval: '+ interval.nextInterval +'</div>';
	$("#mywebclock").parent().append(updatedClock);

	var style = { color: "black", fontSize: "25px" };
	$(".customClock").css(style);
}
// Get Current time in Hours: Minutes AM/PM Format
function getTime() {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

function timeInterval(time) {
	var interval = time%15;
	var closerInterval = interval > 7 ? time - interval + 15 : time - interval;
	var nextInterval = interval > 7 ? 15 - interval + 8 : 7 - interval 
	return {closerInterval, nextInterval};
}