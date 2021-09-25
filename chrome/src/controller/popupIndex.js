//Sleep function
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

window.addEventListener("load", (event) => {

    getRecentsEpisodes();
});

function getRecentsEpisodes() {
    chrome.storage.local.get(
        ["animeClicked", "episodeClicked", "coverClicked"],
        function(result) {
            var animeTitle = result.animeClicked;
            var episodeNumber = result.episodeClicked;
            var cover_image = result.coverClicked;
            createRecentCard(animeTitle, String(episodeNumber), cover_image);
        }
    );
}

function createRecentCard(animeTitle, episodeNumber, coverImage) {
    if (
        animeTitle == null &&
        episodeNumber == "undefined" &&
        coverImage == null
    ) {
        document.getElementById("recent-card").remove();
        var desc = document.getElementsByClassName("description")[0]
        desc.innerHTML = "Inizia la riproduzione aprendo la pagina Anilist relativa all'anime che vuoi guardare"
        desc.style.marginBottom = "3rem"
    } else {
        /*Card Image*/
        var imgDivParent = document.getElementsByClassName("img-square-wrapper")[0];
        var coverImageParent = document.createElement("img");
        coverImageParent.className = "cover-image";
        coverImageParent.src = coverImage;

        var infoTitle = document.getElementsByClassName("card-title")[0];
        infoTitle.innerHTML = animeTitle;

        var resumeButton = document.getElementsByClassName("dropdown-item")[0];
        resumeButton.innerHTML = "Episodio " + episodeNumber
            //Send request

        resumeButton.addEventListener(
            "click",
            function() {
                /*--Check if the button has been already clicked--*/
                var buttonClassName = resumeButton.className;
                var isLoaded = buttonClassName.includes("loaded");
                if (isLoaded == true) { /*--xCheck if the button has been already clickedx--*/

                    chrome.runtime.sendMessage({
                        animeTitle: animeTitle,
                        nEpisode: episodeNumber,
                        request: true,
                    });


                    resumeButton.style.backgroundImage = "url('../view/assets/animations/Spinner_Loading.svg')"
                    resumeButton.style.backgroundSize = "50px"
                    resumeButton.style.backgroundPosition = "center"
                    resumeButton.style.backgroundRepeat = "no-repeat"
                    resumeButton.innerHTML = ""
                    resumeButton.style.padding = "1.7rem"
                    resumeButton.classList.remove("loaded");

                    chrome.storage.local.get(["response"], async function(result) {
                        let status = result.response
                        if (status == 1) {
                            await sleep(1000)
                            resumeButton.innerHTML = "Episodio " + episodeNumber
                            resumeButton.style.padding = "1rem"
                            resumeButton.style.backgroundImage = ""
                            resumeButton.className = "dropdown-item loaded"
                            chrome.storage.local.set({ "animeClicked": anime_title, "episodeClicked": numberEp, "coverClicked": cover_image })
                        } else if (status == 0) {
                            resumeButton.innerHTML = "Episodio " + episodeNumber
                            resumeButton.style.padding = "1rem"
                            resumeButton.style.backgroundImage = ""
                            resumeButton.className = "dropdown-item loaded"

                            return alert("Episodio non disponibile")
                        } else if (status == -1) {
                            resumeButton.innerHTML = "Episodio " + episodeNumber
                            resumeButton.style.padding = "1rem"
                            resumeButton.style.backgroundImage = ""
                            resumeButton.className = "dropdown-item loaded"
                            return alert("VLC non trovato o non funzionante\nScaricalo da qui: https://www.videolan.org/vlc/")

                        }
                    });
                } else {

                    return;

                }

            },
            false
        );
        imgDivParent.appendChild(coverImageParent);
    }
}

//Check if the episode is not available
chrome.runtime.onMessage.addListener(function(result, sender) {
    var isStopped = result.stopped;
    if (isStopped == 1) {
        window.confirm("Episodio non disponibile")
    }

})