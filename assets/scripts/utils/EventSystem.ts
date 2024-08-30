export class EventSystem {
  private static instance: EventSystem;
  private eventMap: Map<string, Array<{ callback: Function; context: any }>>;

  private constructor() {
    this.eventMap = new Map();
  }

  // Singleton instance
  public static getInstance(): EventSystem {
    if (!EventSystem.instance) {
      EventSystem.instance = new EventSystem();
    }
    return EventSystem.instance;
  }

  // Register an event listener
  public on(eventName: string, callback: Function, context?: any) {
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, []);
    }
    this.eventMap.get(eventName).push({ callback, context });
  }

  // Unregister an event listener
  public off(eventName: string, callback: Function, context?: any) {
    const listeners = this.eventMap.get(eventName);
    if (listeners) {
      this.eventMap.set(
        eventName,
        listeners.filter(
          (listener) =>
            listener.callback !== callback || listener.context !== context
        )
      );
    }
  }

  // Emit an event
  public emit(eventName: string, data?: any) {
    const listeners = this.eventMap.get(eventName);
    if (listeners) {
      listeners.forEach((listener) => {
        listener.callback.call(listener.context, data);
      });
    }
  }

  // Clear all listeners for an event
  public clear(eventName: string) {
    this.eventMap.delete(eventName);
  }

  // Clear all events and listeners
  public clearAll() {
    this.eventMap.clear();
  }
}
