const header = document.querySelector("header");
const footer = document.querySelector("footer");


window.addEventListener("load", () => {
    document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="./styles/header-footer.css">`);
    
    header.innerHTML = `
        <section id="user-section">
          <a href="#" class="logo">Star Wars API</a>
          <span id="current-user">no-user</span>
          <input type="text" id="user" />
          <button id="user-button">Set User</button>
          <span id="status">Online</span>
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

});