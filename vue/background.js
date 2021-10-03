chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        toggleSitesActive: false,
        toggleSitesList: "anilist.co"
    }, () => {});
});