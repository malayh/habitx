// This is gonna execute in the context of the DOM.
// Don't use Jquery here, can mess up with the current page's JS
// This file must be pure JS
// This must load at the end of DOM

function habitx_sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function habitx_blockCountDown(countdownTime){
    let timer = document.getElementById("habitx-timer");
    for(let i = countdownTime; i>=0; i--){
        timer.textContent = i;
        await habitx_sleep(1000);
    }

    document.getElementById("unblock-button").style.display = 'block';
}

function habitx_unblockAccess(){
    document.getElementById("habitx-blocker-main").style.display = 'none';

    const _detail = {
        action : 'unblock'
    };
    let event = new CustomEvent("fromDOMToHabitx", {detail: _detail});
    window.dispatchEvent(event);
}

function habitx_blockAccess(url, countdownTime){
    let _url = document.getElementById('habitx-blocker-contents').getElementsByClassName('blocked-url')[0];
    _url.textContent = url;
    document.getElementById("habitx-blocker-main").style.display = 'block';
    document.getElementById("unblock-button").style.display = 'none';
    setTimeout(()=>habitx_blockCountDown(countdownTime),0);
}

function habitx_signalInitComplete(){
    const _detail = {
        action : 'init_complete'
    };
    let event = new CustomEvent("fromDOMToHabitx", {detail: _detail});
    window.dispatchEvent(event);
}

// --- Initialization ---

// Because some sites block onclick inline function calls.
document.getElementById("unblock-button").addEventListener("click", () => habitx_unblockAccess());

window.addEventListener('fromHabitxToDOM',(e)=>{
    // To send messages from isolated_world -> DOM world;
    if(! e.detail ){
        console.log("No detail attached with event from DOM.");
        return;
    }

    let message = e.detail;

    if( ! message.action ){
        console.log("No action specified.");
        return;
    }

    switch(message.action) {
        case 'block':
            habitx_blockAccess(message.url, message.countdownTime);
            break;

        default:
            console.log(`Unknown action ${message.action}`);
    }
});

// This is at the end of the file. When control reaches here we are assuming DOM is ready
habitx_signalInitComplete();