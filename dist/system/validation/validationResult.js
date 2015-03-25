System.register([], function (_export) {
  var _createClass, _classCallCheck, ValidationResult, ValidationResultProperty;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _createClass = (function () {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value) prop.writable = true;
          }
          Object.defineProperties(target, props);
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      _classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };

      ValidationResult = _export("ValidationResult", (function () {
        function ValidationResult() {
          _classCallCheck(this, ValidationResult);

          this.isValid = true;
          this.properties = {};
        }

        _createClass(ValidationResult, {
          addProperty: {
            value: function addProperty(name) {
              if (!this.properties[name]) {
                this.properties[name] = new ValidationResultProperty(this);
              }
              return this.properties[name];
            }
          },
          checkValidity: {
            value: function checkValidity() {
              for (var propertyName in this.properties) {
                if (!this.properties[propertyName].isValid) {
                  this.isValid = false;
                  return;
                }
              }
              this.isValid = true;
            }
          }
        });

        return ValidationResult;
      })());
      ValidationResultProperty = _export("ValidationResultProperty", (function () {
        function ValidationResultProperty(group) {
          _classCallCheck(this, ValidationResultProperty);

          this.group = group;
          this.isValid = true;
          this.isDirty = false;
          this.message = null;
          this.failingRule = null;
          this.onValidateCallbacks = [];
        }

        _createClass(ValidationResultProperty, {
          onValidate: {
            value: function onValidate(onValidateCallback) {
              this.onValidateCallbacks.push(onValidateCallback);
            }
          },
          setValidity: {
            value: function setValidity(validationResponse, shouldBeDirty) {
              var notifyObservers = !this.isDirty && shouldBeDirty || this.isValid !== validationResponse.isValid || this.message !== validationResponse.message;

              if (shouldBeDirty) this.isDirty = true;
              this.message = validationResponse.message;
              this.failingRule = validationResponse.failingRule;
              this.isValid = validationResponse.isValid; //Set isValid last in case someone has observed 'isValid'

              if (this.isValid !== this.group.isValid) this.group.checkValidity();

              if (notifyObservers) {
                for (var i = 0; i < this.onValidateCallbacks.length; i++) {
                  var callback = this.onValidateCallbacks[i];
                  callback(this);
                }
              }
            }
          }
        });

        return ValidationResultProperty;
      })());
    }
  };
});
