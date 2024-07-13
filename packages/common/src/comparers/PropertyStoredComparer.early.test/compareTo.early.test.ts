
// Unit tests for: compareTo

import { StoredComparer } from "../StoredComparer";

import { PropertyStoredComparer } from '../PropertyStoredComparer';


// Mock implementation of StoredComparer for testing purposes
class MockStoredComparer<T> implements StoredComparer<T> {
  private storedValue: T;

  constructor(storedValue: T) {
    this.storedValue = storedValue;
  }

  compareTo(value: T): number {
    if (value < this.storedValue) return -1;
    if (value > this.storedValue) return 1;
    return 0;
  }
}

describe('PropertyStoredComparer.compareTo() compareTo method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    test('should return 0 when property value is equal to stored value', () => {
      const getProperty = (value: { prop: number }) => value.prop;
      const comparer = new MockStoredComparer(10);
      const propertyStoredComparer = new PropertyStoredComparer(getProperty, comparer);

      const result = propertyStoredComparer.compareTo({ prop: 10 });

      expect(result).toBe(0);
    });

    test('should return -1 when property value is less than stored value', () => {
      const getProperty = (value: { prop: number }) => value.prop;
      const comparer = new MockStoredComparer(10);
      const propertyStoredComparer = new PropertyStoredComparer(getProperty, comparer);

      const result = propertyStoredComparer.compareTo({ prop: 5 });

      expect(result).toBe(-1);
    });

    test('should return 1 when property value is greater than stored value', () => {
      const getProperty = (value: { prop: number }) => value.prop;
      const comparer = new MockStoredComparer(10);
      const propertyStoredComparer = new PropertyStoredComparer(getProperty, comparer);

      const result = propertyStoredComparer.compareTo({ prop: 15 });

      expect(result).toBe(1);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should handle undefined property value gracefully', () => {
      const getProperty = (value: { prop?: number }) => value.prop;
      const comparer = new MockStoredComparer(undefined);
      const propertyStoredComparer = new PropertyStoredComparer(getProperty, comparer);

      const result = propertyStoredComparer.compareTo({ prop: undefined });

      expect(result).toBe(0);
    });

    test('should handle null property value gracefully', () => {
      const getProperty = (value: { prop: number | null }) => value.prop;
      const comparer = new MockStoredComparer(null);
      const propertyStoredComparer = new PropertyStoredComparer(getProperty, comparer);

      const result = propertyStoredComparer.compareTo({ prop: null });

      expect(result).toBe(0);
    });

    test('should handle complex object properties', () => {
      const getProperty = (value: { nested: { prop: number } }) => value.nested.prop;
      const comparer = new MockStoredComparer(10);
      const propertyStoredComparer = new PropertyStoredComparer(getProperty, comparer);

      const result = propertyStoredComparer.compareTo({ nested: { prop: 10 } });

      expect(result).toBe(0);
    });

    test('should handle string property values', () => {
      const getProperty = (value: { prop: string }) => value.prop;
      const comparer = new MockStoredComparer('test');
      const propertyStoredComparer = new PropertyStoredComparer(getProperty, comparer);

      const result = propertyStoredComparer.compareTo({ prop: 'test' });

      expect(result).toBe(0);
    });

    test('should handle boolean property values', () => {
      const getProperty = (value: { prop: boolean }) => value.prop;
      const comparer = new MockStoredComparer(true);
      const propertyStoredComparer = new PropertyStoredComparer(getProperty, comparer);

      const result = propertyStoredComparer.compareTo({ prop: true });

      expect(result).toBe(0);
    });
  });
});

// End of unit tests for: compareTo
