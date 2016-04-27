'use strict';

System.register([], function (_export, _context) {
  var ValidationReporter;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('ValidationReporter', ValidationReporter = function () {
        function ValidationReporter() {
          _classCallCheck(this, ValidationReporter);
        }

        ValidationReporter.prototype.add = function add(object) {
          throw new Error('A ValidationReporter must implement add(...)');
        };

        ValidationReporter.prototype.remove = function remove(object) {
          throw new Error('A ValidationReporter must implement remove(...)');
        };

        ValidationReporter.prototype.subscribe = function subscribe(callback) {
          throw new Error('A ValidationReporter must implement subscribe(...)');
        };

        ValidationReporter.prototype.publish = function publish(errors) {
          throw new Error('A ValidationReporter must implement publish(...)');
        };

        ValidationReporter.prototype.destroyObserver = function destroyObserver(observer) {
          throw new Error('A ValidationReporter must implement destroyObserver(...)');
        };

        return ValidationReporter;
      }());

      _export('ValidationReporter', ValidationReporter);
    }
  };
});