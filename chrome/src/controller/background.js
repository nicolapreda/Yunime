'use strict'

//Open NativeConnect download when extension is installed
chrome.runtime.onInstalled.addListener(function(object) {
    chrome.tabs.create({ url: "https://nicolapreda.me/yunime/#download" });
});


chrome.browserAction.setPopup({ popup: "../view/index.html" });
chrome.runtime.onMessage.addListener(function(request) {
    if (request.page == "play") {
        chrome.browserAction.setPopup({ popup: "../view/play.html" });
    } else if (request.page == "index") {
        chrome.browserAction.setPopup({ popup: "../view/index.html" });
    } else {
        chrome.browserAction.setPopup({ popup: "../view/index.html" });
    }
});


chrome.runtime.onMessage.addListener(function(result, sender) {

    let anime_title = result.animeTitle;
    let episode_number = result.nEpisode;
    let request = result.request;

    if (request == true) {

        var port = chrome.runtime.connectNative('com.diskxo.yunime');

        port.postMessage({
            animeTitle: anime_title,
            episodeNumber: episode_number
        });

        port.onMessage.addListener(res => {

            if (res.res == 1) {
                chrome.storage.local.set({ "response": 1 })

            } else if (res.res == 0) {
                chrome.storage.local.set({ "response": 0 })

            } else if (res.res == -1) {
                chrome.storage.local.set({ "response": -1 })
            }


        });
        port.onDisconnect.addListener(res => {
            chrome.runtime.sendMessage({
                "stopped": 1
            })
        })
    }
});