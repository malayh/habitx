const default_conf = {
    habitxIsEnabled: true,
    habitxBlockCountdownSeconds : 10,
    habitxInteruptAfterMinutes : 5,
    habitxReenableAfterMinutes : 5,
    habitxBlockedSites : [
        { url : 'youtube.com'},
        { url : 'reddit.com'},
        { url : 'twitter.com'}
    ],
    habitxLastDisabledAt : null
}


async function reEnabler() {
    const timeout = 1000;

    chrome.storage.sync.get(['habitxLastDisabledAt','habitxReenableAfterMinutes'], (data) => {
        
        if(!data.habitxLastDisabledAt){
            setTimeout(()=>reEnabler(), timeout);
            return;
        }

        const timeElapsed = Math.floor( data.habitxLastDisabledAt / 1000 ) + ( data.habitxReenableAfterMinutes * 60 );
        const now = Math.floor(Date.now() / 1000);

        if(now > timeElapsed){
            console.log("Re-enabling now...");            
            chrome.storage.sync.set({habitxIsEnabled: true, habitxLastDisabledAt:null },()=>{
                setTimeout(()=>reEnabler(),timeout);
            });
        } else {
            setTimeout(()=>reEnabler(),timeout);
        }
    });
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

reEnabler();