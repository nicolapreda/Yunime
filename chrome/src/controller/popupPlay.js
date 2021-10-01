//Check the version of the extension
const checkVers = "1.2";

//Sleep function
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//Start main function on page load
window.addEventListener("load", (event) => {
    playExtPage();
});

function playExtPage() {
    chrome.storage.local.get(
        ["mainTitle", "titleEnglish", "titleRomaji", "numberEpisodes", "backgroundImage", "coverImage"],
        function(result) {
            //Define variables
            var main_title = result.mainTitle
            var title_english = result.titleEnglish;
            var title_romaji = result.titleRomaji;
            var number_episodes = result.numberEpisodes;
            var background_image = result.backgroundImage;
            var cover_image = result.coverImage;

            //Set anime background
            var divParent = document.getElementsByClassName("background")[0];
            divParent.style.backgroundImage = 'url("' + background_image + '")';
            var documentTitle = document.getElementById("anime_title");

            //Style if there isn't a background
            if (background_image == "") {
                documentTitle.style.position = "relative";
                divParent.style.backgroundImage = "";
            }

            //Set title in play.hmtl
            documentTitle.innerHTML = main_title;
            //Set page title in play.html
            document.title = main_title + " - Yunime";

            //Last episode button
            var containerParent = document.getElementsByClassName("container")[1];
            var playButton = document.createElement("A");
            playButton.className = "dropdown-item lastepisode loaded";
            playButton.id = String(number_episodes);
            playButton.innerHTML =
                "Ultimo Episodio (" + String(number_episodes) + ")";
            containerParent.appendChild(playButton);
            postArguments(number_episodes);

            //Add dropdown items
            for (var x = 1; x < number_episodes; x++) {
                var containerParent = document.getElementsByClassName("container")[1];

                var playButton = document.createElement("A");
                playButton.className = "dropdown-item loaded";
                playButton.id = String(x);
                playButton.innerHTML = "Episodio " + String(x);

                containerParent.appendChild(playButton);

                postArguments(x);
            }

            function postArguments(numberEp) {
                var mainButton = document.getElementById(numberEp);

                mainButton.addEventListener(
                    "click",
                    function(request, sender, response) {
                        var buttonClassName = mainButton.className;
                        var isLoaded = buttonClassName.includes("loaded");
                        if (isLoaded == true) {

                            chrome.runtime.sendMessage({
                                titleEnglish: title_english,
                                titleRomaji: title_romaji,
                                nEpisode: numberEp,
                                request: true,
                            });

                            let buttonContainer = document.getElementById(numberEp);
                            let buttonClassName = buttonContainer.className;

                            buttonContainer.style.backgroundImage =
                                "url('../view/assets/animations/Spinner_Loading.svg')";
                            buttonContainer.style.backgroundSize = "50px";
                            buttonContainer.style.backgroundPosition = "center";
                            buttonContainer.style.backgroundRepeat = "no-repeat";
                            buttonContainer.innerHTML = "";
                            buttonContainer.style.padding = "1.7rem";
                            buttonContainer.style.cursor = "default";

                            buttonContainer.classList.remove("loaded");
                            checkMessages();

                            function checkMessages() {
                                chrome.storage.local.get(
                                    ["response", "close"],
                                    async function(result) {
                                        let status = result.response;

                                        let isLastEpisode = buttonClassName.includes("lastepisode");

                                        if (status == 1) {
                                            //Wait for 1.1 sec
                                            await sleep(1100);
                                            //Returns default button
                                            buttonContainer.innerHTML = "Episodio " + numberEp;
                                            buttonContainer.style.padding = "1rem";
                                            buttonContainer.style.backgroundImage = "";
                                            buttonContainer.style.cursor = "pointer";
                                            if (isLastEpisode == true) {
                                                buttonContainer.className =
                                                    "dropdown-item lastepisode loaded";
                                            } else {
                                                buttonContainer.className = "dropdown-item loaded";
                                            }

                                            //Send data to index page
                                            chrome.storage.local.set({
                                                anime_clicked_title1: title_english,
                                                anime_clicked_title2: title_romaji,
                                                episodeClicked: numberEp,
                                                coverClicked: cover_image,
                                            });
                                        } else if (status == 0) {
                                            //Returns default button
                                            buttonContainer.innerHTML = "Episodio " + numberEp;
                                            buttonContainer.style.padding = "1rem";
                                            buttonContainer.style.backgroundImage = "";
                                            buttonContainer.style.cursor = "pointer";
                                            if (isLastEpisode == true) {
                                                buttonContainer.className =
                                                    "dropdown-item lastepisode loaded";
                                            } else {
                                                buttonContainer.className = "dropdown-item loaded";
                                            }

                                            //Returns alert button
                                            var hideAlert = document.getElementById("alert");
                                            var alertMessage = document.getElementById("alertText")
                                            alertMessage.innerHTML = 'Episodio non disponibile!'
                                            hideAlert.style.visibility = "visible";

                                        } else if (status == -1) {
                                            buttonContainer.innerHTML = "Episodio " + numberEp;
                                            buttonContainer.style.padding = "1rem";
                                            buttonContainer.style.backgroundImage = "";
                                            buttonContainer.style.cursor = "pointer";
                                            if (isLastEpisode == true) {
                                                buttonContainer.className =
                                                    "dropdown-item lastepisode loaded";
                                            } else {
                                                buttonContainer.className = "dropdown-item loaded";
                                            }

                                            //Returns alert button
                                            var hideAlert = document.getElementById("alert");
                                            var alertMessage = document.getElementById("alertText")
                                            alertMessage.innerHTML = '<strong>VLC Media Player non trovato! </strong>Clicca <a href="https://www.videolan.org/vlc/">qui</a> per installarlo.'
                                            hideAlert.style.visibility = "visible";
                                        }
                                    }
                                );
                            }
                        } else {
                            return;
                        }
                    },
                    false
                );
            }
        }
    );
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