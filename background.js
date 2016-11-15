// chrome.browserAction.onClicked.addListener(function(tab) {
// 	if(window.location.href != "https://www.paycomonline.net/v4/ee/ee-login.php") {
// 		chrome.tabs.update({url: "https://www.paycomonline.net/v4/ee/ee-login.php"});
// 		localStorage.setItem({"firstLogin": true});
// 	}
// });
chrome.browserAction.setIcon({path:"icons/favicon.ico"});