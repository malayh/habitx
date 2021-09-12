

// chrome.tabs.onUpdated.addListener( async (tabId, changeInfo, tab) => {
//     let delayPage = chrome.runtime.getURL("delay.html");
//     let httpRegex = new RegExp("https{0,1}://");

//     if( changeInfo.url && httpRegex.test(changeInfo.url)) {
        
//         // await chrome.storage.local.set({`{tabId: changeInfo.url});
//         // await chrome.storage.local.set({'test': 'asd'});


//         // console.log(tabId);
//         // // chrome.storage.local.set()

//         // let x = ""+changeInfo.url;
//         // console.log(x);

//         // chrome.tabs.update( tabId, {url: delayPage});
//     }
// });