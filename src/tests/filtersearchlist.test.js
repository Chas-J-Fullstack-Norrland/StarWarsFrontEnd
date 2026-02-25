import { describe, it, expect } from 'vitest';
import {
  objectContainsSearch,
  applyFilters,
  detectFieldType,
  extractFilterableKeys,
  sortByKey
} from '../filtersearchlist.js';

// Helper for test data
const testData = [
  { name: 'Luke Skywalker', height: '172', mass: '77', films: ['A New Hope', 'Empire Strikes Back'] },
  { name: 'Darth Vader', height: '202', mass: '136', films: ['A New Hope', 'Return of the Jedi'] },
  { name: 'Leia Organa', height: '150-160', mass: '49', films: ['A New Hope'] },
  { name: 'R2-D2', height: '96', mass: '32', films: [] }
];

describe('objectContainsSearch', () => {
  it('matches string values case-insensitively', () => {
    expect(objectContainsSearch(testData[0], 'luke')).toBe(true);
    expect(objectContainsSearch(testData[1], 'vader')).toBe(true);
    expect(objectContainsSearch(testData[2], 'LEIA')).toBe(true);
    expect(objectContainsSearch(testData[3], 'r2-d2')).toBe(true);
  });

  it('matches arrays of strings', () => {
    expect(objectContainsSearch(testData[0], 'Empire')).toBe(true);
    expect(objectContainsSearch(testData[1], 'Jedi')).toBe(true);
    expect(objectContainsSearch(testData[3], 'A New Hope')).toBe(false); // empty array
  });

  it('matches numbers as strings', () => {
    expect(objectContainsSearch(testData[0], '77')).toBe(true);
    expect(objectContainsSearch(testData[3], '96')).toBe(true);
  });

  it('returns false when no match', () => {
    expect(objectContainsSearch(testData[0], 'Yoda')).toBe(false);
  });
});

describe('applyFilters', () => {
  it('filters contains correctly', () => {
    const filters = [{ key: 'name', type: 'contains', value: 'Luke' }];
    const result = applyFilters(filters, testData);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Luke Skywalker');
  });

  it('filters exact correctly', () => {
    const filters = [{ key: 'name', type: 'exact', value: 'Darth Vader' }];
    const result = applyFilters(filters, testData);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Darth Vader');
  });

  it('filters numeric compare correctly with single numbers', () => {
    const filters = [{ key: 'mass', type: 'compare', operator: '>', value: '50' }];
    const result = applyFilters(filters, testData);
    expect(result.map(i => i.name)).toEqual(['Luke Skywalker', 'Darth Vader']);
  });

  it('filters numeric compare correctly with ranges', () => {
    const filters = [{ key: 'height', type: 'compare', operator: '<', value: '160' }];
    const result = applyFilters(filters, testData);
    // Leia 150-160 avg=155, R2-D2 96, Luke 172, Vader 202
    expect(result.map(i => i.name)).toEqual(['R2-D2']);
  });

  it('returns empty array when no match', () => {
    const filters = [{ key: 'mass', type: 'compare', operator: '<', value: '10' }];
    const result = applyFilters(filters, testData);
    expect(result).toEqual([]);
  });
});

describe('detectFieldType', () => {
  it('detects number for numeric strings', () => {
    expect(detectFieldType(testData, 'mass')).toBe('number');
  });

  it('detects number for ranges', () => {
    expect(detectFieldType(testData, 'height')).toBe('number');
  });

  it('detects string for text fields', () => {
    expect(detectFieldType(testData, 'name')).toBe('string');
  });

  it('detects string for arrays', () => {
    expect(detectFieldType(testData, 'films')).toBe('string');
  });
});

describe('extractFilterableKeys', () => {
  it('returns keys that are not objects', () => {
    const data = [
      { name: 'X', age: 10, meta: { nested: true }, list: [1, 2] }
    ];
    const keys = extractFilterableKeys(data);
    expect(keys).toEqual(['name', 'age', 'list']);
  });

  it('returns empty array for empty data', () => {
    expect(extractFilterableKeys([])).toEqual([]);
  });
});

describe('sortByKey', () => {
  it('sorts numbers ascending', () => {
    const result = sortByKey('mass', testData, 'asc');
    expect(result.map(i => i.name)).toEqual(['R2-D2', 'Leia Organa', 'Luke Skywalker', 'Darth Vader']);
  });

  it('sorts numbers descending', () => {
    const result = sortByKey('mass', testData, 'desc');
    expect(result.map(i => i.name)).toEqual(['Darth Vader', 'Luke Skywalker', 'Leia Organa', 'R2-D2']);
  });

  it('sorts strings ascending', () => {
    const result = sortByKey('name', testData, 'asc');
    expect(result.map(i => i.name)).toEqual(['Darth Vader', 'Leia Organa', 'Luke Skywalker', 'R2-D2']);
  });

  it('sorts strings descending', () => {
    const result = sortByKey('name', testData, 'desc');
    expect(result.map(i => i.name)).toEqual(['R2-D2', 'Luke Skywalker', 'Leia Organa', 'Darth Vader']);
  });
});