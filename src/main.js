import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
<header class="bg-black p-4 shadow">
<h1 class="text-2x1 font-bold">Star Wars Explorer</h1>
</header>

<main class="p-4">
<section>
<h2 class="text-xl mb-4">Characters</h2>

<input
id="search"
placeholder="Search character..."
class="w-full p-2 rounded text-black"
aria-label="Search characters"
/>

<ul id="character-list" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
</ul>
</section>
</main>