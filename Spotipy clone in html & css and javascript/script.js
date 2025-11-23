function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(language) {
  try {
    const response = await fetch("songs.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data[language] || [];
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

async function domContentLoadedHandler() {
  let playsong = document.querySelector(".playsong");
  let songs = [];
  let currentSong = new Audio();
  let currentPlayIcon = null;
  let currentLanguage = "hindi";
  let hindiSongs = [];
  let bengaliSongs = [];
  let narayanaSong = [];
  let shivSong = [];
  let bothLanguagesLoaded = false;
  let combinedSongsLoaded = false;

  // Initial song list population
  async function populateSongList(language) {
  songs = await getSongs(language);
  // Songs ke alphabetically sort kore nebo
  songs.sort((a, b) => a.localeCompare(b));
    if (language === "hindi") {
      hindiSongs = [...songs];
    } else if (language === "narayana") {
      narayanaSong = [...songs];
    } else if (language === "shiv") {
      shivSong = [...songs];
    } else {
      bengaliSongs = [...songs];
    }

    let songUL = document
      .querySelector(".songlist")
      .getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

    songs.forEach((song) => {
      if (!song) return; // safety check
      const li = document.createElement("li");
      li.innerHTML = `
            <img src="svg/music.svg" alt="" />
            <div class="info">
                <div>${song.replaceAll("%20", " ").replace(".mp3", "")}</div>
                <div>Artist:-DEEP</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img src="svg/playbar.svg" alt="" class="play-icon" />
            </div> 
            `;
      songUL.appendChild(li);
    });


if (songs.length > 0 && songs[0]) {
  const firstSong = songs[0];
  currentSong.src = `/songs/${currentLanguage}/${firstSong}`;
  playsong.src = "svg/playbar.svg";
  document.querySelector(".songinfo").innerHTML = firstSong
    .split("/")
    .slice(-1)[0];
  document.querySelector(".songtime").innerHTML = "00:00";

  const firstPlayIcon = document.querySelector(
    ".songlist li:nth-child(1) .play-icon"
  );
  if (firstPlayIcon) {
    firstPlayIcon.src = "svg/playbar.svg";
    currentPlayIcon = firstPlayIcon;
  }
} else {
  console.warn(`⚠️ No songs found for language: ${currentLanguage}`);
  document.querySelector(".songinfo").innerHTML = "No songs available";
  document.querySelector(".songtime").innerHTML = "--:--";
}}


  // Load default language
  populateSongList(currentLanguage);

  const playMusic = (track, playIcon) => {
    if (currentPlayIcon && currentPlayIcon !== playIcon) {
      currentPlayIcon.src = "svg/playbar.svg";
    }
    currentPlayIcon = playIcon;
    currentSong.src = `/songs/${currentLanguage}/${track}`;
    currentSong.play().catch((err) =>
      console.warn("Playback failed:", err)
    );
    playsong.src = "svg/pause.svg";
    document.querySelector(".songinfo").innerHTML = track
      .split("/")
      .slice(-1)[0];
    document.querySelector(".songtime").innerHTML = "00.00";
    playIcon.src = "svg/pause.svg";
    console.log(track);
  };

  // Event delegation for song list
  document.querySelector(".songlist").addEventListener("click", (e) => {
    const target = e.target.closest("li");
    if (target) {
      const trackName =
        target.querySelector(".info div").textContent.trim() + ".mp3";
      const playIcon = target.querySelector(".playnow .play-icon");
      const trackToPlay = songs.find(
        (song) => song && song.includes(trackName)
      );
      if (trackToPlay) {
        playMusic(trackToPlay, playIcon);
      }
    }
  });

  Array.from(document.querySelectorAll(".card")).forEach((card) => {
    card.addEventListener("click", async () => {
      const songName = card.getAttribute("data-song");
      const playIcon = card.querySelector(".play svg");
      let songToPlay;

      if (songName === "combined_songs") {
        if (!combinedSongsLoaded) {
          await Promise.all([
            populateSongList("hindi"),
            populateSongList("bengali"),
            populateSongList("narayana"),
            populateSongList("shiv"),
          ]);
          bothLanguagesLoaded = true;
          combinedSongsLoaded = true;
        }
        songToPlay = songs[0];
      } else if (songName === "hindi") {
        currentLanguage = "hindi";
        if (!bothLanguagesLoaded) {
          await populateSongList("hindi");
          bothLanguagesLoaded = true;
        }
        songs = hindiSongs;
        songToPlay = hindiSongs[0];
      } else if (songName === "bengali") {
        currentLanguage = "bengali";
        if (!bothLanguagesLoaded) {
          await populateSongList("bengali");
          bothLanguagesLoaded = true;
        }
        songs = bengaliSongs;
        songToPlay = bengaliSongs[0];
      } else if (songName === "narayana") {
        currentLanguage = "narayana";
        if (!bothLanguagesLoaded) {
          await populateSongList("narayana");
          bothLanguagesLoaded = true;
        }
        songs = narayanaSong;
        songToPlay = narayanaSong[0];
      } else if (songName === "shiv") {
        currentLanguage = "shiv";
        if (!bothLanguagesLoaded) {
          await populateSongList("shiv");
          bothLanguagesLoaded = true;
        }
        songs = shivSong;
        songToPlay = shivSong[0];
      } else {
        const clickedCard = card;
        if (clickedCard) {
          const trackName = songName + ".mp3";
          songToPlay = songs.find(
            (song) => song && song.includes(trackName)
          );
        }
      }

      if (songToPlay) {
        playMusic(songToPlay, playIcon);
      }
    });
  });

  // Play/Pause button
  playsong.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play().catch((err) =>
        console.warn("Playback failed:", err)
      );
      playsong.src = "svg/pause.svg";
      if (currentPlayIcon) {
        currentPlayIcon.src = "svg/pause.svg";
      }
    } else {
      currentSong.pause();
      playsong.src = "svg/playbar.svg";
      if (currentPlayIcon) {
        currentPlayIcon.src = "svg/playbar.svg";
      }
    }
  });

  // Change songlist icon
  Array.from(document.querySelectorAll(".play-icon")).forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentSong.paused) {
        if (currentPlayIcon && currentPlayIcon !== icon) {
          currentPlayIcon.src = "svg/playbar.svg";
        }
        currentSong.play().catch((err) =>
          console.warn("Playback failed:", err)
        );
        icon.src = "svg/pause.svg";
        playsong.src = "svg/pause.svg";
        currentPlayIcon = icon;
      } else {
        currentSong.pause();
        icon.src = "svg/playbar.svg";
        playsong.src = "svg/playbar.svg";
      }
    });
  });

  // Time update
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = persent + "%";
    currentSong.currentTime = (currentSong.duration * persent) / 100;
  });

  // Hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Closers
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  document.querySelector(".library .close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Previous
  document.querySelector(".previousong").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      const prevSong = songs[index - 1];
      const prevSongElement = document.querySelector(
        `.songlist li:nth-child(${index}) .play-icon`
      );
      playMusic(prevSong, prevSongElement);
    }
  });

  // Next
  document.querySelector(".nextsong").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      const nextSong = songs[index + 1];
      const nextSongElement = document.querySelector(
        `.songlist li:nth-child(${index + 2}) .play-icon`
      );
      playMusic(nextSong, nextSongElement);
    }
  });

  // Auto play next on ended
  currentSong.addEventListener("ended", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      const nextSong = songs[index + 1];
      const nextSongElement = document.querySelector(
        `.songlist li:nth-child(${index + 2}) .play-icon`
      );
      playMusic(nextSong, nextSongElement);
    } else {
      const firstSong = songs[0];
      const firstSongElement = document.querySelector(
        `.songlist li:nth-child(1) .play-icon`
      );
      playMusic(firstSong, firstSongElement);
    }
  });

  // Volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("input", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // Language buttons
  document.getElementById("hindiBtn").addEventListener("click", () => {
    currentLanguage = "hindi";
    populateSongList(currentLanguage);
  });
  document.getElementById("bengaliBtn").addEventListener("click", () => {
    currentLanguage = "bengali";
    populateSongList(currentLanguage);
  });
  document.getElementById("Narayanabtn").addEventListener("click", () => {
    currentLanguage = "narayana";
    populateSongList(currentLanguage);
  });
  document.getElementById("Shivbtn").addEventListener("click", () => {
    currentLanguage = "shiv";
    populateSongList(currentLanguage);
  });
}

document.addEventListener("DOMContentLoaded", domContentLoadedHandler);
