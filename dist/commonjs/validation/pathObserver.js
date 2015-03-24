"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var ObserverLocator = require("aurelia-binding").ObserverLocator;

var PathObserver = exports.PathObserver = (function () {
    function PathObserver(observerLocator, subject, path) {
        _classCallCheck(this, PathObserver);

        this.observerLocator = observerLocator;
        this.path = path.split(".");
        this.subject = subject;
        this.observers = [];
        this.callbacks = [];
        if (this.path.length > 1) this.observeParts();

        //TODO: this should be replaced with reuse of the Binding system
    }

    _createClass(PathObserver, {
        observeParts: {
            value: function observeParts(propertyName) {
                var _this = this;

                //remove old chain until an observer returns non-null
                if (propertyName !== undefined && propertyName !== null) {
                    for (var i = this.observers.length - 1; i >= 0; i--) {
                        var currentObserver = this.observers[i];
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

                var currentSubject = this.subject;
                //add new observers
                var observersAreComplete = this.observers.length === this.path.length;
                for (var i = 0; i < this.path.length; i++) {
                    var _ret = (function (i) {
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
                            return "break";
                        } else {
                            currentSubject = currentValue;
                        }
                    })(i);

                    if (_ret === "break") break;
                }

                //if the last observer is the real one
                if (!observersAreComplete && this.observers.length === this.path.length) {
                    var actualObserver = this.observers[this.observers.length - 1];
                    for (var i = 0; i < this.callbacks.length; i++) {
                        //TODO proper cleanup of callbacks!
                        actualObserver.subscribe(this.callbacks[i]);
                    }
                }
            }
        },
        observePart: {
            value: function observePart(part) {
                if (part !== this.path[this.path.length - 1]) {
                    this.observerParts();
                }
            }
        },
        getObserver: {
            value: function getObserver() {
                if (this.path.length == 1) {
                    return this.observerLocator.getObserver(this.subject, this.path[0]);
                }return this;
            }
        },
        getValue: {
            value: function getValue() {
                //Verify that all observers are current.
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
                    if (currentObserver.obj !== expectedSubject)
                        //Happens if you set a value somewhere along the binding path and immediately call getValue (on the very last observer)
                        {
                            this.observeParts(this.path[i - 1]);
                            break;
                        }
                    expectedSubject = currentObserver.getValue();
                }

                if (this.observers.length !== this.path.length) {
                    return undefined;
                } //Something along the binding path returned null/undefined
                var value = this.observers[this.observers.length - 1].getValue();
                return value;
            }
        },
        subscribe: {
            value: function subscribe(callback) {
                this.callbacks.unshift(callback);
                if (this.observers.length === this.path.length) {
                    return this.observers[0].subscribe(callback);
                }
                //TODO proper cleanup of callbacks!
            }
        }
    });

    return PathObserver;
})();