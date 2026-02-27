import './style.css'
/*import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
?*/
const app = document.querySelector('#app')

app.innerHTML = `
<main class="container">
<header class="header">
<h1>Star Wars Explorer</h1>
</header>

<div
id="network-status"
class="network-status"
role="status"
aria-live="polite"
>
<span class="status-dot"></span>
<span class="status-text"><Checking...</span>
</div>
</header>

<section>
<h2>Characters</h2>
<input
type="search"
id="search"
placeholder="Search character"
/>
<section
 id="character-list"
 class="threeColGrid">
 </section>
</section>
</main>
`
const statusElement = document.getElementById("network-status");
const statusText = statusElement.querySelector(".status-text");

function updateNetworkStatus() {
if (navigator.online) {
statusElement.classList.remove("offline");
statusElement.classList.add("online");
statusText.textContent = "Online";
} else {
statusElement.classList.remove("online");
statusElement.classList.add("offline");
statusText.textContent = "Offline";
}
}
updateNetworkStatus();
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);