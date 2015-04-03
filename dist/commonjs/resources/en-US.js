"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
//en-US is loaded by default.
//to the rest of the world: I'm so very sorry.

var data = {
  settings: {
    numericRegex: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    isRequired: "is required",
    AlphaNumericOrWhitespaceValidationRule: function (newValue, threshold) {
      return "can contain only alphanumerical characters or spaces";
    },
    AlphaNumericValidationRule: function (newValue, threshold) {
      return "can contain only alphanumerical characters";
    },
    BetweenLengthValidationRule: function (newValue, threshold) {
      return "needs to be at between " + threshold.minimumLength + " and " + threshold.maximumLength + " characters long";
    },
    BetweenValueValidationRule: function (newValue, threshold) {
      return "needs to be between " + threshold.minimumValue + " and " + threshold.maximumValue;
    },
    CustomFunctionValidationRule: function (newValue, threshold) {
      return "not a valid value";
    },
    DigitValidationRule: function (newValue, threshold) {
      return "can contain only digits";
    },
    EmailValidationRule: function (newValue, threshold) {
      return "is not a valid email address";
    },
    EqualityValidationRule: function (newValue, threshold) {
      if (threshold.otherValueLabel) if (threshold.equality) return "does not match " + threshold.otherValueLabel;else return "cannot not match " + threshold.otherValueLabel;else if (threshold.equality) return "should be " + threshold.otherValue;else return "cannot not be " + threshold.otherValue;
    },
    InCollectionValidationRule: function (newValue, threshold) {
      return "not a valid value";
    },
    MinimumLengthValidationRule: function (newValue, threshold) {
      return "needs to be at least " + threshold + " characters long";
    },
    MinimumValueValidationRule: function (newValue, threshold) {
      return "needs to be " + threshold + " or more";
    },
    MaximumLengthValidationRule: function (newValue, threshold) {
      return "cannot be longer then " + threshold + " characters";
    },
    MaximumValueValidationRule: function (newValue, threshold) {
      return "needs to be less than " + threshold;
    },
    NumericValidationRule: function (newValue, threshold) {
      return "needs to be a number";
    },
    RegexValidationRule: function (newValue, threshold) {
      return "not a valid value";
    },
    StrongPasswordValidationRule: function (newValue, threshold) {
      if (threshold == 4) return "should contain a combination of lowercase letters, uppercase letters, digits and special characters";else return "should contain at least " + threshold + " of the following groups: lowercase letters, uppercase letters, digits or special characters";
    }
  }
};
exports.data = data;