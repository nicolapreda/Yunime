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

        var infoEpisode = document.getElementsByClassName("card-text")[0];
        infoEpisode.innerHTML = "Episodio " + episodeNumber;

        var resumeButton = document.getElementsByClassName("btn")[0];

        //Send request
        resumeButton.addEventListener(
            "click",
            function() {
                chrome.runtime.sendMessage({
                    animeTitle: animeTitle,
                    nEpisode: episodeNumber,
                    request: true,
                });
            },
            false
        );
        imgDivParent.appendChild(coverImageParent);
    }
}