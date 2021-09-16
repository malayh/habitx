// How it works:
// - If current url is in blocked_list -> inject blocker to dom
// - When DOM finishes loading generate init_complete event -> content_scipt listens for this event
// - on init_complete event content_scipt generates block event which blocker script listens for
// - on block event blocker script blocks the current page

function injectBlockerToDOM(){
    $('head').append(`<link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("/blocker/blocker.css")}">`);
    $.get(chrome.runtime.getURL("/blocker/blocker.html"), function(data) {
        $('body').append(data);
        // The script must load at the end to ensure, initialization in blocker.js works.
        $('body').append(`<script src="${chrome.runtime.getURL("/blocker/blocker.js")}"/>`);
    });
};

function blockURL() {
    chrome.storage.sync.get('habitxBlockCountdownSeconds',(data) => {
        if(!data || !data.habitxBlockCountdownSeconds){
            console.log("Habitx not installed properly. `habitxBlockCountdownSeconds` missing in storage.")
            return;
        }

        const _detail = {
            action : 'block',
            url : window.location.href,
            countdownTime : data.habitxBlockCountdownSeconds
        };

        const blockEvent = new CustomEvent("fromHabitxToDOM", {detail: _detail} );
        window.dispatchEvent(blockEvent);
    });
}

$(document).ready(()=>{
    // This is the entry point to the entire thingy
    let currentUrl = window.location.href;

    chrome.storage.sync.get(['habitxIsEnabled','habitxBlockedSites'],(data)=>{
        if( !data.habitxIsEnabled ) {
            return;
        }

        if(!data || !data.habitxBlockedSites ){
            console.log("Habitx not installed properly. `habitxBlockedSites` missing in storage.")
            return;
        }

        for(const blockedSite of data.habitxBlockedSites ){
            const _rx = new RegExp(blockedSite.url);
            if(_rx.test(currentUrl)){
                injectBlockerToDOM();
                return;
            } 
        }

    });
});

window.addEventListener('fromDOMToHabitx', (e)=> {
    if(! e.detail ){
        console.log("No detail attached with event from DOM.");
        return;
    }
    
    const message = e.detail;

    if( ! message.action ){
        console.log("No action specified.");
        return;
    }

    switch(message.action){
        case 'init_complete':
            // Meaning DOM is loaded successfully.
            blockURL();
            break;

        default:
            console.log(`Unknown action ${message.action}`);
    }

});