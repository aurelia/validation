'use strict';

exports.__esModule = true;

var _Utilities = require('../validation/utilities');

var data = {
  settings: {
    numericRegex: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    isRequired: 'is required',
    onValidateCallback: 'not a valid value',
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
      return 'needs to be between ' + _Utilities.Utilities.getValue(threshold.minimumLength) + ' and ' + _Utilities.Utilities.getValue(threshold.maximumLength) + ' characters long';
    },
    BetweenValueValidationRule: function BetweenValueValidationRule(newValue, threshold) {
      return 'needs to be between ' + _Utilities.Utilities.getValue(threshold.minimumValue) + ' and ' + _Utilities.Utilities.getValue(threshold.maximumValue);
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
      return 'should be ' + _Utilities.Utilities.getValue(threshold.otherValue);
    },
    InEqualityValidationRule: function InEqualityValidationRule(newValue, threshold) {
      return 'cannot be ' + _Utilities.Utilities.getValue(threshold.otherValue);
    },
    EqualityWithOtherLabelValidationRule: function EqualityWithOtherLabelValidationRule(newValue, threshold) {
      return 'does not match ' + _Utilities.Utilities.getValue(threshold.otherValueLabel);
    },
    InEqualityWithOtherLabelValidationRule: function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
      return 'cannot match ' + _Utilities.Utilities.getValue(threshold.otherValueLabel);
    },
    InCollectionValidationRule: function InCollectionValidationRule(newValue, threshold) {
      return 'not a valid value';
    },
    MinimumInclusiveValueValidationRule: function MinimumInclusiveValueValidationRule(newValue, threshold) {
      return 'needs to be ' + _Utilities.Utilities.getValue(threshold) + ' or more';
    },
    MinimumLengthValidationRule: function MinimumLengthValidationRule(newValue, threshold) {
      return 'needs to be at least ' + _Utilities.Utilities.getValue(threshold) + ' characters long';
    },
    MinimumValueValidationRule: function MinimumValueValidationRule(newValue, threshold) {
      return 'needs to be more than ' + _Utilities.Utilities.getValue(threshold);
    },
    MaximumInclusiveValueValidationRule: function MaximumInclusiveValueValidationRule(newValue, threshold) {
      return 'needs to be ' + _Utilities.Utilities.getValue(threshold) + ' or less';
    },
    MaximumLengthValidationRule: function MaximumLengthValidationRule(newValue, threshold) {
      return 'cannot be longer then ' + _Utilities.Utilities.getValue(threshold) + ' characters';
    },
    MaximumValueValidationRule: function MaximumValueValidationRule(newValue, threshold) {
      return 'needs to be less than ' + _Utilities.Utilities.getValue(threshold);
    },
    NumericValidationRule: function NumericValidationRule(newValue, threshold) {
      return 'needs to be a number';
    },
    RegexValidationRule: function RegexValidationRule(newValue, threshold) {
      return 'not a valid value';
    },
    ContainsOnlyValidationRule: function ContainsOnlyValidationRule(newValue, threshold) {
      return 'not a valid value';
    },
    StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
      return 'should contain a combination of lowercase letters, uppercase letters, digits and special characters';
    },
    MediumPasswordValidationRule: function MediumPasswordValidationRule(newValue, threshold) {
      return 'should contain at least ' + _Utilities.Utilities.getValue(threshold) + ' of the following groups: lowercase letters, uppercase letters, digits or special characters';
    }
  }
};
exports.data = data;