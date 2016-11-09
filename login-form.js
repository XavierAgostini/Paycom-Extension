updateInfo();

$("#loginBtn").click(function() {
	console.log("login");
	// window.location.href = "https://www.paycomonline.net/v4/ee/ee-login.php";
	chrome.tabs.update({url: "https://www.paycomonline.net/v4/ee/ee-login.php"});
})
$("#updateInfo").click(function() {
	$("#infoPage").show();
});
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
		console.log(result.loginInfo);
	});
	// window.location.href = "https://www.paycomonline.net/v4/ee/ee-login.php";
	$("#infoPage").hide();
});



function updateInfo() {
	// User Information
	var loginInfo = {} ;
	chrome.storage.sync.get(["loginInfo"], function(result) {
		loginInfo = JSON.parse(result.loginInfo);
		console.log(result.loginInfo);
		if(loginInfo) {
			console.log("inside");
			var my_username = loginInfo.userID;
			var my_password = loginInfo.userPass;
			var my_pin = loginInfo.userPin;

			$('input[name="userId"]').val(my_username),
			$('input[name="userPass"]').val(my_password),
			$('input[name="userPin"]').val(my_pin) 
		}
	});
	

	
	
}