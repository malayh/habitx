

// Installing HabitX
chrome.runtime.onInstalled.addListener(function(details){
    const block_list = [
        { url : 'youtube.com'},
        { url : 'reddit.com'},
        { url : 'twitter.com'}
    ]

    if(details.reason == "install"){
        console.log("Installing Habitx....");
        
        chrome.storage.sync.set({
            'habitxIsEnabled': true,
            'habitxBlockCountdownSeconds':10,
            'habitxBlockedSites': block_list
        });

    } else if (details.reason == "update"){
        console.log("Updating HabitX...");

        chrome.storage.sync.get(['habitxIsEnabled','habitxBlockCountdownSeconds','habitxBlockedSites'], (data) => {
            chrome.storage.sync.set({
                'habitxIsEnabled': true,
                'habitxBlockCountdownSeconds': data.habitxBlockCountdownSeconds ? data.habitxBlockCountdownSeconds : 10,
                'habitxBlockedSites': data.habitxBlockedSites ? data.habitxBlockedSites : block_list 
            });
        });

    }
});