
// Unit tests for: compareTo

import { Comparer } from "../Comparer";

import { PropertyComparer } from '../PropertyComparer';


// Mock implementation of Comparer for testing purposes
class MockComparer implements Comparer<number> {
  compareTo(a: number, b: number): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
}

describe('PropertyComparer.compareTo() compareTo method', () => {
  let propertyComparer: PropertyComparer<{ value: number }, number>;

  beforeEach(() => {
    const getProperty = (obj: { value: number }) => obj.value;
    const comparer = new MockComparer();
    propertyComparer = new PropertyComparer(getProperty, comparer);
  });

  // Happy path tests
  describe('Happy Path', () => {
    test('should return 0 when properties are equal', () => {
      const obj1 = { value: 5 };
      const obj2 = { value: 5 };
      expect(propertyComparer.compareTo(obj1, obj2)).toBe(0);
    });

    test('should return -1 when first property is less than second property', () => {
      const obj1 = { value: 3 };
      const obj2 = { value: 5 };
      expect(propertyComparer.compareTo(obj1, obj2)).toBe(-1);
    });

    test('should return 1 when first property is greater than second property', () => {
      const obj1 = { value: 7 };
      const obj2 = { value: 5 };
      expect(propertyComparer.compareTo(obj1, obj2)).toBe(1);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should handle negative numbers correctly', () => {
      const obj1 = { value: -3 };
      const obj2 = { value: -5 };
      expect(propertyComparer.compareTo(obj1, obj2)).toBe(1);
    });

    test('should handle zero correctly', () => {
      const obj1 = { value: 0 };
      const obj2 = { value: 0 };
      expect(propertyComparer.compareTo(obj1, obj2)).toBe(0);
    });

    test('should handle large numbers correctly', () => {
      const obj1 = { value: Number.MAX_SAFE_INTEGER };
      const obj2 = { value: Number.MIN_SAFE_INTEGER };
      expect(propertyComparer.compareTo(obj1, obj2)).toBe(1);
    });

    test('should handle mixed positive and negative numbers correctly', () => {
      const obj1 = { value: -10 };
      const obj2 = { value: 10 };
      expect(propertyComparer.compareTo(obj1, obj2)).toBe(-1);
    });

    test('should handle properties that are not numbers', () => {
      const getProperty = (obj: { value: string }) => obj.value;
      const stringComparer: Comparer<string> = {
        compareTo: (a: string, b: string) => a.localeCompare(b)
      };
      const stringPropertyComparer = new PropertyComparer(getProperty, stringComparer);

      const obj1 = { value: 'apple' };
      const obj2 = { value: 'banana' };
      expect(stringPropertyComparer.compareTo(obj1, obj2)).toBe(-1);
    });

    test('should handle properties that are objects', () => {
      const getProperty = (obj: { value: { nested: number } }) => obj.value.nested;
      const nestedPropertyComparer = new PropertyComparer(getProperty, new MockComparer());

      const obj1 = { value: { nested: 1 } };
      const obj2 = { value: { nested: 2 } };
      expect(nestedPropertyComparer.compareTo(obj1, obj2)).toBe(-1);
    });
  });
});

// End of unit tests for: compareTo
