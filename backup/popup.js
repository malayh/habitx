const global_state = {
    habitx_enabled : true,
    habitx_blocked_list : [],
    habitx_block_countdown_seconds : 10
}

function is_site_blocked(hostname) {
    for(const site of global_state.habitx_blocked_list) {
        const _rx = new RegExp(site.url);
        if( _rx.test(hostname) ){
            return true; 
        }
    }

    return false;
}

function renderUI() {
    $("#block-timeout").val(global_state.habitx_block_countdown_seconds);
    $('#block-timeout-value').html(`${global_state.habitx_block_countdown_seconds} seconds`);

    $('#habitx-enabled').prop('checked', global_state.habitx_enabled );


    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        const url = new URL(tab.url);
        const domain = url.hostname;
        console.log(domain);
    
        if( is_site_blocked(domain) ){
            $("#add-button").css('display','none');
            $("#is-blocked-banner").css('display','flex');
        } else {
            $("#add-button").css('display','flex');
            $("#is-blocked-banner").css('display','none');
        }
    });

}


function initGlobalState() {
    chrome.storage.sync.get(['habitx_enabled','habitx_blocked_list','habitx_block_countdown_seconds'], (data) => {
        if( !data.habitx_blocked_list || !data.habitx_block_countdown_seconds ){
            console.log("Error: some field missing in storage. Check installing script.")
            return;
        }

        for(const key of Object.keys(data)){
            global_state[key] = data[key];
        }

        renderUI();
    });
}

function synchGlobalState(){
    chrome.storage.sync.set(global_state);
}

// -------------------- onchange methods ------------------
$("#block-timeout").change((evt)=>{
    global_state.habitx_block_countdown_seconds = evt.target.value;
    synchGlobalState();
    renderUI();
});

$('#habitx-enabled').change((evt) => {
    global_state.habitx_enabled = evt.target.checked;
    renderUI();
    synchGlobalState();
});


// ------------------------- Init -------------------------
initGlobalState();



