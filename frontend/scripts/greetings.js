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

const VISIT_KEY = 'greeting_shown_session';

function isNewVisitor() {
    const hasSeenGreeting = sessionStorage.getItem(VISIT_KEY);
    return !hasSeenGreeting;
}

function markAsVisited() {
    sessionStorage.setItem(VISIT_KEY, 'true');
}

function getRandomMessage(messagesArray) {
    return messagesArray[Math.floor(Math.random() * messagesArray.length)];
}

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

function createDateTimeFooter() {
    const greeting = document.querySelector('.greeting');
    if (!greeting) return;
    
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

function updateGreetingContent(hour) {
    const { greeting, message } = getGreetingContent(hour);
    
    const greetingH1 = document.querySelector('.greeting h1');
    const greetingB = document.querySelector('.greeting b');
    
    if (greetingH1) greetingH1.textContent = greeting;
    if (greetingB) greetingB.textContent = message;
    
    // Add dat/time footer
    createDateTimeFooter();
}

function setupGreetingPosition() {
    const greetRight = document.querySelector('.greetright');
    if (!greetRight) return;
    
    greetRight.style.position = 'fixed';
    greetRight.style.top = '80px';
    greetRight.style.right = '0px';
    greetRight.style.zIndex = '9999';
    greetRight.style.pointerEvents = 'auto';
    
    document.body.style.overflowX = 'hidden';
    
    greetRight.style.maxWidth = '340px';
    greetRight.style.width = '340px';
    greetRight.style.boxSizing = 'border-box';
}

function slideInFromRight() {
    const greetRight = document.querySelector('.greetright');
    if (!greetRight) return;
    
    setupGreetingPosition();
    
    greetRight.style.transform = 'translateX(100%)';
    greetRight.style.opacity = '0';
    greetRight.style.display = 'block';
    greetRight.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-out';
    
    greetRight.style.transformOrigin = 'right center';
    
    setTimeout(() => {
        greetRight.style.transform = 'translateX(0) scale(1)';
        greetRight.style.opacity = '1';
    }, 100);
    
    greetRight.addEventListener('mouseenter', () => {
        greetRight.style.transform = 'translateX(0) scale(1.02)';
    });
    
    greetRight.addEventListener('mouseleave', () => {
        greetRight.style.transform = 'translateX(0) scale(1)';
    });
}

function slideOutToRight() {
    const greetRight = document.querySelector('.greetright');
    if (!greetRight) return;
    
    greetRight.style.transition = 'transform 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 0.5s ease-out';
    greetRight.style.transform = 'translateX(100%) scale(0.95)';
    greetRight.style.opacity = '0';
    
    setTimeout(() => {
        greetRight.style.display = 'none';
        document.body.style.overflowX = '';
    }, 500);
}

function addPulseAnimation() {
    const greeting = document.querySelector('.greeting');
    if (!greeting) return;
    
    greeting.style.animation = 'gentle-pulse 2s ease-in-out infinite alternate';
    
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

async function showGreeting() {
    if (!isNewVisitor()) {
        return; 
    }
    
    try {
        const response = await fetch('https://api.ipgeolocation.io/v2/timezone?apiKey=7a256457de5f429ea4f1b6daaace8317&tz=Asia/Manila');
        const data = await response.json();
        
        const currentTime = new Date(data.date_time);
        const currentHour = currentTime.getHours();
        
        updateGreetingContent(currentHour);
        
        addPulseAnimation();
        
        slideInFromRight();
        
        markAsVisited();
        
        setTimeout(() => {
            slideOutToRight();
        }, 5000);
        
    } catch (error) {
        console.error('Error fetching timezone data:', error);
        
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

function setupCloseButton() {
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.style.cursor = 'pointer';
        
        closeButton.addEventListener('click', () => {
            slideOutToRight();
        });
    }
}

function setupScrollFollowing() {
    let scrollTimer = null;
    
    window.addEventListener('scroll', () => {
        const greetRight = document.querySelector('.greetright');
        if (!greetRight || greetRight.style.display === 'none') return;
        
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        
        greetRight.style.transition = 'transform 0.1s ease-out';
        
        scrollTimer = setTimeout(() => {
            if (greetRight.style.display !== 'none') {
                greetRight.style.transition = 'transform 0.3s ease-out';
            }
        }, 150);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const greetRight = document.querySelector('.greetright');
    if (greetRight) {
        greetRight.style.display = 'none';
    }
    
    setupCloseButton();
    setupScrollFollowing();
    
    setTimeout(() => {
        showGreeting();
    }, 1000);
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const greetRight = document.querySelector('.greetright');
        if (greetRight && greetRight.style.display !== 'none') {
            setupGreetingPosition();
        }
    }
});