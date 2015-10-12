define(['exports'], function (exports) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var PathObserver = (function () {
    function PathObserver(observerLocator, subject, path) {
      _classCallCheck(this, PathObserver);

      this.observerLocator = observerLocator;
      this.path = path.split('.');
      this.subject = subject;
      this.observers = [];
      this.callbacks = [];
      if (this.path.length > 1) {
        this.observeParts();
      }
    }

    PathObserver.prototype.observeParts = function observeParts(propertyName) {
      var _this = this;

      var currentSubject = this.subject;
      var observersAreComplete = undefined;

      if (propertyName !== undefined && propertyName !== null) {
        for (var i = this.observers.length - 1; i >= 0; i--) {
          var currentObserver = this.observers[i];
          var observer = undefined;
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

      var _loop = function (i) {
        var observer = _this.observers[i];
        var currentPath = _this.path[i];
        var subscription = undefined;
        var currentValue = undefined;
        if (!observer) {
          observer = _this.observerLocator.getObserver(currentSubject, currentPath);
          _this.observers.push(observer);
          subscription = observer.subscribe(function (newValue, oldValue) {
            _this.observeParts(observer.propertyName);
          });
          observer.subscription = subscription;
        }
        currentValue = observer.getValue();
        if (currentValue === undefined || currentValue === null) {
          return 'break';
        } else {
          currentSubject = currentValue;
        }
      };

      for (var i = 0; i < this.path.length; i++) {
        var _ret = _loop(i);

        if (_ret === 'break') break;
      }

      if (!observersAreComplete && this.observers.length === this.path.length) {
        var actualObserver = this.observers[this.observers.length - 1];
        for (var i = 0; i < this.callbacks.length; i++) {
          actualObserver.subscribe(this.callbacks[i]);
        }
      }
    };

    PathObserver.prototype.observePart = function observePart(part) {
      if (part !== this.path[this.path.length - 1]) {
        this.observeParts();
      }
    };

    PathObserver.prototype.getObserver = function getObserver() {
      if (this.path.length === 1) {
        this.subject[this.path[0]];
        return this.observerLocator.getObserver(this.subject, this.path[0]);
      }
      return this;
    };

    PathObserver.prototype.getValue = function getValue() {
      var expectedSubject = this.subject;
      for (var i = 0; this.path.length; i++) {
        var currentObserver = this.observers[i];
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
      var value = this.observers[this.observers.length - 1].getValue();
      return value;
    };

    PathObserver.prototype.subscribe = function subscribe(callback) {
      var _this2 = this;

      this.callbacks.unshift(callback);
      if (this.observers.length === this.path.length) {
        this.subscription = this.observers[this.observers.length - 1].subscribe(callback);
        return function () {
          return _this2.unsubscribe();
        };
      }
    };

    PathObserver.prototype.unsubscribe = function unsubscribe() {
      this.callbacks = [];
      if (this.subscription) {
        this.subscription();
      }
      for (var i = this.observers.length - 1; i >= 0; i--) {
        var observer = this.observers.pop();
        if (observer && observer.subscription) {
          observer.subscription();
        }
      }
    };

    return PathObserver;
  })();

  exports.PathObserver = PathObserver;
});