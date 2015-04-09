System.register(['aurelia-binding'], function (_export) {
  var ObserverLocator, _classCallCheck, _createClass, PathObserver;

  return {
    setters: [function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      PathObserver = (function () {
        function PathObserver(observerLocator, subject, path) {
          _classCallCheck(this, PathObserver);

          this.observerLocator = observerLocator;
          this.path = path.split('.');
          this.subject = subject;
          this.observers = [];
          this.callbacks = [];
          if (this.path.length > 1) this.observeParts();
        }

        _createClass(PathObserver, [{
          key: 'observeParts',
          value: function observeParts(propertyName) {
            var _this = this;

            if (propertyName !== undefined && propertyName !== null) {
              for (var i = this.observers.length - 1; i >= 0; i--) {
                var currentObserver = this.observers[i];
                if (currentObserver.propertyName === propertyName) {
                  break;
                }
                var observer = this.observers.pop();
                if (observer && observer.subscription) {
                  observer.subscription();
                }
              }
            }

            var currentSubject = this.subject;

            var observersAreComplete = this.observers.length === this.path.length;

            var _loop = function (i) {
              var observer = _this.observers[i];
              if (!observer) {

                var currentPath = _this.path[i];
                observer = _this.observerLocator.getObserver(currentSubject, currentPath);
                _this.observers.push(observer);
                var subscription = observer.subscribe(function (newValue, oldValue) {
                  _this.observeParts(observer.propertyName);
                });
                observer.subscription = subscription;
              }

              var currentValue = observer.getValue();
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
          }
        }, {
          key: 'observePart',
          value: function observePart(part) {
            if (part !== this.path[this.path.length - 1]) {
              this.observerParts();
            }
          }
        }, {
          key: 'getObserver',
          value: function getObserver() {
            if (this.path.length == 1) {
              return this.observerLocator.getObserver(this.subject, this.path[0]);
            }return this;
          }
        }, {
          key: 'getValue',
          value: function getValue() {
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
          }
        }, {
          key: 'subscribe',
          value: function subscribe(callback) {
            this.callbacks.unshift(callback);
            if (this.observers.length === this.path.length) {
              return this.observers[this.observers.length - 1].subscribe(callback);
            }
          }
        }]);

        return PathObserver;
      })();

      _export('PathObserver', PathObserver);
    }
  };
});