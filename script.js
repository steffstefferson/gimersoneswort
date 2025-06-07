
let videoList = [];
let currentIndex = 0;

function onYouTubeIframeAPIReady() {
    window.player = new YT.Player('player', {
        height: '400',
        width: '100%',
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}
function playVideo(index) {
    clearInterval(window.checkStopTimeout);
    currentIndex = index  % videoList.length; // Loop back if at end
    const video = videoList[currentIndex];

    console.log('Playing video:', video.title," with index ",index, 'at', video.start, 'seconds');

    window.player.loadVideoById({ videoId: video.link });

    setTimeout(() => {
        window.player.seekTo(video.start, true);
        window.player.playVideo();
    }, 500);

    window.checkStopTimeout = setInterval(() => {
        if (window.player.getCurrentTime() > video.end) {
            console.log('stop video, reached ' + video.end);
            clearInterval(window.checkStopTimeout);
            playNextVideo();
        }
    }, 1000);

    // Highlight corresponding list item
    const playlist = document.getElementById("playlist");
    const listItems = playlist.getElementsByTagName("li");

    if (lastHighlighted) {
        lastHighlighted.classList.remove("highlight");
    }

    lastHighlighted = listItems[index];
    lastHighlighted.classList.add("highlight");
}


function playNextVideo() {
    playVideo(currentIndex+1);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        console.log("Video ended. Starting next...");
        playNextVideo();
    }
}

let lastHighlighted = null;

fetch("playlist.json")
    .then(response => response.json())
    .then(data => {
        videoList = data.videos;
        const playlist = document.getElementById("playlist");

        videoList.forEach((video, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = video.title;
            listItem.addEventListener("click", () => {
                playVideo(index);
            });
            playlist.appendChild(listItem);
        });
    })
    .catch(error => console.error("Error loading playlist:", error));