const header = document.querySelector("header");
const footer = document.querySelector("footer");

//document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="./styles/header-footer.css">`);
    
    header.innerHTML = `
        <section id="header-logo-section">
          <a href="#" class="logo">Star Wars API</a>
          
          <span id="status">ONLINE</span>
      </section>

      <nav id="category_nav">
          <a href="index.html">Home</a>  | 
          <a href="list.html?category=people">People</a>  | 
          <a href="list.html?category=planets">Planets</a>  | 
          <a href="list.html?category=starships">Starships</a>  | 
          <a href="list.html?category=vehicles">Vehicles</a>  | 
          <a href="list.html?category=species">Species</a>  | 
          <a href="list.html?category=films">Films</a>  |
          <a href="favorites.html">Favorites</a>  
      </nav>`;

    footer.innerHTML = `
        <p>Chas Academy - Norrland 2026</p>`;

    statusIcon = document.querySelector("#status");
    updateConnected(); 

});

let statusIcon;

function updateConnected() {
    if (!statusIcon) return;

    if (navigator.onLine) {
        statusIcon.textContent = "ONLINE";
        document.body.className = "online";
    } else {
        statusIcon.textContent = "OFFLINE";
        document.body.className = "offline";
    }
}

window.addEventListener("load", () => {
    statusIcon = document.querySelector("#status");
    updateConnected();
});

window.addEventListener("online", updateConnected);
window.addEventListener("offline", updateConnected);
