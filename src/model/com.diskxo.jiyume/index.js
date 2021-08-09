const request = require("request");
var cp = require("child_process");
var vlcCommand = require("vlc-command");

const RPC = require("discord-rpc");
const rpc = new RPC.Client({
    transport: "ipc"
})

function observe(msg, push, done) {
    var title = msg.animeTitle;
    var ep_n = msg.episodeNumber;
    get_episode_aniWord(title, ep_n)


    function get_episode_aniWord(title, ep_num) {
        try {
            link =
                "https://www.animeworld.tv/search?keyword=" + title.replace(" ", "+");

            const request = require("request");
            request(link, function(error, response, body) {
                //search anime

                var data = extract(body.split("\n"), "data-jtitle"); //split line containing anime data

                //console.log(data);
                var str = search_most_similar(data, title); //get data anime required

                if (str != undefined && str != "") {
                    request(
                        "https://www.animeworld.tv" + getLink(str),
                        function(error, response, body) {
                            //go on the anime page
                            str = extract(body.split("\n"), "data-episode-num"); //split line containing anime data
                            str = regrp_ep_server_aniworld(str);
                            if (str != undefined) {
                                str = getMultilink(str);
                                request(
                                    getEpisodesFromList(str, ep_num),
                                    function(error, response, body) {
                                        //go on the episode page
                                        str = extract(body.split("\n"), "alternativeDownloadLink"); //split line containing anime data
                                        var result = getDownloadLink(str);
                                        openVLC(result);
                                        console.log(result);
                                        return result;
                                    }
                                );
                            } else {
                                console.error("Anime not found 34");
                            }
                        }
                    );
                } else {
                    console.error("Anime not found 39");
                }
            });
        } catch {
            console.error("Something went wrong :(");
        }
    }

    function extract(lnArray, iddata) {
        var result;
        lnArray.forEach((element) => {
            if (element.includes(iddata)) {
                result += element + "\n";
            }
        });
        return result;
    }

    function search_most_similar(data, title) {
        var maxcorresp = 0;
        var current = "";
        var actual = 0;

        var arr_d = data.split("\n");
        var arr_t = title.split(" ");
        arr_d.forEach((line) => {
            arr_t.forEach((word) => {
                if (line.toLowerCase().includes(word.toLowerCase())) {
                    actual++;
                }
            });

            if (actual > maxcorresp) {
                maxcorresp = actual;
                current = line;
            }
            actual = 0;
        });

        return current;
    }

    function getLink(data) {
        var res = "";
        var spl = data.split('"');

        spl.forEach((line0) => {
            if (line0.includes("/") && line0.includes("/play/")) {
                res = line0;
            }
        });

        return res;
    }

    function getDownloadLink(data) {
        var res = "";
        var spl = data.split('"');

        spl.forEach((line0) => {
            if (
                line0.includes("/") &&
                (line0.includes("https://") || line0.includes("www."))
            ) {
                res = line0;
            }
        });

        return res;
    }

    function getStream(data) {
        var res = "";
        var spl = data.split('"');

        spl.forEach((line0) => {
            if (line0.includes("/") && line0.includes("/play/")) {
                res = line0;
            }
        });

        return res;
    }

    function getMultilink(data) {
        var res = "";
        var episodes = data.split("\n");
        //var count = 1;

        episodes.forEach((line0) => {
            var spl = line0.split('"');

            spl.forEach((element) => {
                if (element.includes("/") && element.includes("/play/")) {
                    res += "https://www.animeworld.tv" + element + "\n";
                    //console.log(count + " " + element);
                    //count++;
                }
            });
        });

        return res;
    }

    function getEpisodesFromList(data, idEp) {
        var episodes = data.split("\n");

        if (Lenght(episodes) >= idEp && idEp > 0) {
            return episodes[idEp - 1];
        } else {
            console.error("Episode index out of range! Get last");
            return episodes[Lenght(episodes) - 1];
        }
        return "";
    }

    function Lenght(data) {
        var lenght = 0;
        data.forEach((element) => {
            if (element != "") lenght++;
        });
        return lenght;
    }

    function regrp_ep_server_aniworld(data) {
        if (data != undefined) {
            let episodes = "";
            var epnum = 1;
            var arr_d = data.split("\n");

            arr_d.forEach((line) => {
                if (line.includes('data-episode-num="' + epnum + '"')) {
                    episodes += line + "\n";
                    epnum++;
                }
                if (line.includes(epnum - 1 + "-" + epnum)) {
                    episodes += line + "\n";
                    epnum++;
                }
                // else if (line.includes("data-episode-num=\"1\"") && episodes > 1) {
                //   return true;
                // }
            });
            return episodes;
        }

        return undefined;
    }

    function openVLC(link) {
        vlcCommand(function(err, cmd) {
            if (err) return console.error("Comando VLC non trovato");
            //rpc.on("ready", () => {
            //    rpc.setActivity({
            //        details: "details",
            //        state: "state",
            //        largeImageKey: "large_image",
            //        smallImageKey: "small_image",
            //        smallImageText: "quack"
            //    })
            //    console.log("RPC Active")
            //})

            //rpc.login({
            //    clientId: "872788547684421662"
            //})
            cp.execFile(cmd, [link], function(err, stdout) {
                if (err) return console.error(err);
                console.log(stdout);

            });
        });
    }
}


/* message passing */
const nativeMessage = require('./messaging');

const input = new nativeMessage.Input();
const transform = new nativeMessage.Transform(observe);
const output = new nativeMessage.Output();

process.stdin
    .pipe(input)
    .pipe(transform)
    .pipe(output)
    .pipe(process.stdout);