// chrome.browserAction.onClicked.addListener(function(tab) {
// 	if(window.location.href != "https://www.paycomonline.net/v4/ee/ee-login.php") {
// 		chrome.tabs.update({url: "https://www.paycomonline.net/v4/ee/ee-login.php"});
// 		localStorage.setItem({"firstLogin": true});
// 	}
// });
chrome.browserAction.setIcon({path:"icons/favicon.ico"});

// var port = chrome.runtime.connect({name: "background"});
console.log('b');
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	console.log('test');
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     if (request.greeting == "hello")
//       sendResponse({farewell: "goodbye"});
//   });

// window.addEventListener("message", function(event) {
// 	// only accept messages from ourselves
// 	if(event.source != window) {
// 		return;
// 	}
// 	if(event.data.type && (event.data.type == "FROM_PAGE")) {
// 		var text = JSON.parse(event.data.text);
// 		console.log("content script received: " + text);
// 		port.postMessage(event.data.text);
// 	}
// }, false);