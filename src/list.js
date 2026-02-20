import { fetchRequest } from "./api/api";
import "./styles/listview.css";

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
        return `<li class="listlayout-item">
                <article class="list-card">
                    <figure class="card-figure card-image"></figure>
                    <div class="card-body">
                        <h2 class="card-title">${item.title}</h2>
                        <p class="card-data">Episode: ${item.episode_id}</p>
                        <p class="card-data">Release Date: ${item.release_date}</p>
                        <p class="card-data">Director: ${item.director}</p>
                        <p class="card-data">Producer: ${item.producer}</p>
                    </div>
                </article>
            </li>`
    }).join("");
}

function formatSpeciesData(data) {
    return data.map(item => {
        return `<li class="listlayout-item">
                <article class="list-card">
                    <figure class="card-figure card-image"></figure>
                    <div class="card-body">
                        <h2 class="card-title">${item.name}</h2>
                        <p class="card-data">Classification: ${item.classification}</p>
                        <p class="card-data">Designation: ${item.designation}</p>
                        <p class="card-data">Average Height: ${item.average_height}cm</p>
                        <p class="card-data">Average Lifespan: ${item.average_lifespan} years</p>
                        <p class="card-data">Language: ${item.language}</p>
                    </div>
                </article>
            </li>`
    }).join("");
}


function formatVehicleData(data) {
    return data.map(item => {
        return `<li class="listlayout-item">
                <article class="list-card">
                    <figure class="card-figure card-image"></figure>
                    <div class="card-body">
                        <h2 class="card-title">${item.name}</h2>
                        <p class="card-data">Model: ${item.model}</p>
                        <p class="card-data">Manufacturer: ${item.manufacturer}</p>
                        <p class="card-data">Length: ${item.length}m</p>
                        <p class="card-data">Crew: ${item.crew}</p>
                        <p class="card-data">Vehicle Class: ${item.vehicle_class}</p>
                    </div>
                </article>
            </li>`
    }).join("");
}

function formatStarshipData(data) {
    return data.map(item => {
        return `<li class="listlayout-item">
                <article class="list-card">
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
                </article>
            </li>`
    }).join("");
}


function formatPlanetsData(data) {
    return data.map(item => {
        return `<li class="listlayout-item">
                <article class="list-card">
                    <figure class="card-figure card-image"></figure>
                    <div class="card-body">
                        <h2 class="card-title">${item.name}</h2>
                        <p class="card-data">Diameter: ${item.diameter}km</p>
                        <p class="card-data">Gravity: ${item.gravity}</p>
                        <p class="card-data">Climate: ${item.climate}</p>
                        <p class="card-data">Day-Length: ${item.rotation_period} hours</p>
                        <p class="card-data">Population: ${item.population}</p>
                    </div>
                </article>
            </li>`
    }).join("");
}


function formatPeopleData(data) {
    return data.map(item => {
        return `<li class="listlayout-item">
                <article class="list-card">
                    <figure class="card-figure card-image"></figure>
                    <div class="card-body">
                        <h2 class="card-title">${item.name}</h2>
                        <p class="card-data">Height: ${item.height}cm</p>
                        <p class="card-data">Mass: ${item.mass}kg</p>
                        <p class="card-data">birth year: ${item.birth_year}</p>
                    </div>
                </article>
            </li>`
    }).join("");
}
