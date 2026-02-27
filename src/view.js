import "./styles/view.css";
import {resolveAPILink,fetchRequest} from "./api/api.js";
import { isFavorite, toggleFavorite } from "./favoritesStorage.js";

const nameHeader = document.getElementById("item-name-header");
const attributesList = document.getElementById("item-attributes");
//const itemThumbnail = document.getElementById("item-thumbnail");
const itemTextbox = document.getElementById("item-textbox");
const favoriteButton = document.getElementById("favorite-button")

let currentCategory = null;
let currentId = null;



window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get("category"));
        console.log(urlParams.get("id"));
    console.log(window.location.search)
    renderResponse(urlParams.get("category"),urlParams.get("id"));
});

favoriteButton?.addEventListener("click", () => {
    if (currentCategory && currentItemData) {
        toggleFavorite(currentCategory, currentItemData);
        updateFavoriteButton();

        console.log("Sparat till favorites!", localStorage.getItem("starwars_favorites"));
    } else {
        console.warn("Kunde inte spara: Kategori eller data saknas.");
    }
});

function updateFavoriteButton() {
    if (favoriteButton && currentCategory && currentId) {
        const favorited = isFavorite(currentCategory, currentId);
        favoriteButton.textContent = favorited ? "Remove" : "Favorite";
        favoriteButton.classList.toggle("favorited", favorited);
    }
}

let currentItemData = null;

function renderResponse(category,id) {
    const endpoint = category+"/"+id;

    currentCategory = category;
    currentId = id;

    fetchRequest(endpoint)
        .then(item => {
            currentItemData = item;

            mapItem(item,category);
            updateFavoriteButton();
        })
        .catch(error => {
            console.error(`Error fetching ${endpoint}:`, error);
            nameHeader.innerHTML = "Failed to load data.";
        });
}

function mapItem(data,category){
    switch (category) {
        case "starships":
            formatStarshipData(data);
            break;
        case "planets":
            formatPlanetsData(data);
            break;
        case "people":
            formatPeopleData(data);
            break;
        case "vehicles":
            formatVehicleData(data);
            break;
        case "species":
            formatSpeciesData(data);
            break;
        case "films":
            formatFilmsData(data);
            break;
        default:
            console.warn(`Unknown item type: ${category}`);
            nameHeader.innerText = "Failed to load data." // Fallback
        }
}

function formatFilmsData(item){
    nameHeader.innerHTML=item.title;
    attributesList.innerHTML =` 
                <li>Episode: ${item.episode_id}</li>
                <li>Release Date: ${item.release_date}</li>
                <li>Director: ${item.director}</li>
                <li>Producer: ${item.producer}</li>`;
}

async function formatPeopleData(item) {
    nameHeader.innerHTML = item.name;

    const homeworldLink = await resolveAPILink(item.homeworld);

    attributesList.innerHTML = `
        <li>Height: ${item.height}</li>
        <li>Mass: ${item.mass}</li>
        <li>Hair Color: ${item.hair_color}</li>
        <li>Skin Color: ${item.skin_color}</li>
        <li>Eye Color: ${item.eye_color}</li>
        <li>Birth Year: ${item.birth_year}</li>
        <li>Gender: ${item.gender}</li>
        <li>Homeworld: ${homeworldLink}</li>
    `;


}

function formatPlanetsData(item){
    nameHeader.innerHTML = item.name;
        attributesList.innerHTML =`
                <li>Rotation Period: ${item.rotational_period}</li>
                <li>Orbital Period: ${item.orbital_period}</li>
                <li>Diameter: ${item.diameter}</li>
                <li>Climate: ${item.climate}</li>
                <li>Gravity: ${item.gravity}</li>
                <li>Surface Water: ${item.surface_water}</li>
                <li>Population: ${item.population}</li>
                `;
}

async function formatSpeciesData(item){
    nameHeader.innerHTML = item.name;

        const homeworldLink = await resolveAPILink(item.homeworld);

        attributesList.innerHTML =`
                <li>Classification: ${item.classification}</li>
                <li>Designation: ${item.designation}</li>
                <li>Average Height: ${item.average_height}</li>
                <li>Skin Colors: ${item.skin_colors}</li>
                <li>Hair Colors: ${item.hair_colors}</li>
                <li>Eye Colors: ${item.eye_colors}</li>
                <li>Average Lifespan: ${item.average_lifespan}</li>
                <li>Language: ${item.language}</li>

                <li>Homeworld: ${homeworldLink}</li>
                `;
}

function formatVehicleData(item){
    nameHeader.innerHTML = item.name;
        attributesList.innerHTML =`
                <li>Class: ${item.class}</li>
                <li>Model: ${item.model}</li>
                <li>Manufacturer: ${item.manufacturer}</li>
                <li>Price: ${item.cost_in_credits} Credits</li>
                <li>Length: ${item.length} Meters</li>
                <li>Max Atmosphering Speed: ${item.max_atmosphering_speed} km/h</li>
                <li>Crew: ${item.crew}</li>
                <li>Passangers: ${item.passangers}</li>
                <li>Cargo Capacity: ${item.cargo_capacity}</li>
                <li>Consumables: ${item.consumables}</li>
                `;
}

function formatStarshipData(item){
    nameHeader.innerHTML = item.name;
        attributesList.innerHTML =`
                <li>Class: ${item.starship_class}</li>
                <li>Model: ${item.model}</li>
                <li>Manufacturer: ${item.manufacturer}</li>
                <li>Price: ${item.cost_in_credits} Credits</li>
                <li>Length: ${item.length} Meters</li>
                <li>Max Atmosphering Speed: ${item.max_atmosphering_speed} km/h</li>
                <li>Sublight Speed: ${item.MGLT} MGLT</li>
                <li>Hyperdrive Rating: ${item.hyperdrive_rating}</li>
                <li>Crew: ${item.crew}</li>
                <li>Passangers: ${item.passangers}</li>
                <li>Cargo Capacity: ${item.cargo_capacity}</li>
                <li>Consumables: ${item.consumables}</li>
                `;
}

