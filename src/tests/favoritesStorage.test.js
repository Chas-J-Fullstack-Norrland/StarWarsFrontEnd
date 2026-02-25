/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fav from "../favoritesStorage.js";

describe("favoritesStorage", () => {
  const STORAGE_KEY = "starwars_favorites";

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return empty object if nothing in localStorage", () => {
    expect(fav.getAllFavorites()).toEqual({});
  });

  it("should save and load favorites for a category", () => {
    const people = [{ name: "Luke", url: "url1" }];
    fav.saveFavorites("people", people);

    const loaded = fav.loadFavorites("people");
    expect(loaded).toEqual(people);
  });

  it("should return empty array for category with no favorites", () => {
    expect(fav.loadFavorites("planets")).toEqual([]);
  });

  it("should correctly detect if an item is favorite", () => {
    const item = { name: "Leia", url: "url2" };
    expect(fav.isFavorite("people", item)).toBe(false);

    fav.saveFavorites("people", [item]);
    expect(fav.isFavorite("people", item)).toBe(true);
  });

  it("should toggle favorite: add and remove", () => {
    const item = { name: "Han Solo", url: "url3" };

    // Add
    const added = fav.toggleFavorite("people", item);
    expect(added).toBe(true);
    expect(fav.isFavorite("people", item)).toBe(true);

    // Remove
    const removed = fav.toggleFavorite("people", item);
    expect(removed).toBe(false);
    expect(fav.isFavorite("people", item)).toBe(false);
  });

  it("should handle multiple categories independently", () => {
    const luke = { name: "Luke", url: "url1" };
    const tatooine = { name: "Tatooine", url: "url2" };

    fav.saveFavorites("people", [luke]);
    fav.saveFavorites("planets", [tatooine]);

    expect(fav.loadFavorites("people")).toEqual([luke]);
    expect(fav.loadFavorites("planets")).toEqual([tatooine]);
  });

  it("should use name, title, or url to identify items", () => {
    const item1 = { name: "Yoda" };
    const item2 = { title: "A New Hope" };
    const item3 = { url: "url3" };

    fav.toggleFavorite("people", item1);
    fav.toggleFavorite("films", item2);
    fav.toggleFavorite("starships", item3);

    expect(fav.isFavorite("people", { name: "Yoda" })).toBe(true);
    expect(fav.isFavorite("films", { title: "A New Hope" })).toBe(true);
    expect(fav.isFavorite("starships", { url: "url3" })).toBe(true);
  });

  it("getAllFavorites returns all stored categories", () => {
    const luke = { name: "Luke", url: "url1" };
    const tatooine = { name: "Tatooine", url: "url2" };

    fav.saveFavorites("people", [luke]);
    fav.saveFavorites("planets", [tatooine]);

    const all = fav.getAllFavorites();
    expect(all.people).toEqual([luke]);
    expect(all.planets).toEqual([tatooine]);
  });

  it("should gracefully handle corrupted localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "not-a-json");
    expect(fav.getAllFavorites()).toEqual({});
  });
});