export let PathObserver = class PathObserver {
  constructor(observerLocator, subject, path) {
    this.observerLocator = observerLocator;
    this.path = path.split('.');
    this.subject = subject;
    this.observers = [];
    this.callbacks = [];
    if (this.path.length > 1) {
      this.observeParts();
    }
  }
  observeParts(propertyName) {
    let currentSubject = this.subject;
    let observersAreComplete;

    if (propertyName !== undefined && propertyName !== null) {
      for (let i = this.observers.length - 1; i >= 0; i--) {
        let currentObserver = this.observers[i];
        let observer;
        if (currentObserver.propertyName === propertyName) {
          break;
        }
        observer = this.observers.pop();
        if (observer && observer.subscription) {
          observer.subscription();
        }
      }
    }

    observersAreComplete = this.observers.length === this.path.length;
    for (let i = 0; i < this.path.length; i++) {
      let observer = this.observers[i];
      let currentPath = this.path[i];
      let subscription;
      let currentValue;
      if (!observer) {
        observer = this.observerLocator.getObserver(currentSubject, currentPath);
        this.observers.push(observer);
        subscription = observer.subscribe((newValue, oldValue) => {
          this.observeParts(observer.propertyName);
        });
        observer.subscription = subscription;
      }
      currentValue = observer.getValue();
      if (currentValue === undefined || currentValue === null) {
        break;
      } else {
        currentSubject = currentValue;
      }
    }

    if (!observersAreComplete && this.observers.length === this.path.length) {
      let actualObserver = this.observers[this.observers.length - 1];
      for (let i = 0; i < this.callbacks.length; i++) {
        actualObserver.subscribe(this.callbacks[i]);
      }
    }
  }
  observePart(part) {
    if (part !== this.path[this.path.length - 1]) {
      this.observeParts();
    }
  }
  getObserver() {
    if (this.path.length === 1) {
      this.subject[this.path[0]];
      return this.observerLocator.getObserver(this.subject, this.path[0]);
    }
    return this;
  }
  getValue() {
    let expectedSubject = this.subject;
    for (let i = 0; this.path.length; i++) {
      let currentObserver = this.observers[i];
      if (currentObserver === null || currentObserver === undefined) {
        this.observeParts(this.path[i]);
        currentObserver = this.observers[i];

        if (currentObserver === null || currentObserver === undefined) {
          break;
        }
      }

      if (currentObserver.obj !== expectedSubject) {
        this.observeParts(this.path[i - 1]);
        break;
      }
      expectedSubject = currentObserver.getValue();
    }

    if (this.observers.length !== this.path.length) {
      return undefined;
    }
    let value = this.observers[this.observers.length - 1].getValue();
    return value;
  }

  subscribe(callback) {
    this.callbacks.unshift(callback);
    if (this.observers.length === this.path.length) {
      this.subscription = this.observers[this.observers.length - 1].subscribe(callback);
      return () => this.unsubscribe();
    }
  }

  unsubscribe() {
    this.callbacks = [];
    if (this.subscription) {
      this.subscription();
    }
    for (let i = this.observers.length - 1; i >= 0; i--) {
      let observer = this.observers.pop();
      if (observer && observer.subscription) {
        observer.subscription();
      }
    }
  }
};