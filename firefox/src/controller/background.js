'use strict'

//Open NativeConnect download when extension is installed
browser.runtime.onInstalled.addListener(function (object) {
    browser.tabs.create({url: "https://nicolapreda.me/yunime/#download"});
});


browser.browserAction.setPopup({ popup: "../view/index.html" });
browser.runtime.onMessage.addListener(function(request) {
    if (request.page == "play") {
        browser.browserAction.setPopup({ popup: "../view/play.html" });
    } else if (request.page == "index") {
        browser.browserAction.setPopup({ popup: "../view/index.html" });
    } else {
        browser.browserAction.setPopup({ popup: "../view/index.html" });
    }
});


browser.runtime.onMessage.addListener(function(result, sender) {

    let anime_title = result.animeTitle;
    let episode_number = result.nEpisode;
    let request = result.request;

    if (request == true) {

        this.port = browser.runtime.connectNative('com.diskxo.yunime');

        this.port.postMessage({
            animeTitle: anime_title,
            episodeNumber: episode_number
        });

        this.port.onMessage.addListener(res => {
                console.log(res)
                if (res.res == 1){
                    browser.storage.local.set({ "response": 1 })
                    browser.runtime.sendMessage({
                        reponse: 1
                    });
                } else if (res.res == 0){
                    browser.storage.local.set({ "response": 0 })
                    browser.runtime.sendMessage({
                        reponse: 0
                    });
                }
                else if (res.res == -1){
                    browser.storage.local.set({ "response": -1 })
                    browser.runtime.sendMessage({
                        reponse: -1
                    });
                }

        });

    }
});