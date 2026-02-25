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
import "../list.js";

describe("ListView load event", () => {
  let container;

  beforeEach(() => {
    // Setup DOM container BEFORE the load event
    document.body.innerHTML = `<div id="list-section"></div>`;
    container = document.getElementById("list-section");

    // Reset mocks
    vi.resetAllMocks();
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
});