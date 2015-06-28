define(['exports', '../validation/utilities'], function (exports, _validationUtilities) {
  'use strict';

  exports.__esModule = true;
  var data = {
    settings: {
      'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
    },
    messages: {
      'isRequired': 'е задължително',
      'onValidateCallback': 'невалидна стойност',
      'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
        return 'трябва да съдържа само букви, цифри и интервали';
      },
      'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
        return 'трябва да съдържа само букви и цифри';
      },
      'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
        return 'трябва да съдържа само букви';
      },
      'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
        return 'трябва да съдържа само букви или интервали';
      },
      'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
        return 'броят на символите трябва да бъде между ' + _validationUtilities.Utilities.getValue(threshold.minimumLength) + ' и ' + _validationUtilities.Utilities.getValue(threshold.maximumLength);
      },
      'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
        return 'стойността трябва да бъде между ' + _validationUtilities.Utilities.getValue(threshold.minimumValue) + ' и ' + _validationUtilities.Utilities.getValue(threshold.maximumValue);
      },
      'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
        return 'невалидна стойност';
      },
      'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
        return 'трябва да съдържа само цифри';
      },
      'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
        return 'невалидна електронна поща';
      },
      'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
        return 'стойността трябва да бъде ' + _validationUtilities.Utilities.getValue(threshold.otherValue);
      },
      'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
        return 'стойността не може да бъде ' + _validationUtilities.Utilities.getValue(threshold.otherValue);
      },
      'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'стойността не съвпада с ' + _validationUtilities.Utilities.getValue(threshold.otherValueLabel);
      },
      'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'стойността не може да съвпада с ' + _validationUtilities.Utilities.getValue(threshold.otherValueLabel);
      },
      'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
        return 'невалидна стойност';
      },
      'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
        return 'стойността трябва да бъде ' + _validationUtilities.Utilities.getValue(threshold) + ' или повече';
      },
      'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
        return 'броят на символите трябва да бъде поне ' + _validationUtilities.Utilities.getValue(threshold);
      },
      'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
        return 'стойността трябва да бъде повече от ' + _validationUtilities.Utilities.getValue(threshold);
      },
      'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
        return 'стойността трябва да бъде ' + _validationUtilities.Utilities.getValue(threshold) + ' или по-малко';
      },
      'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
        return 'броят на символите не може да бъде повече от ' + _validationUtilities.Utilities.getValue(threshold);
      },
      'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
        return 'стойността трябва да бъде по-малко от ' + _validationUtilities.Utilities.getValue(threshold);
      },
      'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
        return 'стойността на полето трябва да бъде число';
      },
      'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
        return 'невалидна стойност';
      },
      'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
        return 'невалидна стойност';
      },
      'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
        return 'трябва да съдържа комбинация от малки и големи букви, цифри и специални знаци';
      },
      'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
        return 'трябва да съдържа поне  ' + _validationUtilities.Utilities.getValue(threshold) + ' от следните групи: малки и големи букви, цифри и специални знаци';
      }
    }
  };
  exports.data = data;
});