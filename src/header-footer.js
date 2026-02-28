const header = document.querySelector("header");
const footer = document.querySelector("footer");


window.addEventListener("load", () => {
    document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="./styles/header-footer.css">`);
    
    header.innerHTML = `
        <section id="user-section">
          <a href="index.html" class="logo">
          <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="#ffe81f" stroke-width="2" stroke-dasharray="10 5" />
            <path d="M50 20L80 75H20L50 20Z" fill="url(#glowGradient)" />
            <circle cx="50" cy="55" r="8" fill="#ffe81f">
            <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
            </circle>
            <defs>
            <radialGradient id="glowGradient">
                <stop offset="0%" stop-color="#ffe81f" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#ffe81f" stop-opacity="0.1" />
            </radialGradient>
            </defs>
        </svg>
        <span class="logo-text">SW-ARCHIVE</span></a>
          <div class="user-controls">
            <span id="current-user">no-user</span>
            <label for="user" class="visually-hidden">Username</label>
            <input type="text" id="user" name="user"/>
            <button id="user-button">Set User</button>
            <span id="status" role="alert">Online</span>
          </div>
      </section>

    <nav aria-label="Main Navigation">
        <ul id="category_nav">
        <li><a href="index.html">Home</a></li>
        <li><a href="list.html?category=people">People</a></li>
        <li><a href="list.html?category=planets">Planets</a></li>
        <li><a href="list.html?category=starships">Starships</a></li>
        <li><a href="list.html?category=vehicles">Vehicles</a></li>
        <li><a href="list.html?category=species">Species</a></li>
        <li><a href="list.html?category=films">Films</a></li>
        <li><a href="favorites.html">Favorites</a></li>
        </ul>
    </nav>`;

    footer.innerHTML = `
        <p>Chas Academy - Norrland 2026</p>`;

});

function updateOnlineStatus() {
  const statusElement = document.getElementById("status");
  if (!statusElement) return;

  if (navigator.onLine) {
    statusElement.textContent = "Online";
    statusElement.classList.remove("offline");
    statusElement.classList.add("online");
  } else {
    statusElement.textContent = "Offline";
    statusElement.classList.remove("online");
    statusElement.classList.add("offline");
  }
}

// Lyssna på förändringar
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Kör en check direkt när sidan laddas
window.addEventListener('load', updateOnlineStatus);