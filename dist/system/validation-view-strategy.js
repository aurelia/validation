'use strict';

System.register([], function (_export, _context) {
  var ValidationViewStrategy;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('ValidationViewStrategy', ValidationViewStrategy = function () {
        function ValidationViewStrategy() {
          _classCallCheck(this, ValidationViewStrategy);

          this.bindingPathAttributes = ['validate', 'value.bind', 'value.two-way'];
        }

        ValidationViewStrategy.prototype.getValidationProperty = function getValidationProperty(validation, element) {
          var atts = element.attributes;
          for (var i = 0; i < this.bindingPathAttributes.length; i++) {
            var attributeName = this.bindingPathAttributes[i];
            var bindingPath = void 0;
            var validationProperty = void 0;
            if (atts[attributeName]) {
              bindingPath = atts[attributeName].value.trim();
              if (bindingPath.indexOf('|') !== -1) {
                bindingPath = bindingPath.split('|')[0].trim();
              }

              validationProperty = validation.result.properties[bindingPath];
              if (attributeName === 'validate' && (validationProperty === null || validationProperty === undefined)) {
                validation.ensure(bindingPath);
                validationProperty = validation.result.properties[bindingPath];
              }
              return validationProperty;
            }
          }

          return null;
        };

        ValidationViewStrategy.prototype.prepareElement = function prepareElement(validationProperty, element) {
          throw Error('View strategy must implement prepareElement(validationProperty, element)');
        };

        ValidationViewStrategy.prototype.updateElement = function updateElement(validationProperty, element) {
          throw Error('View strategy must implement updateElement(validationProperty, element)');
        };

        return ValidationViewStrategy;
      }());

      _export('ValidationViewStrategy', ValidationViewStrategy);
    }
  };
});