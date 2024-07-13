
// Unit tests for: groupBy


import { ArrayUtils } from '../ArrayUtils';


describe('ArrayUtils.groupBy() groupBy method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    test('should group items by a string property', () => {
      const items = [
        { category: 'fruit', name: 'apple' },
        { category: 'fruit', name: 'banana' },
        { category: 'vegetable', name: 'carrot' }
      ];
      const result = ArrayUtils.groupBy(items, item => item.category);
      expect(result).toEqual([
        [
          { category: 'fruit', name: 'apple' },
          { category: 'fruit', name: 'banana' }
        ],
        [
          { category: 'vegetable', name: 'carrot' }
        ]
      ]);
    });

    test('should group items by a numeric property', () => {
      const items = [
        { id: 1, name: 'apple' },
        { id: 2, name: 'banana' },
        { id: 1, name: 'carrot' }
      ];
      const result = ArrayUtils.groupBy(items, item => item.id);
      expect(result).toEqual([
        [
          { id: 1, name: 'apple' },
          { id: 1, name: 'carrot' }
        ],
        [
          { id: 2, name: 'banana' }
        ]
      ]);
    });

    test('should return an empty array when input is an empty array', () => {
      const items: any[] = [];
      const result = ArrayUtils.groupBy(items, item => item);
      expect(result).toEqual([]);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test.skip('should handle items with undefined group values', () => {
      const items = [
        { category: undefined, name: 'apple' },
        { category: 'fruit', name: 'banana' },
        { category: undefined, name: 'carrot' }
      ];
      const result = ArrayUtils.groupBy(items, item => item.category);
      expect(result).toEqual([
        [
          { category: undefined, name: 'apple' },
          { category: undefined, name: 'carrot' }
        ],
        [
          { category: 'fruit', name: 'banana' }
        ]
      ]);
    });

    test.skip('should handle items with null group values', () => {
      const items = [
        { category: null, name: 'apple' },
        { category: 'fruit', name: 'banana' },
        { category: null, name: 'carrot' }
      ];
      const result = ArrayUtils.groupBy(items, item => item.category);
      expect(result).toEqual([
        [
          { category: null, name: 'apple' },
          { category: null, name: 'carrot' }
        ],
        [
          { category: 'fruit', name: 'banana' }
        ]
      ]);
    });

    test.skip('should handle items with mixed type group values', () => {
      const items = [
        { category: 1, name: 'apple' },
        { category: '1', name: 'banana' },
        { category: 1, name: 'carrot' }
      ];
      const result = ArrayUtils.groupBy(items, item => item.category);
      expect(result).toEqual([
        [
          { category: 1, name: 'apple' },
          { category: 1, name: 'carrot' }
        ],
        [
          { category: '1', name: 'banana' }
        ]
      ]);
    });

    test('should handle items with special characters in group values', () => {
      const items = [
        { category: 'fru!t', name: 'apple' },
        { category: 'fru!t', name: 'banana' },
        { category: 'veget@ble', name: 'carrot' }
      ];
      const result = ArrayUtils.groupBy(items, item => item.category);
      expect(result).toEqual([
        [
          { category: 'fru!t', name: 'apple' },
          { category: 'fru!t', name: 'banana' }
        ],
        [
          { category: 'veget@ble', name: 'carrot' }
        ]
      ]);
    });

    test('should handle items with empty string group values', () => {
      const items = [
        { category: '', name: 'apple' },
        { category: 'fruit', name: 'banana' },
        { category: '', name: 'carrot' }
      ];
      const result = ArrayUtils.groupBy(items, item => item.category);
      expect(result).toEqual([
        [
          { category: '', name: 'apple' },
          { category: '', name: 'carrot' }
        ],
        [
          { category: 'fruit', name: 'banana' }
        ]
      ]);
    });
  });
});

// End of unit tests for: groupBy
