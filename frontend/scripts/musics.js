// Toggle Add Music Form
//function toggleAddMusicForm() {
//    const form = document.getElementById('addMusicForm');
//    form.style.display = form.style.display === 'none' ? 'block' : 'none';
//}

// Add New Music
//function addNewMusic() {
//    // Get form values
//    const title = document.getElementById('songTitle').value;
//    const artist = document.getElementById('artist').value;
//    const album = document.getElementById('album').value;
//    const duration = document.getElementById('duration').value;
//    const coverUrl = document.getElementById('coverUrl').value || './images/cas.png'; 
//
//    // Find the artist section or create new one
//    let artistSection = findOrCreateArtistSection(artist);
//    
//    // Get the song grid
//    const songGrid = artistSection.querySelector('.song-grid');
//    
//    // Get the current number of songs
//    const songCount = songGrid.querySelectorAll('.song-item').length;
//
//    // Create new song item
//    const songItem = createSongItem(songCount + 1, title, artist, album, duration, coverUrl);
//    
//    // Add the new song to the grid
//    songGrid.appendChild(songItem);
//
//    // Clear form and hide it
//    clearForm();
//    toggleAddMusicForm();
//}

// Find or Create Artist Section
//function findOrCreateArtistSection(artistName) {
//    let artistSection = Array.from(document.querySelectorAll('.artist-section')).find(section => 
//        section.querySelector('.favtext h1').textContent.trim() === artistName
//    );
//
//    if (!artistSection) {
//        // Create new artist section
//        artistSection = document.createElement('div');
//        artistSection.className = 'artist-section';
//        artistSection.innerHTML = `
//            <div class="favtext">
//                <h1>${artistName}</h1>
//                <b class="favdesc">Songs</b>
//            </div>
//            <div class="whiteline"></div>
//            <div class="song-grid"></div>
//        `;
//
//        // Add to artists container
//        document.querySelector('.artists-container').appendChild(artistSection);
//    }
//
//    return artistSection;
//}

// Create Song Item
//function createSongItem(number, title, artist, album, duration, coverUrl) {
//    const div = document.createElement('div');
//    div.className = 'song-item';
//    const songId = `song-${artist.replace(/\s+/g, '-')}-${title.replace(/\s+/g, '-')}`.toLowerCase();
//    div.innerHTML = `
//        <div class="song-number">${number}</div>
//        <div class="song-image-container">
//            <img src="${coverUrl}" alt="${title}" class="song-image"/>
//            <div class="play-button" onclick="playSong('${songId}')">
//                <i class="fa-solid fa-play"></i>
//            </div>
//        </div>
//        <div class="song-info">
//            <div class="song-name">${title}</div>
//            <div class="song-artist">${artist}</div>
//        </div>
//        <div class="song-album">${album}</div>
//        <div class="song-duration">${duration}</div>
//        <div class="music-visualizer">
//            <div class="music-bar"></div>
//            <div class="music-bar"></div>
//            <div class="music-bar"></div>
//            <div class="music-bar"></div>
//        </div>
//        <audio id="${songId}" src="musics/${artist}/${title}.mp3"></audio>
//    `;
//    return div;
//}

// Clear Form
//function clearForm() {
//    document.getElementById('songTitle').value = '';
//    document.getElementById('artist').value = '';
//    document.getElementById('album').value = '';
//    document.getElementById('duration').value = '';
//    document.getElementById('coverUrl').value = '';
//}

let currentlyPlaying = null;
let isPlaying = false;

function playSong(audioId, audioSrc) {
    const audioElement = document.getElementById(audioId);
    
    if (currentlyPlaying && currentlyPlaying !== audioElement) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
        const oldSongItem = currentlyPlaying.closest('.song-item');
        if (oldSongItem) {
            oldSongItem.classList.remove('playing');
            const oldPlayButton = oldSongItem.querySelector('.play-button i');
            if (oldPlayButton) {
                oldPlayButton.className = 'fa-solid fa-play';
            }
        }
    }

    if (isPlaying && currentlyPlaying === audioElement) {
        audioElement.pause();
        isPlaying = false;
        const songItem = audioElement.closest('.song-item');
        const playButton = songItem.querySelector('.play-button');
        if (playButton) {
            playButton.classList.remove('playing');
            playButton.querySelector('i').className = 'fa-solid fa-play';
            playButton.style.animation = 'none';
            // Force  reflow
            void playButton.offsetWidth;
            playButton.style.animation = '';
        }
        songItem.classList.remove('playing');
    } else {
        audioElement.play();
        isPlaying = true;
        currentlyPlaying = audioElement;
        const songItem = audioElement.closest('.song-item');
        const playButton = songItem.querySelector('.play-button');
        if (playButton) {
            playButton.classList.add('playing');
            playButton.querySelector('i').className = 'fa-solid fa-pause';
            playButton.style.animation = 'none';
            void playButton.offsetWidth;
            playButton.style.animation = '';
        }
        songItem.classList.add('playing');
    }

    audioElement.ontimeupdate = function() {
        const songItem = this.closest('.song-item');
        if (songItem) {
            const progress = (this.currentTime / this.duration) * 100;
            songItem.style.setProperty('--progress', progress + '%');
        }
    };

    audioElement.onended = function() {
        isPlaying = false;
        const songItem = this.closest('.song-item');
        if (songItem) {
            songItem.style.setProperty('--progress', '0%');
            const playButton = songItem.querySelector('.play-button');
            if (playButton) {
                playButton.classList.remove('playing');
                playButton.querySelector('i').className = 'fa-solid fa-play';
            }
            songItem.classList.remove('playing');
        }
    };
}

// Play all songs in a section
//function playAllSongs(artistId) {
//    const artistSection = document.querySelector(`[data-artist-id="${artistId}"]`);
//    if (!artistSection) return;
//
//    const audioElements = artistSection.querySelectorAll('audio');
//    let currentIndex = 0;
//
//    function playNext() {
//        if (currentIndex < audioElements.length) {
//            const audio = audioElements[currentIndex];
//            audio.play();
//            currentIndex++;
//            audio.onended = playNext;
//        }
//    }
//
//    playNext();
//}