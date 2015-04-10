System.register([], function (_export) {
  var _classCallCheck, ValidationLocaleDefaults;

  return {
    setters: [],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      ValidationLocaleDefaults = function ValidationLocaleDefaults() {
        _classCallCheck(this, ValidationLocaleDefaults);

        this.settings = {
          numericRegex: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
        };
        this.messages = {
          isRequired: 'is required',
          AlphaNumericOrWhitespaceValidationRule: function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
            return 'can contain only alphanumerical characters or spaces';
          },
          AlphaNumericValidationRule: function AlphaNumericValidationRule(newValue, threshold) {
            return 'can contain only alphanumerical characters';
          },
          AlphaValidationRule: function AlphaValidationRule(newValue, threshold) {
            return 'can contain only letters';
          },
          AlphaOrWhitespaceValidationRule: function AlphaOrWhitespaceValidationRule(newValue, threshold) {
            return 'can contain only letters or spaces';
          },
          BetweenLengthValidationRule: function BetweenLengthValidationRule(newValue, threshold) {
            return 'needs to be at between ' + threshold.minimumLength + ' and ' + threshold.maximumLength + ' characters long';
          },
          BetweenValueValidationRule: function BetweenValueValidationRule(newValue, threshold) {
            return 'needs to be between ' + threshold.minimumValue + ' and ' + threshold.maximumValue;
          },
          CustomFunctionValidationRule: function CustomFunctionValidationRule(newValue, threshold) {
            return 'not a valid value';
          },
          DigitValidationRule: function DigitValidationRule(newValue, threshold) {
            return 'can contain only digits';
          },
          EmailValidationRule: function EmailValidationRule(newValue, threshold) {
            return 'is not a valid email address';
          },
          EqualityValidationRule: function EqualityValidationRule(newValue, threshold) {
            if (threshold.otherValueLabel) if (threshold.equality) {
              return 'does not match ' + threshold.otherValueLabel;
            } else {
              return 'cannot not match ' + threshold.otherValueLabel;
            } else if (threshold.equality) {
              return 'should be ' + threshold.otherValue;
            } else {
              return 'cannot not be ' + threshold.otherValue;
            }
          },
          InCollectionValidationRule: function InCollectionValidationRule(newValue, threshold) {
            return 'not a valid value';
          },
          MinimumLengthValidationRule: function MinimumLengthValidationRule(newValue, threshold) {
            return 'needs to be at least ' + threshold + ' characters long';
          },
          MinimumValueValidationRule: function MinimumValueValidationRule(newValue, threshold) {
            return 'needs to be ' + threshold + ' or more';
          },
          MaximumLengthValidationRule: function MaximumLengthValidationRule(newValue, threshold) {
            return 'cannot be longer then ' + threshold + ' characters';
          },
          MaximumValueValidationRule: function MaximumValueValidationRule(newValue, threshold) {
            return 'needs to be less than ' + threshold;
          },
          NumericValidationRule: function NumericValidationRule(newValue, threshold) {
            return 'needs to be a number';
          },
          RegexValidationRule: function RegexValidationRule(newValue, threshold) {
            return 'not a valid value';
          },
          StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
            if (threshold == 4) {
              return 'should contain a combination of lowercase letters, uppercase letters, digits and special characters';
            } else {
              return 'should contain at least ' + threshold + ' of the following groups: lowercase letters, uppercase letters, digits or special characters';
            }
          }
        };
      };

      _export('ValidationLocaleDefaults', ValidationLocaleDefaults);
    }
  };
});