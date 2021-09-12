function injectBlockerToDOM(){
    $('head').append(`<link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("/blocker/blocker.css")}">`);
    $.get(chrome.runtime.getURL("/blocker/blocker.html"), function(data) {
        $('body').append(data);
        // The script must load at the end to ensure, initialization in blocker.js works.
        $('body').append(`<script src="${chrome.runtime.getURL("/blocker/blocker.js")}"/>`);
    });
};


function blockURL() {
    const _detail = {
        action : 'block',
        url : window.location.href
    };

    let blockEvent = new CustomEvent("fromHabitxToDOM", {detail: _detail} );
    window.dispatchEvent(blockEvent);
}


$(document).ready(()=>{
    injectBlockerToDOM();
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