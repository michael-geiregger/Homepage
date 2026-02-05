// Eventbrite API Integration
const EVENTBRITE_TOKEN = '74J4OZ2PSRX4ZPBQKZWQ';
const ORGANIZATION_ID = '16365027883';

/**
 * Fetch events from Eventbrite API
 */
export async function fetchEventbriteEvents() {
  try {
    const response = await fetch(
      `https://www.eventbriteapi.com/v3/organizers/${ORGANIZATION_ID}/events/?status=live&order_by=start_asc`,
      {
        headers: {
          'Authorization': `Bearer ${EVENTBRITE_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Eventbrite API error: ${response.status}`);
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching Eventbrite events:', error);
    return [];
  }
}

/**
 * Format date to German locale
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time to German locale
 */
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Create event card HTML
 */
function createEventCard(event) {
  const startDate = formatDate(event.start.local);
  const startTime = formatTime(event.start.local);
  const endTime = formatTime(event.end.local);

  // Extract image URL (use logo or fallback)
  const imageUrl = event.logo?.original?.url || event.logo?.url || '';

  // Check if event is online
  const isOnline = event.online_event || false;
  const location = isOnline ? 'Online Event' : (event.venue?.name || 'Ort wird bekannt gegeben');

  return `
    <div class="event-card" style="
      background: var(--white);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    " onclick="window.open('${event.url}', '_blank')">
      ${imageUrl ? `
        <div style="
          width: 100%;
          height: 200px;
          background-image: url('${imageUrl}');
          background-size: cover;
          background-position: center;
        "></div>
      ` : ''}
      
      <div style="padding: 2rem;">
        <div style="
          display: inline-block;
          background: rgba(140, 123, 108, 0.1);
          color: var(--accent-color);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        ">
          ${isOnline ? '🌐 Online' : '📍 ' + location}
        </div>
        
        <h3 style="
          font-family: var(--font-serif);
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        ">${event.name.text}</h3>
        
        <div style="
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${startDate}</span>
        </div>
        
        <div style="
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${startTime} - ${endTime} Uhr</span>
        </div>
        
        ${event.summary ? `
          <p style="
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 1.5rem;
          ">${event.summary}</p>
        ` : ''}
        
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-color);
          font-weight: 600;
          font-size: 0.95rem;
        ">
          <span>Tickets sichern</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render events to container
 */
export async function renderEvents(containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  // Show loading state
  container.innerHTML = `
    <div style="text-align: center; padding: 4rem 0;">
      <div style="
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 3px solid rgba(140, 123, 108, 0.2);
        border-top-color: var(--accent-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <p style="margin-top: 1rem; color: var(--text-secondary);">Events werden geladen...</p>
    </div>
  `;

  // Fetch events
  const events = await fetchEventbriteEvents();

  // Check if events exist
  if (events.length === 0) {
    container.innerHTML = `
      <div style="
        text-align: center;
        padding: 4rem 2rem;
        background: rgba(140, 123, 108, 0.05);
        border-radius: 8px;
      ">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" 
          style="color: var(--accent-color); margin-bottom: 1.5rem;">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 1rem;">
          Aktuell keine Events geplant
        </h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
          Neue Termine werden bald bekannt gegeben. Melde dich für den Newsletter an, um nichts zu verpassen!
        </p>
        <a href="https://www.eventbrite.de/o/16365027883" target="_blank" rel="noopener noreferrer"
          class="btn btn-outline">
          Eventbrite-Profil besuchen →
        </a>
      </div>
    `;
    return;
  }

  // Render events in grid
  container.innerHTML = `
    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    ">
      ${events.map(event => createEventCard(event)).join('')}
    </div>
  `;
}

// Add CSS animation for loading spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .event-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important;
  }
`;
document.head.appendChild(style);
