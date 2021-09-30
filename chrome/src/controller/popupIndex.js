//Sleep function
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

window.addEventListener("load", (event) => {

    getRecentsEpisodes();
});

function getRecentsEpisodes() {
    chrome.storage.local.get(
        ["anime_clicked_title1", "anime_clicked_title2", "episodeClicked", "coverClicked"],
        function(result) {
            var title_english = result.anime_clicked_title1;
            var title_romaji = result.anime_clicked_title2;
            var episodeNumber = result.episodeClicked;
            var cover_image = result.coverClicked;
            createRecentCard(title_english, title_romaji, String(episodeNumber), cover_image);
        }
    );
}

function createRecentCard(title_english, title_romaji, episodeNumber, coverImage) {
    if (
        title_english == null &&
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
        infoTitle.innerHTML = title_english;

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
                        titleEnglish: title_english,
                        titleRomaji: title_romaji,
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
                            //Wait for 1.1 sec
                            await sleep(1100);
                            //Returns default button
                            resumeButton.innerHTML = "Episodio " + episodeNumber;
                            resumeButton.style.padding = "1rem";
                            resumeButton.style.backgroundImage = "";
                            resumeButton.style.cursor = "pointer";
                            resumeButton.className = "dropdown-item loaded";

                        } else if (status == 0) {
                            //Returns default button
                            resumeButton.innerHTML = "Episodio " + episodeNumber;
                            resumeButton.style.padding = "1rem";
                            resumeButton.style.backgroundImage = "";
                            resumeButton.style.cursor = "pointer";
                            resumeButton.className = "dropdown-item loaded";


                            //Returns alert button
                            var hideAlert = document.getElementById("alert");
                            var alertMessage = document.getElementById("alertText")
                            alertMessage.innerHTML = 'Episodio non disponibile!'
                            hideAlert.style.visibility = "visible";

                        } else if (status == -1) {
                            resumeButton.innerHTML = "Episodio " + episodeNumber;
                            resumeButton.style.padding = "1rem";
                            resumeButton.style.backgroundImage = "";
                            resumeButton.style.cursor = "pointer";
                            resumeButton.className = "dropdown-item loaded";

                            //Returns alert button
                            var hideAlert = document.getElementById("alert");
                            var alertMessage = document.getElementById("alertText")
                            alertMessage.innerHTML = '<strong>VLC Media Player non trovato! </strong>Clicca <a href="https://www.videolan.org/vlc/">qui</a> per installarlo.'
                            hideAlert.style.visibility = "visible";
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
        var hideAlert = document.getElementById("alert");
        var alertMessage = document.getElementById("alertText")
        alertMessage.innerHTML = 'Episodio non disponibile!'
        hideAlert.style.visibility = "visible";

    }
});

// Close alert when button is clicked
var btnClose = document.getElementById("closeBtn");
btnClose.addEventListener("click", function(request, sender, response) {
    var hideAlert = document.getElementById("alert");
    hideAlert.style.visibility = "hidden";
});