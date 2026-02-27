import './styles/style.css'
import './styles/header-footer.css'
import './header-footer.js'  
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

let app = document.querySelector('#app');
if (app) {
  app.innerHTML = `
    <div class="home-container">
      <div class="home-hero">
        <h1 class="glow-text">STAR WARS DATA BANK</h1>
        <p class="subtitle">Access the archives of the Galactic Republic and beyond</p>
      </div>
      <div class="favorites-teaser">
        <p>Looking for something specific? Review your <a href="favorites.html">Favorites</a>.</p>
      </div>
    </div>
  `;
}