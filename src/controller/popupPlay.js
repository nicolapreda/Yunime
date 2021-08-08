window.addEventListener('load', (event) => {
    playExtPage()

});

function playExtPage() {

    chrome.storage.local.get(["animeTitle", "numberEpisodes", "backgroundImage", "coverImage"], function(result) {
        var anime_title = result.animeTitle;
        var number_episodes = result.numberEpisodes;
        var background_image = result.backgroundImage;
        var cover_image = result.coverImage;


        var divParent = document.getElementsByClassName("background")[0];
        divParent.style.backgroundImage = 'url("' + background_image + '")'

        var documentTitle = document.getElementById("anime_title");

        if (background_image == "") {
            documentTitle.style.position = "relative"
            divParent.style.backgroundImage = ""
        }
        documentTitle.innerHTML = "Riproduci\n" + anime_title;

        document.title = "Riproduci " + anime_title + " - JiyuMe";

        //Last episode button
        var containerParent = document.getElementsByClassName("container")[1];
        var playButton = document.createElement("A");
        playButton.className = "dropdown-item lastepisode";
        playButton.id = String(number_episodes)
        playButton.innerHTML = "Ultimo Episodio (" + String(number_episodes) + ")";
        containerParent.appendChild(playButton);
        postArguments(number_episodes)

        //Add dropdown items
        for (var x = 1; x < number_episodes; x++) {
            var containerParent = document.getElementsByClassName("container")[1];

            var playButton = document.createElement("A");
            playButton.className = "dropdown-item";
            playButton.id = String(x)
            playButton.innerHTML = "Episodio " + String(x);

            containerParent.appendChild(playButton);

            postArguments(x);
        }

        function postArguments(numberEp) {
            var mainButton = document.getElementById(numberEp);

            mainButton.addEventListener(
                "click",
                function(request, sender, response) {

                    chrome.runtime.sendMessage({
                        animeTitle: anime_title,
                        nEpisode: numberEp,
                        request: true,
                    });

                    if (request.errormsg == 'Anime not found 39' || request.errormsg == 'Anime not found 34') {
                        alert(request.errormsg)
                    }

                    //Post into recent episodes
                    chrome.storage.local.set({ "animeClicked": anime_title, "episodeClicked": numberEp, "coverClicked": cover_image })

                },
                false
            );


        }



    });
}