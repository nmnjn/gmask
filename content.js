function maskURL(meeting_id, mask_id){

    var all = document.getElementsByTagName("*");
    for (var j = 0, max = all.length; j < max; j++) {
        if (all[j] && all[j].innerText === meeting_id) {
            const className = all[j].className
            console.log("found class for meeting link: " + className)
            const element = document.getElementsByClassName(className)[0]
            // element.innerText = mask_id
            element.textContent = mask_id
        }
    }
    
    document.title = `Meet - ${mask_id}`
    window.history.pushState({}, null, `https://meet.google.com/${mask_id}`)
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.ping) { sendResponse({ pong: true }); return; }
    if (request.target === 'content') {
        if (request.type === 'mask') {
            const { meeting_id, mask_id } = request;
            maskURL(meeting_id, mask_id);
        }
    }
})
