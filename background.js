// chrome.browserAction.onClicked.addListener(function(tab) {
// 	if(window.location.href != "https://www.paycomonline.net/v4/ee/ee-login.php") {
// 		chrome.tabs.update({url: "https://www.paycomonline.net/v4/ee/ee-login.php"});
// 		localStorage.setItem({"firstLogin": true});
// 	}
// });
chrome.browserAction.setIcon({path:"icons/favicon.ico"});

var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
	// only accept messages from ourselves
	if(event.source != window) {
		return;
	}
	if(event.data.type && (event.data.type == "FROM_PAGE")) {
		console.log("content script received: " + event.data.text);
		port.postMessage(event.data.text);
	}
}, false);