export function initCookieConsent() {
    const cookieBanner = document.createElement('div');
    cookieBanner.id = 'cookie-banner';
    cookieBanner.innerHTML = `
    <div class="cookie-content">
      <p>Wir nutzen Cookies und externe Inhalte (Spotify, YouTube), um dir das beste Erlebnis zu bieten. 
      Indem du fortfährst, stimmst du der Nutzung zu. <a href="/legal.html#datenschutz">Datenschutz</a></p>
      <button id="accept-cookies" class="btn btn-primary btn-sm">Akzeptieren</button>
    </div>
  `;

    // Check if already accepted
    if (!localStorage.getItem('cookieConsent')) {
        document.body.appendChild(cookieBanner);
        // Block scrolling or interaction? No, usually just banner at bottom.
    } else {
        loadExternalContent();
    }

    // Handle Accept
    document.addEventListener('click', (e) => {
        if (e.target.id === 'accept-cookies') {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.remove();
            loadExternalContent();
        }
    });
}

function loadExternalContent() {
    // Find all blocked iframes and load them
    const blockedFrames = document.querySelectorAll('iframe[data-src]');
    blockedFrames.forEach(frame => {
        frame.src = frame.getAttribute('data-src');
        frame.removeAttribute('data-src');
    });
}
