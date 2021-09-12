

// Installing HabitX
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("Installing Habitx....");

    }else if(details.reason == "update"){
        console.log("Updating HabitX...")
    }

    const block_list = [
        { url : 'youtube.com'},
        { url : 'reddit.com'},
        { url : 'twitter.com'},
        { url : 'guthib.com'}
    ]

    chrome.storage.sync.set({'habitx_block_countdown_seconds':1});
    chrome.storage.sync.set({'habitx_blocked_list': block_list});
});