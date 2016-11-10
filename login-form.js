// Load in stored login details
updateInfo();

// Open up paycom login page
$("#loginBtn").click(function() {
	chrome.tabs.update({url: "https://www.paycomonline.net/v4/ee/ee-login.php"});
});

// Open login details form
$("#updateInfo").click(function() {
	$(this).toggleClass("active");
	if($(this).hasClass("active")) {
		$("#infoPage").show();
	} else {
		$("#infoPage").hide();
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
	chrome.storage.sync.set( {"loginInfo": JSON.stringify(loginDetails)}, function() {});
	var loginInfo = {} ;
	chrome.storage.sync.get(["loginInfo"], function(result) {
		loginInfo = result.loginInfo;
	});
	$("#infoPage").hide();
});

// Get stored login info and write it into login details form
function updateInfo() {
	// User Information
	var loginInfo = {} ;
	chrome.storage.sync.get(["loginInfo"], function(result) {
		if(result.loginInfo) {
			loginInfo = JSON.parse(result.loginInfo);
			var my_username = loginInfo.userID;
			var my_password = loginInfo.userPass;
			var my_pin = loginInfo.userPin;

			$('input[name="userId"]').val(my_username);
			$('input[name="userPass"]').val(my_password);
			$('input[name="userPin"]').val(my_pin);
		} 

	});	
}