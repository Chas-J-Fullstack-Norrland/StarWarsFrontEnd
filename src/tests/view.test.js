/**
 * @vitest-environment jsdom
 */
import { describe, it, beforeEach, expect, vi } from 'vitest';
import * as api from '../api/api.js'; // Import the module to execute its logic

vi.mock('../api/api.js');

describe('View module', () => {
  let nameHeader, attributesList, itemTextbox;

  beforeEach(async () => {
    // Set up the DOM
    document.body.innerHTML = `
      <button class="favorite-button" id="favorite-button">☆ Add Favorite</button>
      <h1 id="item-name-header"></h1>
      <ul id="item-attributes"></ul>
      <section id="item-textbox"></section>
    `;

    nameHeader = document.getElementById('item-name-header');
    attributesList = document.getElementById('item-attributes');
    itemTextbox = document.getElementById('item-textbox');

    vi.clearAllMocks();
    vi.resetModules();

    await import('../view.js');
  });

  describe('Rendering data through page load simulation', () => {
    it('renders film data when category is films', async () => {
      const film = {
        title: 'A New Hope',
        episode_id: 4,
        release_date: '1977-05-25',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        opening_crawl: 'It is a period of civil war...'
      };

      api.fetchRequest.mockResolvedValue(film);

      // Simulate a page load with URL parameters
      window.history.pushState({}, '', '?category=films&id=1');

      // Trigger the load event manually
      await window.dispatchEvent(new Event('DOMContentLoaded'));

      expect(nameHeader.innerHTML).toBe('A New Hope');
      expect(attributesList.innerHTML).toContain('<li>Episode: 4</li>');
      expect(itemTextbox.innerText).toBe('It is a period of civil war...');
    });

    it('renders people data when category is people (contains Async call)', async () => {
      const person = {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'Blond',
        skin_color: 'Fair',
        eye_color: 'Blue',
        birth_year: '19BBY',
        gender: 'Male',
        homeworld: 'http://swapi.dev/api/planets/1/'
      };
      
      api.fetchRequest.mockResolvedValue(person);
      api.resolveAPILink.mockResolvedValue('Tatooine');

      // Simulate a page load with URL parameters
      window.history.pushState({}, '', '?category=people&id=1');

      // Trigger the load event manually
      await window.dispatchEvent(new Event('DOMContentLoaded'));

      await new Promise(process.nextTick);

      expect(nameHeader.innerHTML).toBe('Luke Skywalker');
      expect(attributesList.innerHTML).toContain('<li>Homeworld: Tatooine</li>');
      expect(attributesList.innerHTML).toContain('<li>Height: 172</li>');
    });

    it('renders planet data when category is planets', async () => {
      const planet = {
        name: 'Tatooine',
        rotational_period: '23',
        orbital_period: '304',
        diameter: '10465',
        climate: 'arid',
        gravity: '1 standard',
        surface_water: '1',
        population: '200000'
      };

      api.fetchRequest.mockResolvedValue(planet);

      // Simulate a page load with URL parameters
      window.history.pushState({}, '', '?category=planets&id=1');

      // Trigger the load event manually
      await window.dispatchEvent(new Event('DOMContentLoaded'));

      expect(nameHeader.innerHTML).toBe('Tatooine');
      expect(attributesList.innerHTML).toContain('<li>Rotation Period: 23</li>');
      expect(attributesList.innerHTML).toContain('<li>Population: 200000</li>');
    });

    it('handles unknown category gracefully', async () => {
      api.fetchRequest.mockResolvedValue({});
      
      // Simulate a page load with an invalid category
      window.history.pushState({}, '', '?category=unknown&id=1');
      await window.dispatchEvent(new Event('DOMContentLoaded'));

      expect(nameHeader.innerText).toBe('Unable to Load Item');
    });
  });
});