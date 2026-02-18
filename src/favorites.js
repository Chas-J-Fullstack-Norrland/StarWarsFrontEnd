import './style.css';

const ENTITY_CONFIG = [
  { id: 'films', label: 'Films' },
  { id: 'people', label: 'People' },
  { id: 'planets', label: 'Planets' },
  { id: 'species', label: 'Species' },
  { id: 'vehicles', label: 'Vehicles' },
  { id: 'starships', label: 'Starships' },
];

function getFavoritesFromStorage() {
  const raw = localStorage.getItem('favorites');
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveFavoritesToStorage(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function getItemLabel(item) {
  if (item == null) return 'Unknown item';
  if (typeof item === 'string' || typeof item === 'number') return String(item);
  if (typeof item === 'object') {
    return item.name || item.title || item.url || JSON.stringify(item);
  }
  return 'Unknown item';
}

function getItemHref(item) {
  if (item && typeof item === 'object') {
    if (item.url) return item.url;
    if (item.link) return item.link;
    if (item.id) return String(item.id);
  }
  return '#';
}

function createFavoriteItem(entityId, item, index, onRemove) {
  const li = document.createElement('li');
  li.style.margin = '0.25rem 0';

  const link = document.createElement('a');
  link.textContent = getItemLabel(item);
  link.href = getItemHref(item);
  if (link.href !== '#') {
    link.target = '_blank';
  }
  li.appendChild(link);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = 'Remove';
  removeBtn.style.marginLeft = '0.5rem';
  removeBtn.addEventListener('click', () => onRemove(entityId, index));
  li.appendChild(removeBtn);

  return li;
}

function renderFavoritesPage() {
  const app = document.querySelector('#app');
  app.innerHTML = '';

  const favorites = getFavoritesFromStorage();

  const container = document.createElement('div');

  const title = document.createElement('h1');
  title.textContent = 'Your Star Wars Favorites';
  container.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'Click a favorite to open it, or remove it from your list.';
  container.appendChild(intro);

  const noFavsMessage = document.createElement('p');
  noFavsMessage.textContent = 'You have no favorites saved yet.';
  container.appendChild(noFavsMessage);

  function handleRemoveFavorite(entityId, index) {
    const current = getFavoritesFromStorage();
    const list = Array.isArray(current[entityId]) ? current[entityId] : [];
    if (index < 0 || index >= list.length) return;

    list.splice(index, 1);
    current[entityId] = list;
    saveFavoritesToStorage(current);

    // Reload page after removal
    window.location.reload();
  }

  let anyFavorites = false;

  ENTITY_CONFIG.forEach(({ id, label }) => {
    const list = Array.isArray(favorites[id]) ? favorites[id] : [];

    const section = document.createElement('section');
    const heading = document.createElement('h2');
    heading.textContent = label;
    section.appendChild(heading);

    if (!list.length) {
      const emptyText = document.createElement('p');
      emptyText.textContent = `No ${label.toLowerCase()} saved.`;
      section.appendChild(emptyText);
    } else {
      anyFavorites = true;
      const ul = document.createElement('ul');
      ul.style.listStyle = 'none';
      ul.style.padding = '0';

      list.forEach((item, index) => {
        const li = createFavoriteItem(id, item, index, handleRemoveFavorite);
        ul.appendChild(li);
      });

      section.appendChild(ul);
    }

    container.appendChild(section);
  });

  noFavsMessage.style.display = anyFavorites ? 'none' : 'block';

  app.appendChild(container);
}

renderFavoritesPage();