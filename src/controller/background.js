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

    var anime_title = result.animeTitle;
    var episode_number = result.nEpisode;
    var request = result.request;

    if (request == true) {

        port = chrome.runtime.connectNative('com.diskxo.yunime');

        port.postMessage({
            animeTitle: anime_title,
            episodeNumber: episode_number,
        });

        port.onDisconnect.addListener(function(request, sender, response) {
            if (request.errormsg == 'Anime not found 39' || request.errormsg == 'Anime not found 34') {
                chrome.runtime.sendMessage({
                    err: request.errormsg

                });
            }

        });



    }
});