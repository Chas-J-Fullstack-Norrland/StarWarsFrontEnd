const header = document.querySelector("header");
const footer = document.querySelector("footer");


window.addEventListener("load", () => {
    document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="./styles/header-footer.css">`);
    
    header.innerHTML = `
        <section id="user-section">
          <a href="index.html" class="logo">Star Wars API</a>
          <div class="user-controls">
            <span id="current-user">no-user</span>
            <label for="user" class="visually-hidden">Username</label>
            <input type="text" id="user" name="user"/>
            <button id="user-button">Set User</button>
            <span id="status">Online</span>
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