// This is gonna execute in the context of the DOM.
// Don't use Jquery here, can mess up with the current page's JS
// This file must be pure JS
// This must load at the end of DOM

function habitx_unblockAccess(){
    document.getElementById("habitx-blocker-main").style.display = 'none';

    const _detail = {
        action : 'unblock'
    };
    let event = new CustomEvent("fromDOMToHabitx", {detail: _detail});
    window.dispatchEvent(event);
}

function habitx_blockAccess(url){
    let _url = document.getElementById('habitx-blocker-contents').getElementsByClassName('blocked-url')[0];
    _url.textContent = url;
    document.getElementById("habitx-blocker-main").style.display = 'block';
}


// Because some sites block onclick inline function calls.
document.getElementById("unblock-button").addEventListener("click", () => habitx_unblockAccess());

window.addEventListener('fromHabitxToDOM',(e)=>{
    // To send messages from isolated_world -> DOM world;
    console.log(e);

    let message = e.detail;

    if( ! message.action ){
        console.log("No action specified.");
        return;
    }

    switch(message.action) {
        case 'block':
            habitx_blockAccess(message.url);
            break;

        default:
            console.log(`Unknown action ${message.action}`);
    }
});