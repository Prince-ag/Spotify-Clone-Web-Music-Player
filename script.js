let currentSong = new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML=response;
    let as = div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href)
        }
        
    }
    // show all song in library
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for(const song of songs){
        songUL.innerHTML= songUL.innerHTML+`<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("http://127.0.0.1:5500/songs/"," ")}</div>
                                <div>Arjit Singh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
    }
    //attach an event listener to each music

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    
    return songs
}

const playMusic=(track,pause=false)=>{
    currentSong.src="/songs/" + track
    if(!pause){
        currentSong.play()
    play.src="img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
    
    
}


async function main(){
    // playMusic(songs[0], true)
    // await displayAlbums()
     songs =await  getsongs();
     
    if (songs.length > 0) {
        playMusic(songs[0].split("/").slice(-1)[0], true); // Set default song but don't play
    }
    // console.log(songs)
    // var audio = new Audio(songs[0]);
    // audio.play();
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src= "img/pause.svg"
            
        }else{
            currentSong.pause()
            play.src="img/play.svg"
        }
    })
    //listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML= `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
//add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent =  (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100


})
// add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
})
//add an event listener for close button
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%"
})

previous.addEventListener("click", () => {
    currentSong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentSong.src);
    if ((index - 1) >= 0) {
        playMusic(songs[index -1].split("/").slice(-1)[0]); 
    }
})

// Add an event listener to next
next.addEventListener("click", () => {
    currentSong.pause()
    console.log("Next clicked")
    let index = songs.indexOf(currentSong.src);
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1].split("/").slice(-1)[0]); 
    }
})
//play song while click on card
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        let songFile = card.getAttribute("data-song");
        playMusic(songFile);
    });
});

}
main()  