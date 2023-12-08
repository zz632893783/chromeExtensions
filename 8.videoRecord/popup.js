// chrome.tabs.query({ active: true, currentWindow: true }, ([ tab ]) => {
//     chrome.tabs.sendMessage(tab.id, {action: "messageFromPopup", data: "Hello from popup!"});
// });
// 在popup.js中
chrome.runtime.sendMessage({ command: 'appendRecordScript' }, response => {
    console.log(response);
});
