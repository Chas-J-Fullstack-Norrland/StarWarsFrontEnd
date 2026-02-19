import { fetchRequest } from "./api/api";


fetchRequest("people")
/*function renderList(endpoint, containerId) {
    const container = document.getElementById(containerId);
    fetchRequest(endpoint)
        .then(data => {
            const listItems = data.map(item => `<li>${item.name}</li>`).join("");
            container.innerHTML = `<ul>${listItems}</ul>`;
        })
        .catch(error => {
            console.error(`Error fetching ${endpoint}:`, error);
            container.innerHTML = "<p>Failed to load data.</p>";
        });
}

function mapitems(data) {
    const cards = data.map(item => {
        "<li>${item.name}</li>"
    },).join("");


  return data.map(item => item.name);
}*/

window.addEventListener("load", () => {
    renderList("people", "list-section");
});