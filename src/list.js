import { fetchRequest } from "./api/api";
import "./styles/listview.css";
import "./styles/favorites.css";
import {
   isFavorite,
  toggleFavorite,
} from "./favoritesStorage.js";

window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get("category"));
    console.log(window.location.search)
    renderList(urlParams.get("category"), "list-section");
});

function renderList(endpoint, containerId) {
    const container = document.getElementById(containerId);
     fetchRequest(endpoint)
        .then(data => {
            const listItems = mapitems(data,endpoint);
            container.innerHTML = `<ul class="listlayout">${listItems}</ul>`;
            attachFavoriteButtons(container, data, endpoint);
        })
        .catch(error => {
            console.error(`Error fetching ${endpoint}:`, error);
            container.innerHTML = "<p>Failed to load data.</p>";
        });
}

function mapitems(data,endpoint) {


switch (endpoint) {
    case "starships":
        return formatStarshipData(data);
    case "planets":
        return formatPlanetsData(data);
    case "people":
        return formatPeopleData(data);
    case "vehicles":
        return formatVehicleData(data);
    case "species":
        return formatSpeciesData(data);
    case "films":
        return formatFilmsData(data);
    default:
        console.warn(`Unknown endpoint: ${endpoint}`);
        return data.map(item => `<li>${item.name}</li>`); // Fallback: just list names, if available. Not for serious production.
    }
}

function formatFilmsData(data) {
    return data.map(item => {
        const id = translateURL(item)
        return `
            <li class="listlayout-item">
                        <a href="view.html?category=films&id=${id}" class="card-link">
                            <span class="card-title">${item.title}</span>
                            <span class="card-arrow">→</span>
                        </a>
                </li>`
    }).join("");
}

function formatSpeciesData(data) {

    return data.map(item => {
        const id = translateURL(item)
        return `<li class="listlayout-item">
                        <a href="view.html?category=species&id=${id}" class="card-link">
                                <span class="card-title">${item.name}</span>
                                <span class="card-arrow">→</span>
                        </a>
                </li>`
    }).join("");
}


function formatVehicleData(data) {
 
    return data.map(item => {
        const id = translateURL(item)
        return `<li class="listlayout-item">
                        <a href="view.html?category=vehicles&id=${id}" class="card-link">
                                <span class="card-title">${item.name}</span>
                                <span class="card-arrow">→</span>
                        </a>
                </li>`
    }).join("");
}

function formatStarshipData(data) {

    return data.map(item => {
        const id = translateURL(item)
        return `<li class="listlayout-item">
                        <a href="view.html?category=starships&id=${id}" class="card-link">
                                <span class="card-title">${item.name}</span>
                                <span class="card-arrow">→</span>
                        </a>
                </li>`
    }).join("");
}


function formatPlanetsData(data) {

    return data.map(item => {
        const id = translateURL(item)
        return `<li class="listlayout-item">
                        <a href="view.html?category=planets&id=${id}" class="card-link">
                                <span class="card-title">${item.name}</span>
                                <span class="card-arrow">→</span>
                        </a>
                </li>`
    }).join("");
}


function formatPeopleData(data) {
 
    return data.map(item => {
    const id = translateURL(item)

        return `<li class="listlayout-item">
                        <a href="view.html?category=people&id=${id}" class="card-link">
                                <span class="card-title">${item.name}</spawn>
                                <span class="card-arrow">→</span>
                        </a>
                </li>`
    }).join("");
}

function translateURL(item){
    const url = new URL(item.url);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[2];
}
  function attachFavoriteButtons(container, data, category) {
  const cards = container.querySelectorAll(".list-card");

  cards.forEach((card, index) => {
    const item = data[index];
    if (!item) return;

    const button = document.createElement("button");
    button.className = "favorite-button";

    const updateButton = () => {
      const favorited = isFavorite(category, item);
      button.textContent = favorited ? "★ Remove Favorite" : "☆ Add to Favorites";
      button.classList.toggle("is-favorite", favorited);
    };

    updateButton();

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(category, item);
      updateButton();
    });

    button.style.width = "auto";
    button.style.margin = "0 1rem";
    card.style.display = "flex";
    card.style.alignItems = "center";

    card.appendChild(button);
  });
}
