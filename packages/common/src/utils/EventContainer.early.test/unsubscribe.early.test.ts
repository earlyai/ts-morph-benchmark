
// Unit tests for: unsubscribe

import { EventContainer, EventContainerSubscription } from '../EventContainer';


describe('EventContainer.unsubscribe() unsubscribe method', () => {
  let eventContainer: EventContainer<string>;
  let subscription1: EventContainerSubscription<string>;
  let subscription2: EventContainerSubscription<string>;

  beforeEach(() => {
    eventContainer = new EventContainer<string>();
    subscription1 = jest.fn();
    subscription2 = jest.fn();
  });

  describe('Happy Path', () => {
    test('should unsubscribe a previously subscribed event', () => {
      // Arrange
      eventContainer.subscribe(subscription1);
      eventContainer.subscribe(subscription2);

      // Act
      eventContainer.unsubscribe(subscription1);
      eventContainer.fire('test event');

      // Assert
      expect(subscription1).not.toHaveBeenCalled();
      expect(subscription2).toHaveBeenCalledWith('test event');
    });

    test('should do nothing if trying to unsubscribe a non-subscribed event', () => {
      // Arrange
      eventContainer.subscribe(subscription1);

      // Act
      eventContainer.unsubscribe(subscription2);
      eventContainer.fire('test event');

      // Assert
      expect(subscription1).toHaveBeenCalledWith('test event');
      expect(subscription2).not.toHaveBeenCalled();
    });

    test('should handle multiple unsubscriptions correctly', () => {
      // Arrange
      eventContainer.subscribe(subscription1);
      eventContainer.subscribe(subscription2);

      // Act
      eventContainer.unsubscribe(subscription1);
      eventContainer.unsubscribe(subscription2);
      eventContainer.fire('test event');

      // Assert
      expect(subscription1).not.toHaveBeenCalled();
      expect(subscription2).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should handle unsubscribing when no subscriptions exist', () => {
      // Act
      eventContainer.unsubscribe(subscription1);
      eventContainer.fire('test event');

      // Assert
      expect(subscription1).not.toHaveBeenCalled();
    });

    test('should handle unsubscribing the same subscription multiple times', () => {
      // Arrange
      eventContainer.subscribe(subscription1);

      // Act
      eventContainer.unsubscribe(subscription1);
      eventContainer.unsubscribe(subscription1);
      eventContainer.fire('test event');

      // Assert
      expect(subscription1).not.toHaveBeenCalled();
    });

    test('should handle unsubscribing a subscription that was never added', () => {
      // Act
      eventContainer.unsubscribe(subscription1);
      eventContainer.fire('test event');

      // Assert
      expect(subscription1).not.toHaveBeenCalled();
    });

    test('should handle unsubscribing when the subscription list is empty', () => {
      // Act
      eventContainer.unsubscribe(subscription1);
      eventContainer.fire('test event');

      // Assert
      expect(subscription1).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: unsubscribe
