define(["exports", "../validation/validation-group-builder", "../validation/validation-result"], function (exports, _validationValidationGroupBuilder, _validationValidationResult) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var ValidationGroupBuilder = _validationValidationGroupBuilder.ValidationGroupBuilder;
  var ValidationResult = _validationValidationResult.ValidationResult;

  /**
   * Encapsulates validation rules and their current validation state for a given subject
   * @class ValidationGroup
   * @constructor
   */

  var ValidationGroup = exports.ValidationGroup = (function () {
    /**
     * Instantiates a new {ValidationGroup}
     * @param subject The subject to evaluate
     * @param observerLocator The observerLocator used to monitor changes on the subject
     */

    function ValidationGroup(subject, observerLocator) {
      _classCallCheck(this, ValidationGroup);

      this.result = new ValidationResult();
      this.subject = subject;
      this.validationProperties = [];
      this.builder = new ValidationGroupBuilder(observerLocator, this);
    }

    _createClass(ValidationGroup, {
      checkAll: {

        /**
         * Causes each property to re-evaluate: gets the latest value, marks the property as 'dirty', runs validation rules on latest value, updates this.result
         * @returns {bool} True/false indicating if every property is valid
         */

        value: function checkAll() {
          for (var i = this.validationProperties.length - 1; i >= 0; i--) {
            var validatorProperty = this.validationProperties[i];
            validatorProperty.validateCurrentValue(true);
          }
          return this.result.isValid;
        }
      },
      ensure: {

        /**
         * Adds a validation property for the specified path
         * @param {String} propertyPath the path of the property/field, for example 'firstName' or 'address.muncipality.zipCode'
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function ensure(propertyPath) {
          return this.builder.ensure(propertyPath);
        }
      },
      notEmpty: {

        /**
         * Adds a validation rule that checks a value for being 'notEmpty', 'required'
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function notEmpty() {
          return this.builder.notEmpty();
        }
      },
      minimum: {

        /**
         * Adds a validation rule that checks a value for being greater than or equal to a threshold
         * @param minimumValue the threshold
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function minimum(minimumValue) {
          return this.builder.minimum(minimumValue);
        }
      },
      between: {

        /**
         * Adds a validation rule that checks a value for being greater than or equal to a threshold, and less than another threshold
         * @param minimumValue The minimum threshold
         * @param maximumValue The maximum threshold
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function between(minimumValue, maximumValue) {
          return this.builder.between(minimumValue, maximumValue);
        }
      },
      maximum: {

        /**
         * Adds a validation rule that checks a value for being less than a threshold
         * @param maximumValue The threshold
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function maximum(maximumValue) {
          return this.builder.maximum(maximumValue);
        }
      },
      equals: {

        /**
         * Adds a validation rule that checks a value for being equal to a threshold
         * @param otherValue The threshold
         * @param otherValueLabel Optional: a label to use in the validation message
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function equals(otherValue, otherValueLabel) {
          return this.builder.equals(otherValue, otherValueLabel);
        }
      },
      notEquals: {

        /**
         * Adds a validation rule that checks a value for not being equal to a threshold
         * @param otherValue The threshold
         * @param otherValueLabel Optional: a label to use in the validation message
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function notEquals(otherValue, otherValueLabel) {
          return this.builder.notEquals(otherValue, otherValueLabel);
        }
      },
      email: {

        /**
         * Adds a validation rule that checks a value for being a valid email address
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function email() {
          return this.builder.email();
        }
      },
      "in": {

        /**
         * Adds a validation rule that checks a value for being equal to at least one other value in a particular collection
         * @param collection The threshold
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function _in(collection) {
          return this.builder["in"](collection);
        }
      },
      minLength: {

        /**
         * Adds a validation rule that checks a value for having a length greater than or equal to a specified threshold
         * @param minimumValue The threshold
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function minLength(minimumValue) {
          return this.builder.minLength(minimumValue);
        }
      },
      maxLength: {

        /**
         * Adds a validation rule that checks a value for having a length less than a specified threshold
         * @param maximumValue The threshold
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function maxLength(maximumValue) {
          return this.builder.maxLength(maximumValue);
        }
      },
      betweenLength: {
        /**
         * Adds a validation rule that checks a value for having a length greater than or equal to a specified threshold and less than another threshold
         * @param minimumValue The minimum threshold
         * @param maximumValue The maximum threshold
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function betweenLength(minimumValue, maximumValue) {
          return this.builder.betweenLength(minimumValue, maximumValue);
        }
      },
      isNumeric: {

        /**
         * Adds a validation rule that checks a value for being numeric, this includes formatted numbers like '-3,600.25'
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function isNumeric() {
          return this.builder.isNumeric();
        }
      },
      isDigit: {

        /**
         * Adds a validation rule that checks a value for being strictly numeric, this excludes formatted numbers like '-3,600.25'
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function isDigit() {
          return this.builder.isDigit();
        }
      },
      isAlphanumeric: {

        /**
         * Adds a validation rule that checks a value for only containing alphanumerical characters
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function isAlphanumeric() {
          return this.builder.isAlphaNumeric();
        }
      },
      isAlphanumericOrWhitespace: {

        /**
         * Adds a validation rule that checks a value for only containing alphanumerical characters or whitespace
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function isAlphanumericOrWhitespace() {
          return this.builder.isAlphanumericOrWhitespace();
        }
      },
      isStrongPassword: {

        /**
         * Adds a validation rule that checks a value for being a strong password. A strong password contains at least the specified of the following groups: lowercase characters, uppercase characters, digits and special characters.
         * @param minimumComplexityLevel {Number} Optionally, specifiy the number of groups to match. Default is 4.
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function isStrongPassword(minimumComplexityLevel) {
          return this.builder.isStrongPassword(minimumComplexityLevel);
        }
      },
      matchesRegex: {

        /**
         * Adds a validation rule that checks a value for matching a particular regex
         * @param regexString {String} the regex to match
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function matchesRegex(regexString) {
          return this.builder.matchesRegex(regexString);
        }
      },
      matches: {

        /**
         * Adds a validation rule that checks a value for matching a particular regex
         * @param regexString {Regex} the regex to match
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function matches(regex) {
          return this.builder.matches(regex);
        }
      },
      passes: {

        /**
         * Adds a validation rule that checks a value for passing a custom function
         * @param customFunction {Function} The custom function that needs to pass, that takes two arguments: newValue (the value currently being evaluated) and optionally: threshold, and returns true/false.
         * @param threshold {Object} An optional threshold that will be passed to the customFunction
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function passes(customFunction, threshold) {
          return this.builder.passes(customFunction, threshold);
        }
      },
      passesRule: {

        /**
         * Adds the {ValidationRule}
         * @param validationRule {ValudationRule} The rule that needs to pass
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function passesRule(validationRule) {
          return this.builder.passesRule(validationRule);
        }
      },
      "if": {

        /**
         * Specifies that the next validation rules only need to be evaluated when the specified conditionExpression is true
         * @param conditionExpression {Function} a function that returns true of false.
         * @param threshold {Object} an optional treshold object that is passed to the conditionExpression
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function _if(conditionExpression, threshold) {
          return this.builder["if"](conditionExpression, threshold);
        }
      },
      "else": {

        /**
         * Specifies that the next validation rules only need to be evaluated when the previously specified conditionExpression is false.
         * See: if(conditionExpression, threshold)
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function _else() {
          return this.builder["else"]();
        }
      },
      endIf: {

        /**
         * Specifies that the execution of next validation rules no longer depend on the the previously specified conditionExpression.
         * See: if(conditionExpression, threshold)
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function endIf() {
          return this.builder.endIf();
        }
      },
      "switch": {

        /**
         * Specifies that the next validation rules only need to be evaluated when they are preceded by a case that matches the conditionExpression
         * @param conditionExpression {Function} a function that returns a case label to execute. This is optional, when omitted the case label will be matched using the underlying property's value
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function _switch(conditionExpression) {
          return this.builder["switch"](conditionExpression);
        }
      },
      "case": {

        /**
         * Specifies that the next validation rules only need to be evaluated when the caseLabel matches the value returned by a preceding switch statement
         * See: switch(conditionExpression)
         * @param caseLabel {Object} the case label
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function _case(caseLabel) {
          return this.builder["case"](caseLabel);
        }
      },
      "default": {
        /**
         * Specifies that the next validation rules only need to be evaluated when not other caseLabel matches the value returned by a preceding switch statement
         * See: switch(conditionExpression)
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function _default() {
          return this.builder["default"]();
        }
      },
      endSwitch: {
        /**
         * Specifies that the execution of next validation rules no longer depend on the the previously specified conditionExpression.
         * See: switch(conditionExpression)
         * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
         */

        value: function endSwitch() {
          return this.builder.endSwitch();
        }
      }
    });

    return ValidationGroup;
  })();
});