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
    // blockURL();
    setTimeout(blockURL,2000);
    
});

window.addEventListener('fromDOMToHabitx', (e)=> {
    console.log(e);
});