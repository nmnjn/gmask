var maskInput = document.getElementById("mask_input");
var meetingLink = document.getElementById('meeting_link');
var maskButton = document.getElementById('mask_button');

maskButton.addEventListener('click', maskLink);

function ensureSendMessage(tabId, message, callback) {
    chrome.tabs.sendMessage(tabId, { ping: true }, function (response) {
        if (response && response.pong) {
            chrome.tabs.sendMessage(tabId, message, callback);
        } else { // No listener on the other end
            chrome.tabs.executeScript(tabId, { file: "content.js" }, function () {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    throw Error("Unable to inject script into tab " + tabId);
                }
                // OK, now it's injected and ready
                chrome.tabs.sendMessage(tabId, message, callback);
            });
        }
    });
}


function getMeetLink(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        const url = tabs[0].url;
        if(url.split("/")[2] != "meet.google.com"){
            meetingLink.textContent = "Not a google meet link."
        }else{
            meetingLink.textContent = url
        }
        
    });
}

getMeetLink();


function maskLink(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        const url = tabs[0].url;
        if(url.split("/")[2] != "meet.google.com"){
            return
        }else{
            const meeting_id = tabs[0].url.split('/')[3];
            const mask_id = maskInput.value || "xxx-xxxx-xxx"
            ensureSendMessage(tabs[0].id, { target: 'content', type: 'mask', meeting_id, mask_id });
        }
    });
}

