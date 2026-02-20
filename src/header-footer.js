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
          <a href="#">Home</a>  | 
          <a href="#">People</a>  | 
          <a href="#">Planets</a>  | 
          <a href="#">Starships</a>  | 
          <a href="#">Vehicles</a>  | 
          <a href="#">Species</a>  | 
          <a href="#">Films</a>
      </nav>`;

    footer.innerHTML = `
        <p>Chas Academy - Norrland 2026</p>`;

});