const STORAGE_KEY = "starwars_favorites";

function loadAllFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllFavorites(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    console.error("Failed to save favorites to localStorage");
  }
}

function getItemId(item) {
  return item.url || item.name || item.title || JSON.stringify(item);
}

export function loadFavorites(category) {
  const all = loadAllFavorites();
  return all[category] || [];
}

export function saveFavorites(category, favorites) {
  const all = loadAllFavorites();
  all[category] = favorites;
  saveAllFavorites(all);
}

export function isFavorite(category, item) {
  const favorites = loadFavorites(category);
  const id = getItemId(item);
  return favorites.some((fav) => getItemId(fav) === id);
}

export function toggleFavorite(category, item) {
  const favorites = loadFavorites(category);
  const id = getItemId(item);
  const index = favorites.findIndex((fav) => getItemId(fav) === id);

  if (index !== -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(item);
  }

  saveFavorites(category, favorites);
  return index === -1; // returns true if added, false if removed
}

export function getAllFavorites() {
  return loadAllFavorites();
}