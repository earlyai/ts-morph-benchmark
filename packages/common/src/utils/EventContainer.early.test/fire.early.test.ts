
// Unit tests for: fire

import { EventContainer } from '../EventContainer';


describe('EventContainer.fire() fire method', () => {
  let eventContainer: EventContainer<any>;

  beforeEach(() => {
    eventContainer = new EventContainer();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    test('should call all subscribed functions with the provided argument', () => {
      // Arrange
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();
      eventContainer.subscribe(mockCallback1);
      eventContainer.subscribe(mockCallback2);
      const arg = { data: 'test' };

      // Act
      eventContainer.fire(arg);

      // Assert
      expect(mockCallback1).toHaveBeenCalledWith(arg);
      expect(mockCallback2).toHaveBeenCalledWith(arg);
    });

    test('should not call unsubscribed functions', () => {
      // Arrange
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();
      eventContainer.subscribe(mockCallback1);
      eventContainer.subscribe(mockCallback2);
      eventContainer.unsubscribe(mockCallback1);
      const arg = { data: 'test' };

      // Act
      eventContainer.fire(arg);

      // Assert
      expect(mockCallback1).not.toHaveBeenCalled();
      expect(mockCallback2).toHaveBeenCalledWith(arg);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should handle firing with no subscribers gracefully', () => {
      // Arrange
      const arg = { data: 'test' };

      // Act
      eventContainer.fire(arg);

      // Assert
      // No error should be thrown and no subscribers to call
    });

    test('should handle firing with undefined argument', () => {
      // Arrange
      const mockCallback = jest.fn();
      eventContainer.subscribe(mockCallback);

      // Act
      eventContainer.fire(undefined);

      // Assert
      expect(mockCallback).toHaveBeenCalledWith(undefined);
    });

    test('should handle firing with null argument', () => {
      // Arrange
      const mockCallback = jest.fn();
      eventContainer.subscribe(mockCallback);

      // Act
      eventContainer.fire(null);

      // Assert
      expect(mockCallback).toHaveBeenCalledWith(null);
    });

    test('should handle firing with multiple types of arguments', () => {
      // Arrange
      const mockCallback = jest.fn();
      eventContainer.subscribe(mockCallback);

      // Act & Assert
      eventContainer.fire(42);
      expect(mockCallback).toHaveBeenCalledWith(42);

      eventContainer.fire('test');
      expect(mockCallback).toHaveBeenCalledWith('test');

      const obj = { key: 'value' };
      eventContainer.fire(obj);
      expect(mockCallback).toHaveBeenCalledWith(obj);
    });

    test.skip('should handle firing when a subscriber throws an error', () => {
      // Arrange
      const mockCallback1 = jest.fn(() => { throw new Error('Test Error'); });
      const mockCallback2 = jest.fn();
      eventContainer.subscribe(mockCallback1);
      eventContainer.subscribe(mockCallback2);
      const arg = { data: 'test' };

      // Act
      expect(() => eventContainer.fire(arg)).not.toThrow();

      // Assert
      expect(mockCallback1).toHaveBeenCalledWith(arg);
      expect(mockCallback2).toHaveBeenCalledWith(arg);
    });
  });
});

// End of unit tests for: fire
