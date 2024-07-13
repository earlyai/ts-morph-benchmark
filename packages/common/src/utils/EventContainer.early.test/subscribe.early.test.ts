
// Unit tests for: subscribe

import { EventContainer } from '../EventContainer';


describe('EventContainer.subscribe() subscribe method', () => {
  let eventContainer: EventContainer<any>;

  beforeEach(() => {
    eventContainer = new EventContainer();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    test('should add a new subscription successfully', () => {
      const subscription = jest.fn();
      eventContainer.subscribe(subscription);
      eventContainer.fire('test');
      expect(subscription).toHaveBeenCalledWith('test');
    });

    test('should not add the same subscription twice', () => {
      const subscription = jest.fn();
      eventContainer.subscribe(subscription);
      eventContainer.subscribe(subscription);
      eventContainer.fire('test');
      expect(subscription).toHaveBeenCalledTimes(1);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test.skip('should handle subscribing a null or undefined subscription gracefully', () => {
      // @ts-ignore
      eventContainer.subscribe(null);
      // @ts-ignore
      eventContainer.subscribe(undefined);
      expect(eventContainer['#subscriptions'].length).toBe(0);
    });

    test('should handle subscribing a function that throws an error', () => {
      const subscription = jest.fn(() => {
        throw new Error('Test error');
      });
      eventContainer.subscribe(subscription);
      expect(() => eventContainer.fire('test')).toThrow('Test error');
    });

    test('should handle subscribing multiple different functions', () => {
      const subscription1 = jest.fn();
      const subscription2 = jest.fn();
      eventContainer.subscribe(subscription1);
      eventContainer.subscribe(subscription2);
      eventContainer.fire('test');
      expect(subscription1).toHaveBeenCalledWith('test');
      expect(subscription2).toHaveBeenCalledWith('test');
    });

    test('should handle subscribing a function that modifies the subscription list', () => {
      const subscription1 = jest.fn();
      const subscription2 = jest.fn(() => {
        eventContainer.unsubscribe(subscription1);
      });
      eventContainer.subscribe(subscription1);
      eventContainer.subscribe(subscription2);
      eventContainer.fire('test');
      expect(subscription1).toHaveBeenCalledWith('test');
      expect(subscription2).toHaveBeenCalledWith('test');
      eventContainer.fire('test');
      expect(subscription1).toHaveBeenCalledTimes(1);
      expect(subscription2).toHaveBeenCalledTimes(2);
    });
  });
});

// End of unit tests for: subscribe
