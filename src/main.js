import './styles/style.css'
import './styles/header-footer.css'
import './header-footer.js'  
import { fetchRequest } from "./api/api.js";

let app = document.querySelector('#app');
if (app) {
  app.innerHTML = `
    <div class="home-container">
      <div class="home-hero">
        <h1 class="glow-text">STAR WARS DATA BANK</h1>
        <p class="subtitle">Search the galactic archives</p>
      </div>

      <section class="search-module">
        <div class="search-controls">
          <select id="search-category" class="search-select">
            <option value="people">People</option>
            <option value="planets">Planets</option>
            <option value="films">Films</option>
            <option value="starships">Starships</option>
            <option value="vehicles">Vehicles</option>
            <option value="species">Species</option>
          </select>
          <input type="text" id="search-input" placeholder="Enter name..." class="search-input" />
          <button id="search-button" class="search-btn">Search</button>
        </div>
        
        <div id="search-results-container" class="search-results-box">
             <ul id="search-results-list" class="listlayout"></ul>
        </div>
      </section>

      <div class="favorites-teaser">
        <p>Review your <a href="favorites.html">Favorites</a>.</p>
      </div>
    </div>
  `;

  setupSearchLogic();
}

function setupSearchLogic() {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");
  const categorySelect = document.getElementById("search-category");
  const resultsList = document.getElementById("search-results-list");

  const performSearch = () => {
    const query = input.value.trim().toLowerCase();
    const category = categorySelect.value;

    if (query.length === 0) return;

    resultsList.innerHTML = "<li class='no-results'>Searching archives...</li>";

    fetchRequest(category)
      .then(allData => {
        const filteredItems = allData.filter(item => {
          const nameToSearch = (item.name || item.title || "").toLowerCase();
          return nameToSearch.includes(query);
        });

        console.log("Matchade items:", filteredItems);
        renderSearchResults(filteredItems, category, resultsList);
      })
      .catch(err => {
        console.error("Sökfel:", err);
        resultsList.innerHTML = "<li class='no-results'>Error contacting the archives.</li>";
      });
  };

  button.addEventListener("click", performSearch);
  input.addEventListener("keypress", (e) => { if (e.key === "Enter") performSearch(); });
}

function renderSearchResults(items, category, container) {
  console.log("Items att rendera:", items);

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = "<li class='no-results'>No matches found in the archives.</li>";
    return;
  }

  if (items.length === 0) {
    container.innerHTML = "<li class='no-results'>No matches found.</li>";
    return;
  }

  container.innerHTML = items.map(item => {
    const urlParts = item.url.split("/").filter(Boolean);
    const id = urlParts[urlParts.length - 1];
    const name = item.name || item.title;

    return `
      <li class="listlayout-item">
        <article class="list-card">
          <a href="view.html?category=${category}&id=${id}" class="card-link">
            <div class="card-body">
              <h3 class="card-title">${name}</h3>
            </div>
          </a>
        </article>
      </li>
    `;
  }).join("");
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL}sw.js`; 

    navigator.serviceWorker.register(swPath)
      .then(reg => console.log('SW registrerad på:', reg.scope))
      .catch(err => console.error('SW-fel:', err));
  });
}