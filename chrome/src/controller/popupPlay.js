//Sleep function
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


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

        document.title = "Riproduci " + anime_title + " - Yunime";

        //Last episode button
        var containerParent = document.getElementsByClassName("container")[1];
        var playButton = document.createElement("A");
        playButton.className = "dropdown-item lastepisode loaded";
        playButton.id = String(number_episodes)
        playButton.innerHTML = "Ultimo Episodio (" + String(number_episodes) + ")";
        containerParent.appendChild(playButton);
        postArguments(number_episodes)

        //Add dropdown items
        for (var x = 1; x < number_episodes; x++) {
            var containerParent = document.getElementsByClassName("container")[1];

            var playButton = document.createElement("A");
            playButton.className = "dropdown-item loaded";
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

                    let buttonContainer = document.getElementById(numberEp);
                    let buttonClassName = buttonContainer.className
                    console.log(buttonContainer)
                    buttonContainer.style.backgroundImage = "url('../view/assets/Spinner_Loading.svg')"
                    buttonContainer.style.backgroundSize = "50px"
                    buttonContainer.style.backgroundPosition = "center"
                    buttonContainer.style.backgroundRepeat = "no-repeat"
                    buttonContainer.innerHTML = ""
                    buttonContainer.style.padding = "1.7rem"

                    buttonContainer.classList.remove("loaded");


                            chrome.storage.local.get(["response"], async function(result) {
                                let status = result.response
                                let isLastEpisode = buttonClassName.includes("lastepisode")
                                if (status == 'Anime not found! (Line 39)' || status == 'Anime not found! (Line 34)') {
                                    alert("Episodio non trovato!")
                                }
                                if (status == 1){
                                    await sleep(1000)
                                    buttonContainer.innerHTML = "Episodio " + numberEp
                                    buttonContainer.style.padding = "1rem"
                                    buttonContainer.style.backgroundImage = ""
                                    if(isLastEpisode == true){
                                        buttonContainer.className = "dropdown-item lastepisode loaded"
                                    }else{
                                        buttonContainer.className = "dropdown-item loaded"
                                    }
                                    chrome.storage.local.set({ "animeClicked": anime_title, "episodeClicked": numberEp, "coverClicked": cover_image })
                                }else if (status == 0){
                                    buttonContainer.innerHTML = "Episodio " + numberEp
                                    buttonContainer.style.padding = "1rem"
                                    buttonContainer.style.backgroundImage = ""
                                    if(isLastEpisode == true){
                                        buttonContainer.className = "dropdown-item lastepisode loaded"
                                    }else{
                                        buttonContainer.className = "dropdown-item loaded"
                                    }

                                    return alert("Episodio non disponibile")
                                }else if (status == -1){
                                    buttonContainer.innerHTML = "Episodio " + numberEp
                                    buttonContainer.style.padding = "1rem"
                                    buttonContainer.style.backgroundImage = ""
                                    if(isLastEpisode == true){
                                        buttonContainer.className = "dropdown-item lastepisode loaded"
                                    }else{
                                        buttonContainer.className = "dropdown-item loaded"
                                    }
                                    
                                    return alert("VLC non trovato o non funzionante\nScaricalo da qui: https://www.videolan.org/vlc/")
                                }
                            });


                },
                false
            );

        }



    });
}