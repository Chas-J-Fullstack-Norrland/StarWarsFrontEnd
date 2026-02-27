import { fetchRequest } from "./api/api";
import  {objectContainsSearch,applyFilters,extractFilterableKeys,detectFieldType,sortByKey} from "./filtersearchlist.js"
import "./styles/listview.css";
import "./styles/favorites.css";
import {
   isFavorite,
  toggleFavorite,
} from "./favoritesStorage.js";

let currentData = [];
let currentCategory = "";
let viewState = {
    search: "",
    filters: [],
    sortKey: null,
    sortDir: "asc"
};

const categoryHeader = document.querySelector("h1");

window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    renderList(urlParams.get("category"), "list-section");
});

function renderList(endpoint, containerId) {
    const container = document.getElementById(containerId);
    currentCategory = endpoint;

    fetchRequest(endpoint)
        .then(data => {
            currentData = data; // store original data
            const keys = extractFilterableKeys(data);
            generateFilterDropdown(keys);
            generateSortDropdown(keys);
            renderData(currentData, containerId);
        })
        .catch(error => {
            console.error(`Error fetching ${endpoint}:`, error);
            container.innerHTML = "<p>Failed to load data.</p>";
        });
}


function renderData(data, containerId) {
    const container = document.getElementById(containerId);
    const listItems = mapitems(data, currentCategory);
    container.innerHTML = `<ul class="listlayout">${listItems}</ul>`;
    attachFavoriteButtons(container, data, currentCategory);
}


function updateView() {
    // Start from the original currentData (API order)
    let result = [...currentData];

    // 1️⃣ Apply search
    if (viewState.search) {
        result = result.filter(item =>
            objectContainsSearch(item, viewState.search)
        );
    }

    // 2️⃣ Apply filters
    if (viewState.filters.length) {
        result = applyFilters(viewState.filters, result);
    }

    // 3️⃣ Apply sorting
    if (viewState.sortKey) {
        // Sort by selected key and direction
        result = sortByKey(
            viewState.sortKey,
            result,
            viewState.sortDir
        );
    } else {
        // Default order: reverse if descending
        if (viewState.sortDir === "desc") {
            result.reverse(); // reverse the API order
        }
    }

    // 4️⃣ Render final list
    renderData(result, "list-section");
    renderActiveFilters();
}

    document.getElementById("searchInput")
    .addEventListener("input", (e) => {

        viewState.search = e.target.value;
        updateView();
    });

    document.getElementById("filterType")
    .addEventListener("change", (e) => {
        const operatorSelect = document.getElementById("filterOperator");
        operatorSelect.style.display =
            e.target.value === "compare" ? "inline-block" : "none";
    });
    document.getElementById("clearFilters")
    .addEventListener("click", () => {
        viewState.filters = [];
        viewState.search = "";
        viewState.sortKey = null;
        updateView();
    });

    document.getElementById("filterKey")
    .addEventListener("change", (e) => {

        const key = e.target.value;
        if (!key) return;

        const type = detectFieldType(currentData, key);

        const filterTypeSelect = document.getElementById("filterType");
        const compareOption = Array.from(filterTypeSelect.options)
            .find(opt => opt.value === "compare");

        if (type === "number") {
        // Numeric → show compare
        compareOption.style.display = "block";
    } else {
        // String → hide compare
        compareOption.style.display = "none";

        // If the current type was compare, switch to contains
        if (filterTypeSelect.value === "compare") {
            filterTypeSelect.value = "contains";
        }

    }
});

function renderActiveFilters() {
    const container = document.getElementById("activeFilters");
    container.innerHTML = ""; // clear previous buttons

    if (viewState.filters.length === 0) return; // nothing to show

    viewState.filters.forEach((filter, index) => {
        const button = document.createElement("button");
        button.className = "active-filter-btn";
        button.textContent = `${filter.key} ${filter.type}${filter.type === "compare" ? ` ${filter.operator}` : ""}: ${filter.value} ✕`;

        // Clicking removes this filter
        button.addEventListener("click", () => {
            viewState.filters.splice(index, 1);
            updateView();          // re-render the list
            renderActiveFilters(); // update buttons
        });

        container.appendChild(button);
    });
}



const addFilterButton = document.getElementById("addFilterBtn");
const filterform = document.getElementById("filterform");

filterform.addEventListener("submit", (event) => {
    event.preventDefault();

    addFilterButton.click();
});

addFilterButton.addEventListener("click", () => {
    const key = document.getElementById("filterKey").value;
    const type = document.getElementById("filterType").value;
    const operator = document.getElementById("filterOperator").value;
    const value = document.getElementById("filterValue").value.trim();

    if (!key || !type || !value) {
        alert("Please select a key and type, and enter a value.");
        return;
    }

    // Build the filter object
    const filter = { key, type, operator, value };

    // Add to viewState
    viewState.filters.push(filter);

    // Apply filters, search, and sorting
    updateView();

    // Clear the value input for next filter
    document.getElementById("filterValue").value = "";
});

document.getElementById("sortSelect").addEventListener("change", (e) => {
    viewState.sortKey = e.target.value;
    updateView();
});

document.getElementById("sortDirection").addEventListener("change", (e) => {
    viewState.sortDir = e.target.value;
    console.log("Direction:", viewState.sortDir);
    console.log("Key:", viewState.sortKey);
    updateView();
});


function generateFilterDropdown(keys) {
    const select = document.getElementById("filterKey");
    select.innerHTML = '<option value="">Filter By...</option>';

    keys.forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        select.appendChild(option);
    });
}

function generateSortDropdown(keys) {
    const select = document.getElementById("sortSelect");

    keys.forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        select.appendChild(option);
    });
}


function mapitems(data,endpoint) {
    categoryHeader.innerText = endpoint.charAt(0).toUpperCase() + endpoint.slice(1);;

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
        return `<li class="listlayout-item">
                    <article class="list-card">
                        <a href="view.html?category=films&id=${id}" class="card-link">
                            <figure class="card-figure card-image"></figure>
                            <div class="card-body">
                                <h2 class="card-title">${item.title}</h2>
                                <p class="card-data">Episode: ${item.episode_id}</p>
                                <p class="card-data">Release Date: ${item.release_date}</p>
                                <p class="card-data">Director: ${item.director}</p>
                                <p class="card-data">Producer: ${item.producer}</p>
                            </div>
                        </a>
                    </article>
                </li>`
    }).join("");
}

function formatSpeciesData(data) {

    return data.map(item => {
        const id = translateURL(item)
        return `<li class="listlayout-item">
                    <article class="list-card">
                        <a href="view.html?category=species&id=${id}" class="card-link">
                            <figure class="card-figure card-image"></figure>
                            <div class="card-body">
                                <h2 class="card-title">${item.name}</h2>
                                <p class="card-data">Classification: ${item.classification}</p>
                                <p class="card-data">Designation: ${item.designation}</p>
                                <p class="card-data">Average Height: ${item.average_height}cm</p>
                                <p class="card-data">Average Lifespan: ${item.average_lifespan} years</p>
                                <p class="card-data">Language: ${item.language}</p>
                            </div>
                        </a>
                    </article>
                </li>`
    }).join("");
}


function formatVehicleData(data) {
 
    return data.map(item => {
        const id = translateURL(item)
        return `<li class="listlayout-item">
                    <article class="list-card">
                        <a href="view.html?category=vehicles&id=${id}" class="card-link">
                            <figure class="card-figure card-image"></figure>
                            <div class="card-body">
                                <h2 class="card-title">${item.name}</h2>
                                <p class="card-data">Model: ${item.model}</p>
                                <p class="card-data">Manufacturer: ${item.manufacturer}</p>
                                <p class="card-data">Length: ${item.length}m</p>
                                <p class="card-data">Crew: ${item.crew}</p>
                                <p class="card-data">Vehicle Class: ${item.vehicle_class}</p>
                            </div>
                        </a>
                    </article>
                </li>`
    }).join("");
}

function formatStarshipData(data) {

    return data.map(item => {
        const id = translateURL(item)
        return `<li class="listlayout-item">
                    <article class="list-card">
                        <a href="view.html?category=starships&id=${id}" class="card-link">
                            <figure class="card-figure card-image"></figure>
                            <div class="card-body">
                                <h2 class="card-title">${item.name}</h2>
                                <p class="card-data">Model: ${item.model}</p>
                                <p class="card-data">Manufacturer: ${item.manufacturer}</p>
                                <p class="card-data">Length: ${item.length}m</p>
                                <p class="card-data">Crew: ${item.crew}</p>
                                <p class="card-data">Starship Class: ${item.starship_class}</p>
                                <p class="card-data">Hyperdrive Rating: ${item.hyperdrive_rating}</p>
                            </div>
                        </a>
                    </article>
                </li>`
    }).join("");
}


function formatPlanetsData(data) {

    return data.map(item => {
        const id = translateURL(item)
        
        return `<li class="listlayout-item">
                    <article class="list-card">
                        <a href="view.html?category=planets&id=${id}" class="card-link">
                            <figure class="card-figure card-image"></figure>
                            <div class="card-body">
                                <h2 class="card-title">${item.name}</h2>
                                <p class="card-data">Diameter: ${item.diameter}km</p>
                                <p class="card-data">Gravity: ${item.gravity}</p>
                                <p class="card-data">Climate: ${item.climate}</p>
                                <p class="card-data">Day-Length: ${item.rotation_period} hours</p>
                                <p class="card-data">Population: ${item.population}</p>
                            </div>
                        </a>
                    </article>
                </li>`
    }).join("");
}


function formatPeopleData(data) {
 
    return data.map(item => {
    const id = translateURL(item)

        return `<li class="listlayout-item">
                    <article class="list-card">
                        <a href="view.html?category=people&id=${id}" class="card-link">
                            <figure class="card-figure card-image"></figure>
                            <div class="card-body">
                                <h2 class="card-title">${item.name}</h2>
                                <p class="card-data">Height: ${item.height}cm</p>
                                <p class="card-data">Mass: ${item.mass}kg</p>
                                <p class="card-data">birth year: ${item.birth_year}</p>
                            </div>
                        </a>
                    </article>
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



    card.appendChild(button);
  });
}
