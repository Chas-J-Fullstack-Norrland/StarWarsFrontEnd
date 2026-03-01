const header = document.querySelector("header");
const footer = document.querySelector("footer");

const updateStatusUI = async () => {
    const statusElement = document.getElementById("status");
    if (!statusElement) return;

    let isReallyOnline = navigator.onLine;

    // Vi utför endast nätverksprovet om navigatorn tror att vi är online
    if (isReallyOnline) {
        try {
            const response = await fetch('/StarWarsFrontEnd/favicon-192.png', { 
                method: 'HEAD', 
                cache: 'no-store' 
            });
            isReallyOnline = response.ok;
        } catch (error) {
            isReallyOnline = false;
        }
    }

    // Applicera resultatet på DOM:en
    statusElement.textContent = isReallyOnline ? "Online" : "Offline";
    statusElement.style.color = isReallyOnline ? "#00ff00" : "#ff4444";
    
    statusElement.classList.toggle("online", isReallyOnline);
    statusElement.classList.toggle("offline", !isReallyOnline);
};

// 2. LAYOUT-INJEKTION
const renderLayout = () => {
    if (!header || !footer) return;

    header.innerHTML = `
        <section id="user-section">
            <div class="logo-container">
                <a href="index.html" class="logo">
                    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" stroke="#ffe81f" stroke-width="2" stroke-dasharray="10 5" />
                        <path d="M50 20L80 75H20L50 20Z" fill="url(#glowGradient)" />
                        <circle cx="50" cy="55" r="8" fill="#ffe81f">
                            <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <defs>
                            <radialGradient id="glowGradient">
                                <stop offset="0%" stop-color="#ffe81f" stop-opacity="0.8" />
                                <stop offset="100%" stop-color="#ffe81f" stop-opacity="0.1" />
                            </radialGradient>
                        </defs>
                    </svg>
                    <span class="logo-text">SW-ARCHIVE</span>
                </a>
                <span id="status" role="alert">Checking...</span>
            </div>
            <div id="user-controls">
                <span id="current-user">Guest</span>
                <input type="text" id="user" placeholder="Username" />
                <button id="user-button">Set User</button>
            </div>
        </section>
        <nav aria-label="Main Navigation">
            <ul id="category_nav">
                <li><a href="index.html">Home</a></li>
                <li><a href="list.html?category=people">People</a></li>
                <li><a href="list.html?category=planets">Planets</a></li>
                <li><a href="list.html?category=starships">Starships</a></li>
                <li><a href="list.html?category=vehicles">Vehicles</a></li>
                <li><a href="list.html?category=species">Species</a></li>
                <li><a href="list.html?category=films">Films</a></li>
                <li><a href="favorites.html">Favorites</a></li>
            </ul>
        </nav>`;

    footer.innerHTML = `<p>Chas Academy - Norrland 2026</p>`;

    // Triggar kontrollen EN gång vid sidladdning
    updateStatusUI();
    setupUserLogic();
};

// 3. ANVÄNDARLOGIK
const setupUserLogic = () => {
    const userBtn = document.getElementById("user-button");
    const currentUserDisplay = document.getElementById("current-user");
    const savedUser = localStorage.getItem("sw-username");

    if (savedUser && currentUserDisplay) currentUserDisplay.textContent = savedUser;

    if (userBtn) {
        userBtn.onclick = () => {
            const name = document.getElementById("user").value.trim();
            if (name) {
                localStorage.setItem("sw-username", name);
                currentUserDisplay.textContent = name;
            }
        };
    }
};

window.addEventListener("load", renderLayout);

// Dessa lyssnare reagerar endast när hårdvaran signalerar förändring
window.addEventListener('online', updateStatusUI);
window.addEventListener('offline', updateStatusUI);