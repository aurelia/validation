import {ObserverLocator} from 'aurelia-binding';

export class PathObserver {

  constructor(observerLocator, subject, path) {
    this.observerLocator = observerLocator;
    this.path = path.split('.');
    this.subject = subject;
    this.observers = [];
    this.callbacks = [];
    if (this.path.length > 1)
      this.observeParts();

    //TODO: this should be replaced with reuse of the Binding system

  }

  observeParts(propertyName) {
    //remove old chain until an observer returns non-null
    if (propertyName !== undefined && propertyName !== null) {
      for (let i = this.observers.length - 1; i >= 0; i--) {
        let currentObserver = this.observers[i];
        if (currentObserver.propertyName === propertyName) {
          break;
        }
        var observer = this.observers.pop();
        if (observer && observer.subscription) {
          //cleanup
          observer.subscription();
        }
      }
    }

    let currentSubject = this.subject;
    //add new observers
    var observersAreComplete = this.observers.length === this.path.length;
    for (let i = 0; i < this.path.length; i++) {
      let observer = this.observers[i];
      if (!observer) {

        let currentPath = this.path[i];
        observer = this.observerLocator.getObserver(currentSubject, currentPath);
        this.observers.push(observer);
        let subscription = observer.subscribe((newValue, oldValue) => {
          this.observeParts(observer.propertyName);
        });
        observer.subscription = subscription;
      }


      let currentValue = observer.getValue();
      if (currentValue === undefined || currentValue === null) {
        break;
      }
      else {
        currentSubject = currentValue;
      }
    }

    //if the last observer is the real one
    if (!observersAreComplete && this.observers.length === this.path.length) {
      var actualObserver = this.observers[this.observers.length - 1];
      for (let i = 0; i < this.callbacks.length; i++) {
        //TODO proper cleanup of callbacks!
        actualObserver.subscribe(this.callbacks[i]);
      }
    }
  }

  observePart(part) {
    if (part !== this.path[this.path.length - 1]) {
      this.observerParts();
    }
  }

  getObserver() {
    if (this.path.length == 1) {
      var resolve = this.subject[this.path[0]]; //binding issue with @bindable properties, see: https://github.com/aurelia/binding/issues/89
      return this.observerLocator.getObserver(this.subject, this.path[0]);
    }
    return this;
  }


  getValue() {
    //Verify that all observers are current.
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
      if (currentObserver.obj !== expectedSubject)
      //Happens if you set a value somewhere along the binding path and immediately call getValue (on the very last observer)
      {
        this.observeParts(this.path[i - 1]);
        break;
      }
      expectedSubject = currentObserver.getValue();
    }


    if (this.observers.length !== this.path.length)
      return undefined; //Something along the binding path returned null/undefined
    var value = this.observers[this.observers.length - 1].getValue();
    return value;
  }

  subscribe(callback) {
    this.callbacks.unshift(callback);
    if (this.observers.length === this.path.length) {
      return this.observers[this.observers.length - 1].subscribe(callback);
    }
    //TODO proper cleanup of callbacks
  }
}
