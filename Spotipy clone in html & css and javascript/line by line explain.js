function secondsToMinutesSeconds(seconds) {
  // Function definition: Takes 'seconds' as input.  Converts a number of seconds into a formatted MM:SS string.
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  // Check for invalid input: If 'seconds' is not a number (isNaN) or is negative, return "00:00".
  const minutes = Math.floor(seconds / 60);
  // Calculate minutes: Divide 'seconds' by 60 and round down to the nearest integer using Math.floor().
  const remainingSeconds = Math.floor(seconds % 60);
  // Calculate remaining seconds:  Use the modulo operator (%) to get the remainder after dividing by 60, then round down.
  const formattedMinutes = String(minutes).padStart(2, "0");
  // Format minutes: Convert 'minutes' to a string, pad with a "0" at the beginning if it's less than two digits.
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  // Format seconds:  Convert 'remainingSeconds' to a string, pad with a "0" if it's less than two digits.
  return `${formattedMinutes}:${formattedSeconds}`;
  // Return the formatted time string in "MM:SS" format.
}

async function getSongs(language) {
  // Async function definition:  Takes 'language' as input (e.g., "hindi", "bengali").  Fetches a list of song URLs from a server.
  try {
    // try block:  Used for error handling.  Code that might throw an error is placed here.
    const response = await fetch(`http://127.0.0.1:5500/songs/${language}/`);
    // Fetch songs:  Use the fetch API to make an HTTP GET request to the server to get the list of songs for the specified language.  'await' pauses execution until the response is received.
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Check for HTTP errors:  If the response status code is not in the 200-299 range, throw an error.
    const html = await response.text();
    // Get the response text:  Extract the HTML content from the response as text.  'await' pauses execution until the text is available.
    const div = document.createElement("div");
    // Create a div element:  Create a new <div> element in memory.  This is used to parse the HTML.
    div.innerHTML = html;
    // Set the div's content:  Parse the HTML string and insert it into the newly created <div>.  This allows us to use DOM methods on the fetched HTML.
    const links = div.getElementsByTagName("a");
    // Get all links:  Find all <a> (anchor) elements within the <div>.  These are assumed to be links to the song files.
    const songs = [];
    // Initialize an empty array:  Create an empty array to store the song file names.
    for (let index = 0; index < links.length; index++) {
      // Loop through the links:  Iterate over each <a> element in the 'links' collection.
      const element = links[index];
      // Get the current link:  Get the <a> element at the current index.
      if (element.href.endsWith(".mp3")) {
        // Check if it's an MP3:  If the link's href attribute ends with ".mp3", it's assumed to be a song file.
        const songName = element.href.split(`/songs/${language}/`)[1];
        // Extract the song name:  Split the URL by "/songs/{language}/" and take the second part (index 1), which is the song file name.
        songs.push(songName);
        // Add to the array:  Add the extracted song name to the 'songs' array.
      }
    }
    return songs;
    // Return the array of song names.
  } catch (error) {
    // catch block:  This block executes if an error is thrown in the 'try' block.
    console.error("Error fetching songs:", error);
    // Log the error:  Print the error message to the console.
    return [];
    // Return an empty array:  Return an empty array to indicate that no songs were found or there was an error.  This prevents the rest of the code from breaking.
  }
}

async function domContentLoadedHandler() {
  // Async function definition: This function is executed when the HTML document has been completely loaded and parsed.
  let playsong = document.querySelector(".playsong");
  // Get the 'playsong' element:  Select the HTML element with the class "playsong".  This is likely an element used to control playing/pausing the song.
  let songs = [];
  // Initialize an empty array:  Create an empty array to store the list of songs.
  let currentSong = new Audio();
  // Create an Audio object:  Create a new Audio object.  This object is used to play audio in the browser.
  let currentPlayIcon = null;
  // Initialize currentPlayIcon:  This variable will store the currently displayed play/pause icon.
  let currentLanguage = "hindi";
  // Set default language:  Set the default language to "hindi".
  let hindiSongs = [];
  // Array for Hindi songs
  let bengaliSongs = [];
  // Array for Bengali songs
  let bothLanguagesLoaded = false;
  // Flag to track if both languages are loaded
  let combinedSongsLoaded = false;
  // Added to track combined songs loading

  // Initial song list population
  async function populateSongList(language) {
    //  Populates the song list in the HTML.
    songs = await getSongs(language);
    // Get songs for the specified language
    if (language === "hindi") {
      hindiSongs = [...songs];
    } else {
      bengaliSongs = [...songs];
    }
    let songUL = document
      .querySelector(".songlist")
      .getElementsByTagName("ul")[0];
    // Get the song list element
    songUL.innerHTML = "";
    // Clear the song list

    songs.forEach((song) => {
      // Loop through each song in the array
      const li = document.createElement("li");
      // Create a list item
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
      // Set the HTML content of the list item
      songUL.appendChild(li);
      // Append the list item to the song list
    });

    if (songs.length > 0) {
      // If there are songs
      const firstSong = songs[0];
      currentSong.src = `/songs/${currentLanguage}/${firstSong}`;
      // Set the source of the audio element to the first song
      playsong.src = "svg/playbar.svg";
      // Set the source of the play/pause button image
      document.querySelector(".songinfo").innerHTML = firstSong
        .split("/")
        .slice(-1)[0];
      // Set the song info text
      document.querySelector(".songtime").innerHTML = "00.00";
      // set the song time
      const firstPlayIcon = document.querySelector(
        ".songlist li:nth-child(1) .play-icon"
      );
      //get the first song icon
      if (firstPlayIcon) {
        firstPlayIcon.src = "svg/playbar.svg";
        currentPlayIcon = firstPlayIcon;
      }
    }
  }

  // Load default language on initial load
  populateSongList(currentLanguage);

  const playMusic = (track, playIcon) => {
    // Plays the selected song
    if (currentPlayIcon && currentPlayIcon !== playIcon) {
      currentPlayIcon.src = "svg/playbar.svg";
    }
    currentPlayIcon = playIcon;
    currentSong.src = `/songs/${currentLanguage}/${track}`;
    currentSong.play();
    playsong.src = "svg/pause.svg";
    document.querySelector(".songinfo").innerHTML = track
      .split("/")
      .slice(-1)[0];
    document.querySelector(".songtime").innerHTML = "00.00";
    playIcon.src = "svg/pause.svg";
    console.log(track);
  };

  // Add event listener to songUL (event delegation)
  document.querySelector(".songlist").addEventListener("click", (e) => {
    const target = e.target.closest("li");
    if (target) {
      const trackName =
        target.querySelector(".info div").textContent.trim() + ".mp3";
      const playIcon = target.querySelector(".playnow .play-icon");
      const trackToPlay = songs.find((song) => song.includes(trackName));
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
          // Load both languages only once
          await Promise.all([
            populateSongList("hindi"),
            populateSongList("bengali"),
          ]);
          bothLanguagesLoaded = true;
          combinedSongsLoaded = true; // Set the flag to true after loading
        }
        // Play the first song of the currently selected language (Hindi or Bengali)
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
      } else {
        const clickedCard = card;
        if (clickedCard) {
          const trackName = songName + ".mp3";
          songToPlay = songs.find((song) => song.includes(trackName));
        }
      }

      if (songToPlay) {
        playMusic(songToPlay, playIcon);
      }
    });
  });

  //Attach an evant listaner to play
  playsong.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
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

  // Add event listener to change sonlist icon
  Array.from(document.querySelectorAll(".play-icon")).forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentSong.paused) {
        if (currentPlayIcon && currentPlayIcon !== icon) {
          currentPlayIcon.src = "svg/playbar.svg";
        }
        currentSong.play();
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

  //time update
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //add eevent listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = persent + "%";
    currentSong.currentTime = (currentSong.duration * persent) / 100;
  });

  //Add event listener for humburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Add event listener for in 1st closer
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //Add event listener for in 2nd closer
  document.querySelector(".library .close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add event listener to previous
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

  // Add event listener to next
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

  // Add an event listener for the 'ended' event
  currentSong.addEventListener("ended", () => {
    // Get the index of the current song
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // Play the next song if it exists
    if (index + 1 < songs.length) {
      const nextSong = songs[index + 1];
      const nextSongElement = document.querySelector(
        `.songlist li:nth-child(${index + 2}) .play-icon`
      );
      playMusic(nextSong, nextSongElement);
    } else {
      // If it's the last song, you might want to loop back to the beginning
      // Or do nothing, depending on your desired behavior
      const firstSong = songs[0];
      const firstSongElement = document.querySelector(
        `.songlist li:nth-child(1) .play-icon`
      );
      playMusic(firstSong, firstSongElement);
    }
  });

  //Add event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("input", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // Event listener for language selection buttons
  document.getElementById("hindiBtn").addEventListener("click", () => {
    currentLanguage = "hindi";
    populateSongList(currentLanguage);
  });

  document.getElementById("bengaliBtn").addEventListener("click", () => {
    currentLanguage = "bengali";
    populateSongList(currentLanguage);
  });
}

document.addEventListener("DOMContentLoaded", domContentLoadedHandler);
// Attach the event listener to the document
// script.js & songs.json line by line explanation (Bangla)

// songs.json
// Ei file ta ekta JSON object, ja shob language er song list array akare rakhe.
// Example:
// {
//   "hindi": ["song1.mp3", "song2.mp3", ...],
//   "bengali": ["song1.mp3", ...],
//   ...
// }
// script.js ei file theke gaan load kore.

// --- script.js ---

// 1. secondsToMinutesSeconds(seconds)
//    - Input: Second (shongkha)
//    - Kaj: Second ke "Minute:Second" format e rupantor kore (jemon 65 -> 01:05)
//    - Output: String ("Minute:Second")

// 2. async function getSongs(language)
//    - Input: language (jemon "hindi")
//    - Kaj: songs.json file theke data fetch kore
//    - Output: nirdisht bhashar mp3 file er nam er array

// 3. async function domContentLoadedHandler()
//    - Page load hole ei function ti chale
//    - Bibhinno variable set kore (playsong, songs, currentSong, itiadhi)
//    - Bhitore:
//      a) populateSongList(language):
//         - getSongs(language) call kore nirdisht bhashar gaan load kore
//         - Gaan list UI-te dekhay
//         - Gaan na thakle "No songs available" dekhay
//      b) playMusic(track, playIcon):
//         - Nirdisht gaan play kore, UI update kore
//      c) Gaan list e click korle gaan play hoy
//      d) Card e click korle bhasha change hoy, notun gaan load hoy
//      e) Play/pause, next, previous, seekbar, volume itiadhi event handle kore
//      f) Bhasha button e click korle populateSongList() call hoy

// 4. document.addEventListener("DOMContentLoaded", domContentLoadedHandler)
//    - Page puro load hole domContentLoadedHandler() function ti chalu hoy

// Songshope:
// songs.json theke nirdisht bhashar gaan load kore, script.js UI-te dekhay o play kore, ebong user er shob interaction (play, pause, bhasha change, itiadhi) handle kore.

// Jodi nirdisht kono line er bekkha dorkar hoy, niche comment e likhe rakhte paro!

// --- Songs A-Z Sorting Logic Explanation ---
// populateSongList(language) function e:
// songs = await getSongs(language); // songs.json theke song list niye ashe
// songs.sort((a, b) => a.localeCompare(b)); // song list ke alphabetically (A-Z) sort kore
//
// localeCompare() method ta string compare kore, jate Bangla/English shob alphabetic order e thake.
//
// Ekhon UI te je song list show hobe, ta hobe always A-Z sorted.
