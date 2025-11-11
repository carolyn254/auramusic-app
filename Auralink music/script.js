
const CLIENT_ID = "54b4f073"; // Jemendo API Key
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");
const trendingList = document.getElementById("trendingList");
const audioPlayer = document.getElementById("audioPlayer");
const nowPlaying = document.getElementById("nowPlaying");
const statusDiv = document.getElementById("status");
const miniPlayer = document.getElementById("miniPlayer");
const playerCover = document.getElementById("playerCover");
const playerTitle = document.getElementById("playerTitle");
const downloadBtn = document.getElementById("downloadBtn");
const playPauseBtn = document.getElementById("playPause");
const collapseBtn = document.getElementById("collapseBtn");

let currentTrack = null;

// Load trending songs
window.addEventListener("DOMContentLoaded", () => loadTrendingSongs());

// Search
let searchTimeout;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  const query = searchInput.value.trim();
  if (query.length === 0) {
    resultsContainer.innerHTML = "";
    return;
  }
  searchTimeout = setTimeout(() => searchSongs(query), 700);
});

// Search Songs
async function searchSongs(query) {
  statusDiv.textContent = "🎵 Searching...";
  try {
    const res = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=jsonpretty&limit=12&search=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    if (data.results.length === 0) {
      statusDiv.textContent = "❌ No results found.";
      return;
    }
    statusDiv.textContent = "";
    displaySongs(data.results, resultsContainer);
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "⚠️ Error fetching songs.";
  }
}

// Trending Songs
async function loadTrendingSongs() {
  trendingList.innerHTML = "<p>🔥 Loading trending songs...</p>";
  try {
    const res = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=jsonpretty&limit=8&order=popularity_total`
    );
    const data = await res.json();
    displaySongs(data.results, trendingList);
  } catch (err) {
    trendingList.innerHTML = "<p>⚠️ Error loading trending songs.</p>";
  }
}

// Display Songs
function displaySongs(songs, container) {
  container.innerHTML = songs
    .map(
      (song) => `
      <div class="song-card" onclick="playSong('${song.audio}', '${song.name}', '${song.artist_name}', '${song.album_image}')">
        <img src="${song.album_image}" alt="${song.name}">
        <h4>${song.name}</h4>
        <p>${song.artist_name}</p>
      </div>
    `
    )
    .join("");
}

// Play Song
window.playSong = function (url, title, artist, cover) {
  audioPlayer.src = url;
  audioPlayer.play();
  nowPlaying.textContent = `🎶 Now Playing: ${title} - ${artist}`;
  playerTitle.textContent = `${title} - ${artist}`;
  playerCover.src = cover;
  downloadBtn.href = url;
  miniPlayer.classList.remove("collapsed");
  playPauseBtn.textContent = "⏸";
  currentTrack = url;
};

// Mini player controls
playPauseBtn.addEventListener("click", () => {
  if (!currentTrack) return;
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.textContent = "⏸";
  } else {
    audioPlayer.pause();
    playPauseBtn.textContent = "▶";
  }
});

collapseBtn.addEventListener("click", () => {
  miniPlayer.classList.toggle("collapsed");
});

// Splash Screen Control
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  }, 3500);
});
