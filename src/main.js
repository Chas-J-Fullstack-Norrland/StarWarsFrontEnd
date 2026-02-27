import './styles/style.css'
import './styles/header-footer.css'
import './header-footer.js'  
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

let logoElement = document.querySelector('.logos');
if (logoElement){
  logoElement.innerHTML = `
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
        <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
      </a>
  `;
}


if ('serviceworker' in navigator){
  navigator.addEventListener('load',()=>{
    const path = import.meta.env.BASE_URL + 'service-worker.js'
    navigator.serviceWorker.register(path).catch(err => console.error("Failed to register serviceworker",err))
  })
}