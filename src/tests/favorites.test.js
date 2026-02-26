/**
 * @vitest-environment jsdom
 */
import { describe, it, beforeEach, expect, vi } from "vitest";

// Mock the favoritesStorage module
import * as fav from "../favoritesStorage.js";

vi.mock("../favoritesStorage", async () => {
  const original = await vi.importActual("../favoritesStorage");
  return {
    ...original,
    getAllFavorites: vi.fn(),
    toggleFavorite: vi.fn(),
  };
});

// Import the favorites page script AFTER mocks so load listener registers
import "../favorites.js";

describe("Favorites Page", () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = `<div id="favorites-container"></div>`;
    container = document.getElementById("favorites-container");
    vi.resetAllMocks();
  });

  it("renders 'no favorites' message when empty", async () => {
    fav.getAllFavorites.mockReturnValue({});
    window.dispatchEvent(new Event("load"));
    await new Promise(process.nextTick);

    expect(container.innerHTML).toContain("No Favorites Yet");
    expect(container.querySelector(".back-link")).not.toBeNull();
  });

  it("renders favorites categories and items", async () => {
    const data = {
      people: [
        { name: "Luke", height: "172", mass: "77", birth_year: "19BBY", url: "url1" },
      ],
      planets: [
        { name: "Tatooine", climate: "arid", population: "200000", diameter: "10465", url: "url2" },
      ],
    };
    fav.getAllFavorites.mockReturnValue(data);

    window.dispatchEvent(new Event("load"));
    await new Promise(process.nextTick);

    // People
    const peopleSection = container.querySelector(".favorites-category h2");
    expect(peopleSection.textContent).toContain("People");
    expect(container.innerHTML).toContain("Luke");
    expect(container.innerHTML).toContain("Height: 172cm");

    // Planets
    expect(container.innerHTML).toContain("Tatooine");
    expect(container.innerHTML).toContain("Population: 200000");
  });

  it("calls toggleFavorite when remove button is clicked", async () => {
    const data = {
      people: [
        { name: "Leia", height: "150", mass: "49", birth_year: "19BBY", url: "url3" },
      ],
    };
    fav.getAllFavorites.mockReturnValue(data);

    window.dispatchEvent(new Event("load"));
    await new Promise(process.nextTick);

    const button = container.querySelector(".remove-favorite-btn");
    expect(button).not.toBeNull();

    // Simulate click
    button.click();
    expect(fav.toggleFavorite).toHaveBeenCalledWith("people", data.people[0]);
  });

  it("does not render empty categories", async () => {
    const data = {
      people: [],
      planets: [],
    };
    fav.getAllFavorites.mockReturnValue(data);

    window.dispatchEvent(new Event("load"));
    await new Promise(process.nextTick);

    expect(container.innerHTML).toContain("No Favorites Yet");
  });

  it("formats items using correct category details", async () => {
    const data = {
      films: [
        { title: "A New Hope", episode_id: 4, director: "George Lucas", release_date: "1977-05-25", url: "url4" },
      ],
    };
    fav.getAllFavorites.mockReturnValue(data);

    window.dispatchEvent(new Event("load"));
    await new Promise(process.nextTick);

    expect(container.innerHTML).toContain("A New Hope");
    expect(container.innerHTML).toContain("Episode: 4");
    expect(container.innerHTML).toContain("Director: George Lucas");
  });
});