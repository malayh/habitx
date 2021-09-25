const default_conf = {
    habitxIsEnabled: true,
    habitxBlockCountdownSeconds : 10,
    habitxInteruptAfterMinutes : 5,
    habitxReenableAfterMinutes : 5,
    habitxBlockedSites : [
        { url : 'youtube.com'},
        { url : 'reddit.com'},
        { url : 'twitter.com'}
    ]
}

// Installing HabitX
chrome.runtime.onInstalled.addListener(function(details){

    if(details.reason == "install"){
        console.log("Installing Habitx....");
        
        chrome.storage.sync.set(default_conf);

    } else if (details.reason == "update"){
        console.log("Updating HabitX...");

        chrome.storage.sync.get(Object.keys(default_conf), (data) => {

            let _obj = {};
            for(const key of Object.keys(default_conf)) {
                _obj[key] = data[key] ? data[key] : default_conf[key];
            }

            console.log(_obj);
            chrome.storage.sync.set(_obj);
        });

    }
});