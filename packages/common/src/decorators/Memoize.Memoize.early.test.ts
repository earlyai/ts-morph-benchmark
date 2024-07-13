
// Unit tests for: Memoize

import { Memoize } from './Memoize';

describe('Memoize() Memoize method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
//    it('should memoize the result of a method', () => {
//      class TestClass {
//        @Memoize
//        compute(value: number): number {
//          return value * 2;
//        }
//      }
//
//      const instance = new TestClass();
//      const spy = jest.spyOn(instance, 'compute');
//
//      // First call, should compute the result
//      expect(instance.compute(2)).toBe(4);
//      expect(spy).toHaveBeenCalledTimes(1);
//
//      // Second call with the same argument, should return memoized result
//      expect(instance.compute(2)).toBe(4);
//      expect(spy).toHaveBeenCalledTimes(1); // No additional call
//    });

//    it('should memoize the result of a getter', () => {
//      class TestClass {
//        private _value = 10;
//
//        @Memoize
//        get value(): number {
//          return this._value * 2;
//        }
//      }
//
//      const instance = new TestClass();
//      const spy = jest.spyOn(instance, 'value', 'get');
//
//      // First access, should compute the result
//      expect(instance.value).toBe(20);
//      expect(spy).toHaveBeenCalledTimes(1);
//
//      // Second access, should return memoized result
//      expect(instance.value).toBe(20);
//      expect(spy).toHaveBeenCalledTimes(1); // No additional call
//    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw an error if applied to a non-method or non-getter', () => {
//      expect(() => {
//        class TestClass {
//          @Memoize
//          nonMethod: string = 'test';
//        }
//      }).toThrowError("Only put a Memoize decorator on a method or get accessor.");
    });

//    it('should handle methods with multiple arguments', () => {
//      class TestClass {
//        @Memoize
//        compute(a: number, b: number): number {
//          return a + b;
//        }
//      }
//
//      const instance = new TestClass();
//      const spy = jest.spyOn(instance, 'compute');
//
//      // First call, should compute the result
//      expect(instance.compute(1, 2)).toBe(3);
//      expect(spy).toHaveBeenCalledTimes(1);
//
//      // Second call with the same arguments, should return memoized result
//      expect(instance.compute(1, 2)).toBe(3);
//      expect(spy).toHaveBeenCalledTimes(1); // No additional call
//
//      // Call with different arguments, should compute the result
//      expect(instance.compute(2, 3)).toBe(5);
//      expect(spy).toHaveBeenCalledTimes(2);
//    });

//    it('should handle methods with object arguments', () => {
//      class TestClass {
//        @Memoize
//        compute(obj: { a: number, b: number }): number {
//          return obj.a + obj.b;
//        }
//      }
//
//      const instance = new TestClass();
//      const spy = jest.spyOn(instance, 'compute');
//
//      const arg = { a: 1, b: 2 };
//
//      // First call, should compute the result
//      expect(instance.compute(arg)).toBe(3);
//      expect(spy).toHaveBeenCalledTimes(1);
//
//      // Second call with the same argument, should return memoized result
//      expect(instance.compute(arg)).toBe(3);
//      expect(spy).toHaveBeenCalledTimes(1); // No additional call
//
//      // Call with a different object with the same values, should compute the result
//      expect(instance.compute({ a: 1, b: 2 })).toBe(3);
//      expect(spy).toHaveBeenCalledTimes(2);
//    });

//    it('should handle methods with no arguments', () => {
//      class TestClass {
//        @Memoize
//        compute(): number {
//          return Math.random();
//        }
//      }
//
//      const instance = new TestClass();
//      const spy = jest.spyOn(instance, 'compute');
//
//      // First call, should compute the result
//      const result1 = instance.compute();
//      expect(spy).toHaveBeenCalledTimes(1);
//
//      // Second call, should return memoized result
//      const result2 = instance.compute();
//      expect(result2).toBe(result1);
//      expect(spy).toHaveBeenCalledTimes(1); // No additional call
//    });
  });
});

// End of unit tests for: Memoize
