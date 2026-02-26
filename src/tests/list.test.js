/**
 * @vitest-environment jsdom
 */
import { describe, it, beforeEach, expect, vi } from "vitest";

// Mock your API and favorites modules before importing the script
import * as api from "../api/api";
import * as fav from "../favoritesStorage";

// Vitest ESM mocking for named exports
vi.mock("../api/api", async () => {
  const original = await vi.importActual("../api/api");
  return {
    ...original,
    fetchRequest: vi.fn(),
  };
});

vi.mock("../favoritesStorage", async () => {
  const original = await vi.importActual("../favoritesStorage");
  return {
    ...original,
    isFavorite: vi.fn(),
    toggleFavorite: vi.fn(),
  };
});

// Now import the script so the load listener is registered

describe("ListView load event", () => {
  let container;

  beforeEach(async() => {
    // Setup DOM container BEFORE the load event
      document.body.innerHTML = `
        <h1></h1>
        <div id="list-section"></div>
        <input id="searchInput" />
        <select id="filterKey"></select>
        <select id="filterOperator"></select>
        <select id="filterType"></select>
        <input id="filterValue" />
        <button id="addFilterBtn"></button>
        <button id="clearFilters"></button>
        <select id="sortSelect"></select>
        <select id="sortDirection"></select>`;
    container = document.getElementById("list-section");

    // Reset mocks
    vi.resetAllMocks();

    await import("../list.js");

    
  });

  it("renders people list on window load", async () => {
    const peopleData = [
      {
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
        birth_year: "19BBY",
        url: "https://swapi.dev/api/people/1/",
      },
      {
        name: "Leia Organa",
        height: "150",
        mass: "49",
        birth_year: "19BBY",
        url: "https://swapi.dev/api/people/5/",
      },
    ];

    api.fetchRequest.mockResolvedValue(peopleData);
    fav.isFavorite.mockReturnValue(false);

    // Set URL with query string (relative path)
    window.history.pushState({}, "", "/?category=people");

    // Trigger the load event manually
    await window.dispatchEvent(new Event("load"));

    // Wait for promises to resolve
    await new Promise(process.nextTick);

    const list = container.querySelector("ul.listlayout");
    expect(list).not.toBeNull();
    expect(list.children.length).toBe(2);
    expect(list.innerHTML).toContain("Luke Skywalker");
    expect(list.innerHTML).toContain("Leia Organa");

    const button = list.querySelector(".favorite-button");
    expect(button.textContent).toBe("☆ Add to Favorites");
  });

  it("renders planets list on window load", async () => {
    const planetData = [
      {
        name: "Tatooine",
        diameter: "10465",
        gravity: "1 standard",
        climate: "arid",
        rotation_period: "23",
        population: "200000",
        url: "https://swapi.dev/api/planets/1/",
      },
    ];

    api.fetchRequest.mockResolvedValue(planetData);
    fav.isFavorite.mockReturnValue(true);

    window.history.pushState({}, "", "/?category=planets");
    await window.dispatchEvent(new Event("load"));
    await new Promise(process.nextTick);

    const list = container.querySelector("ul.listlayout");
    expect(list).not.toBeNull();
    expect(list.innerHTML).toContain("Tatooine");

    const button = list.querySelector(".favorite-button");
    expect(button.textContent).toBe("★ Remove Favorite");
  });


  it("clears filters and search", async () => {
    const peopleData = [
      { name: "Luke Skywalker", url: "https://swapi.dev/api/people/1/" },
      { name: "Leia Organa", url: "https://swapi.dev/api/people/5/" },
    ];

    api.fetchRequest.mockResolvedValue(peopleData);

    window.history.pushState({}, "", "/?category=people");
    await window.dispatchEvent(new Event("load"));
    await Promise.resolve();

    // Apply a search
    const input = document.getElementById("searchInput");
    input.value = "Leia";
    input.dispatchEvent(new Event("input"));
    await Promise.resolve();

    // Clear filters
    const clearBtn = document.getElementById("clearFilters");
    clearBtn.dispatchEvent(new Event("click"));
    await Promise.resolve();

    const list = container.querySelector("ul.listlayout");
    expect(list.children.length).toBe(2); // all restored
  });
});




