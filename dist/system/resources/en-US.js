System.register(['../utilities'], function (_export) {
  'use strict';

  var Utilities, data;
  return {
    setters: [function (_utilities) {
      Utilities = _utilities.Utilities;
    }],
    execute: function () {
      data = {
        settings: {
          'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
        },
        messages: {
          'isRequired': 'is required',
          'onValidateCallback': 'not a valid value',
          'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
            return 'can contain only alphanumerical characters or spaces';
          },
          'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
            return 'can contain only alphanumerical characters';
          },
          'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
            return 'can contain only letters';
          },
          'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
            return 'can contain only letters or spaces';
          },
          'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
            return 'needs to be between ' + Utilities.getValue(threshold.minimumLength) + ' and ' + Utilities.getValue(threshold.maximumLength) + ' characters long';
          },
          'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
            return 'needs to be between ' + Utilities.getValue(threshold.minimumValue) + ' and ' + Utilities.getValue(threshold.maximumValue);
          },
          'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
            return 'not a valid value';
          },
          'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
            return 'can contain only digits';
          },
          'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
            return 'is not a valid email address';
          },
          'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
            return 'should be ' + Utilities.getValue(threshold.otherValue);
          },
          'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
            return 'cannot be ' + Utilities.getValue(threshold.otherValue);
          },
          'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'does not match ' + Utilities.getValue(threshold.otherValueLabel);
          },
          'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'cannot match ' + Utilities.getValue(threshold.otherValueLabel);
          },
          'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
            return 'not a valid value';
          },
          'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
            return 'needs to be ' + Utilities.getValue(threshold) + ' or more';
          },
          'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
            return 'needs to be at least ' + Utilities.getValue(threshold) + ' characters long';
          },
          'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
            return 'needs to be more than ' + Utilities.getValue(threshold);
          },
          'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
            return 'needs to be ' + Utilities.getValue(threshold) + ' or less';
          },
          'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
            return 'cannot be longer than ' + Utilities.getValue(threshold) + ' characters';
          },
          'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
            return 'needs to be less than ' + Utilities.getValue(threshold);
          },
          'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
            return 'needs to be a number';
          },
          'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
            return 'cannot contain spaces';
          },
          'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
            return 'not a valid value';
          },
          'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
            return 'not a valid value';
          },
          'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
            return 'should contain a combination of lowercase letters, uppercase letters, digits and special characters';
          },
          'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
            return 'should contain at least ' + Utilities.getValue(threshold) + ' of the following groups: lowercase letters, uppercase letters, digits or special characters';
          },
          'URLValidationRule': function URLValidationRule(newValue, threshold) {
            return 'is not a valid URL';
          }
        }
      };

      _export('data', data);
    }
  };
});