//Sleep function
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//Wait for Ajax site load
$.ajax({
    processData: false,
    contentType: false,
    success: async function() {
        pageScan();
    },
});

//Scans pages of Anilist
async function pageScan() {
    var tablink = window.location.href;
    var SummaryPage = tablink.includes("/anime/");
    if (SummaryPage == true) {
        getPlayPopup();
    } else {
        getIndexPopup()
    }
    await sleep(500)
    pageScan()
}


function getPlayPopup() {
    var main_title = window.location.href
    main_title = main_title.split("/")
    main_title = main_title[5]
    main_title = main_title.replaceAll("-", " ")
    title_english = main_title;

    var sec_titles = document.title
    sec_titles = sec_titles.split(" · AniList")
    var title_romaji = sec_titles[0].split(" (")
    title_romaji = title_romaji[0]
    if (title_romaji == "AniList") {
        title_romaji = ""
    }

    console.log(title_english)
    console.log(title_romaji)



    //Gets background image
    var parentBackgroundImage = document.querySelector("#app > div.page-content > div > div.header-wrap > div.banner")
    if (parentBackgroundImage) {
        var background_image = parentBackgroundImage.style.backgroundImage;
        background_image = background_image.replace('url("', '');
        background_image = background_image.replace('")', '')
    }

    //Gets cover image
    var cover_image = document.querySelector("#app > div.page-content > div > div.header-wrap > div.header > div.container > div.cover-wrap.overlap-banner > div > img")
    if (!cover_image) {
        cover_image = document.querySelector("#app > div.page-content > div > div.header-wrap > div > div.container > div.cover-wrap > div > img")
        background_image = ""
    }
    cover_image = cover_image.src

    //Gets episode numbers
    var number_episodes = document.querySelector(
        "#app > div.page-content > div > div.content.container > div.sidebar > div.data > div:nth-child(2) > div.value"
    ).textContent;

    if (isNaN(number_episodes)) {
        try {
            number_episodes = document.querySelector(
                "#app > div.page-content > div > div.content.container > div.sidebar > div.data > div.data-set.airing-countdown > div.countdown.value > span"
            ).textContent;
        } catch {
            number_episodes = document.querySelector("#app > div.page-content > div > div.content.container > div.sidebar > div.data > div:nth-child(2) > div.value").textContent
        }

        number_episodes = number_episodes.replace("\t", "");
        number_episodes = number_episodes.replace(" ", "");
        number_episodes = number_episodes.replace("Ep", "");

        var ln = number_episodes.split(":");
        number_episodes = parseInt(ln[0]);
        number_episodes = number_episodes - 1;
    }

    //Sends in chrome local storage play page
    chrome.runtime.sendMessage({ page: "play" });

    //Sends in chrome local storage title,episodes, cover and banner
    chrome.storage.local.set({ mainTitle: main_title, titleRomaji: title_romaji, titleEnglish: title_english, numberEpisodes: number_episodes, backgroundImage: background_image, coverImage: cover_image });
}

function getIndexPopup() {
    chrome.runtime.sendMessage({ page: "index" });

}