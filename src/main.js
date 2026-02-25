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

app.innerHTML =
<main class="container">
<header>
<h1>Star Wars Explorer</h1>
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
