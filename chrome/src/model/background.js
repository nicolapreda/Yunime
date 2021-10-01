"use strict";

var extVers = "1.2";

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
    let title_english = result.titleEnglish;
    let title_romaji = result.titleRomaji;
    let episode_number = result.nEpisode;
    let request = result.request;

    if (request == true) {
        var port = chrome.runtime.connectNative("com.diskxo.yunime");

        port.postMessage({
            titleEnglish: title_english,
            titleRomaji: title_romaji,
            episodeNumber: episode_number,
        });

        port.onMessage.addListener((res) => {
            console.log(res)
            if (res.vers != extVers) {
                if (window.confirm("E' disponibile un nuovo aggiornamento!\nScaricalo cliccando 'Ok'")) {
                    window.open('https://nicolapreda.me/yunime/#download', '_blank');
                };

            }
            if (res.res == 1) {
                chrome.storage.local.set({ response: 1 });
            } else if (res.res == 0) {
                chrome.storage.local.set({ response: 0 });
            } else if (res.res == -1) {
                chrome.storage.local.set({ response: -1 });
            }
        });
        port.onDisconnect.addListener((res) => {
            chrome.runtime.sendMessage({
                stopped: 1,
            });
        });
    }
});