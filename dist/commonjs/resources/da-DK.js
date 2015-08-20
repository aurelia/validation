'use strict';

exports.__esModule = true;

var _validationUtilities = require('../validation/utilities');

var data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'er påkrævet',
    'onValidateCallback': 'ikke gyldig værdi',
    'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
      return 'kan kun indeholde alfanumeriske tegn eller mellemrum';
    },
    'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
      return 'kan kun indeholde alfanumeriske tegn';
    },
    'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
      return 'kan kun indeholde bogstaver';
    },
    'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
      return 'kan kun indeholde bogstaver og mellemrum';
    },
    'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
      return 'skal være imellem ' + _validationUtilities.Utilities.getValue(threshold.minimumLength) + ' og ' + _validationUtilities.Utilities.getValue(threshold.maximumLength) + ' tegn lang';
    },
    'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
      return 'skal være imellem ' + _validationUtilities.Utilities.getValue(threshold.minimumValue) + ' og ' + _validationUtilities.Utilities.getValue(threshold.maximumValue);
    },
    'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
      return 'ikke en gyldig værdi';
    },
    'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
      return 'kan kun indeholde tal';
    },
    'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
      return 'ikke gyldig e-mailadresse';
    },
    'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
      return 'burde være ' + _validationUtilities.Utilities.getValue(threshold.otherValue);
    },
    'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
      return 'kan ikke være ' + _validationUtilities.Utilities.getValue(threshold.otherValue);
    },
    'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
      return 'er ikke ens ' + _validationUtilities.Utilities.getValue(threshold.otherValueLabel);
    },
    'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
      return 'kan ikke være ens ' + _validationUtilities.Utilities.getValue(threshold.otherValueLabel);
    },
    'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
      return 'ikke en gyldig værdi';
    },
    'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
      return 'skal være ' + _validationUtilities.Utilities.getValue(threshold) + ' eller højere';
    },
    'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
      return 'skal være mindst ' + _validationUtilities.Utilities.getValue(threshold) + ' tegn lang';
    },
    'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
      return 'skal være større end ' + _validationUtilities.Utilities.getValue(threshold);
    },
    'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
      return 'skal være ' + _validationUtilities.Utilities.getValue(threshold) + ' eller mindre';
    },
    'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
      return 'kan ikke være længere end ' + _validationUtilities.Utilities.getValue(threshold) + ' tegn';
    },
    'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
      return 'skal være mindre end ' + _validationUtilities.Utilities.getValue(threshold);
    },
    'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
      return 'skal være en talværdi';
    },
    'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
      return 'må ikke indeholde mellemrum';
    },
    'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
      return 'ikke en gyldig værdi';
    },
    'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
      return 'ikke en gyldig værdi';
    },
    'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
      return 'skal være en kombination af små bogstaver, store bogstaver, tal og specialtegn';
    },
    'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
      return 'skal indeholde mindst ' + _validationUtilities.Utilities.getValue(threshold) + ' af de følgende grupper: små bogstaver, store bogstaver, tal og specialtegn';
    },
    'URLValidationRule': function URLValidationRule(newValue, threshold) {
      return 'ikke en gyldig URL';
    }
  }
};
exports.data = data;