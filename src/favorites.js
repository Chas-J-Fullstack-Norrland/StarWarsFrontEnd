import { getAllFavorites, toggleFavorite } from "./favoritesStorage.js";
import "./styles/style.css";
import "./styles/listview.css";
import "./styles/favorites.css";

window.addEventListener("load", () => {
  renderAllFavorites("favorites-container");
});

function renderAllFavorites(containerId) {
  const container = document.getElementById(containerId);
  const allFavorites = getAllFavorites();
  const categories = Object.keys(allFavorites);

  if (categories.length === 0 || categories.every(cat => allFavorites[cat].length === 0)) {
    container.innerHTML = `
      <div class="no-favorites">
        <h1>No Favorites Yet</h1>
        <p>Browse categories and add items to your favorites!</p>
        <a href="index.html" class="back-link">Back to Home</a>
      </div>
    `;
    return;
  }

  let html = "";

  categories.forEach((category) => {
    const items = allFavorites[category];
    if (items.length === 0) return;  // Fixed: added return statement

    html += `
      <section class="favorites-category list-section">
        <h2 class="category-title">${capitalizeFirst(category)}</h2>
        <ul class="listlayout">
          ${formatFavoriteItems(items, category)}
        </ul>
      </section>
    `;
  });

  container.innerHTML = html;
  attachRemoveButtons(container, allFavorites);
}

function formatFavoriteItems(items, category) {
  return items.map((item, index) => {
    const name = item.name || item.title || "Unknown";
    const details = getItemDetails(item, category);
    
    const url = item.url;
    console.log(url);
    const parts = url.split("/").filter(Boolean);
    const urlID = parts[parts.length - 1];

    // Fixed: added return statement with HTML
    return `
      <li class="listlayout-item">
        <article class="list-card favorite-card" data-category="${category}" data-index="${index}">
          <a href="view.html?category=${category}&id=${urlID}" class="card-link">
          <figure class="card-figure card-image"></figure>
          <div class="card-body">
            <h3 class="card-title">${name}</h3>
            ${details}

          </div>
          </a>
          <button class="favorite-button is-favorite remove-favorite-btn">
            ★ Remove Favorite
          </button>
        </article>
      </li>
    `;
  }).join("");
}

function getItemDetails(item, category) {
  switch (category) {
    case "films":
      return `
        <p class="card-data">Episode: ${item.episode_id}</p>
        <p class="card-data">Director: ${item.director}</p>
        <p class="card-data">Release Date: ${item.release_date}</p>
      `;
    case "people":
      return `
        <p class="card-data">Height: ${item.height}cm</p>
        <p class="card-data">Mass: ${item.mass}kg</p>
        <p class="card-data">Birth Year: ${item.birth_year}</p>
      `;
    case "planets":
      return `
        <p class="card-data">Climate: ${item.climate}</p>
        <p class="card-data">Population: ${item.population}</p>
        <p class="card-data">Diameter: ${item.diameter}km</p>
      `;
    case "starships":
      return `
        <p class="card-data">Model: ${item.model}</p>
        <p class="card-data">Manufacturer: ${item.manufacturer}</p>
        <p class="card-data">Class: ${item.starship_class}</p>
      `;
    case "vehicles":
      return `
        <p class="card-data">Model: ${item.model}</p>
        <p class="card-data">Manufacturer: ${item.manufacturer}</p>
        <p class="card-data">Class: ${item.vehicle_class}</p>
      `;
    case "species":
      return `
        <p class="card-data">Classification: ${item.classification}</p>
        <p class="card-data">Language: ${item.language}</p>
        <p class="card-data">Average Lifespan: ${item.average_lifespan} years</p>
      `;
    default:
      return "";
  }
}

function attachRemoveButtons(container, allFavorites) {
  const buttons = container.querySelectorAll(".remove-favorite-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".favorite-card");
      const category = card.dataset.category;
      const index = parseInt(card.dataset.index, 10);
      const item = allFavorites[category][index];

      toggleFavorite(category, item);
      renderAllFavorites("favorites-container");
    });
  });
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}