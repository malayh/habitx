function injectBlockerToDOM(){
    $('head').append(`<link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("/blocker/blocker.css")}">`);
    $.get(chrome.runtime.getURL("/blocker/blocker.html"), function(data) {
        $('body').append(data);
        // The script must load at the end to ensure, initialization in blocker.js works.
        $('body').append(`<script src="${chrome.runtime.getURL("/blocker/blocker.js")}"/>`);
    });
};


function blockURL() {
    chrome.storage.sync.get('habitx_block_countdown_seconds',(data) => {
        if(!data || !data.habitx_block_countdown_seconds){
            console.log("Habitx not installed properly. `habitx_block_countdown_seconds` missing in storage.")
            return;
        }

        const _detail = {
            action : 'block',
            url : window.location.href,
            countdownTime : data.habitx_block_countdown_seconds
        };

        const blockEvent = new CustomEvent("fromHabitxToDOM", {detail: _detail} );
        window.dispatchEvent(blockEvent);
    });
}


$(document).ready(()=>{
    // This is the entry point to the entire thingy
    let currentUrl = window.location.href;

    chrome.storage.sync.get('habitx_blocked_list',(data)=>{
        if(!data || !data.habitx_blocked_list ){
            console.log("Habitx not installed properly. `habitx_blocked_list` missing in storage.")
            return;
        }

        for(const blockedSite of data.habitx_blocked_list ){
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