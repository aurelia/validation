import {Utilities} from '../validation/utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'е задължително',
    'onValidateCallback' : 'невалидна стойност',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `трябва да съдържа само букви, цифри и интервали`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `трябва да съдържа само букви и цифри`;
    },
    'AlphaValidationRule' : (newValue, threshold) => {
      return `трябва да съдържа само букви`;
    },
    'AlphaOrWhitespaceValidationRule' : (newValue, threshold) => {
      return `трябва да съдържа само букви или интервали`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `броят на символите трябва да бъде между ${Utilities.getValue(threshold.minimumLength)} и ${Utilities.getValue(threshold.maximumLength)}`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `стойността трябва да бъде между ${Utilities.getValue(threshold.minimumValue)} и ${Utilities.getValue(threshold.maximumValue)}`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `невалидна стойност`
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `трябва да съдържа само цифри`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `невалидна електронна поща`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `стойността трябва да бъде ${Utilities.getValue(threshold.otherValue)}`;
    },
    'InEqualityValidationRule' : (newValue, threshold) => {
        return `стойността не може да бъде ${Utilities.getValue(threshold.otherValue)}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `стойността не съвпада с ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
      return `стойността не може да съвпада с ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `невалидна стойност`;
    },
    'MinimumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `стойността трябва да бъде ${Utilities.getValue(threshold)} или повече`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `броят на символите трябва да бъде поне ${Utilities.getValue(threshold)}`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `стойността трябва да бъде повече от ${Utilities.getValue(threshold)}`;
    },
    'MaximumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `стойността трябва да бъде ${Utilities.getValue(threshold)} или по-малко`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `броят на символите не може да бъде повече от ${Utilities.getValue(threshold)}`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `стойността трябва да бъде по-малко от ${Utilities.getValue(threshold)}`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `стойността на полето трябва да бъде число`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `невалидна стойност`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `невалидна стойност`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `трябва да съдържа комбинация от малки и големи букви, цифри и специални знаци`;
    },
    'MediumPasswordValidationRule' : (newValue, threshold) => {
      return `трябва да съдържа поне  ${Utilities.getValue(threshold)} от следните групи: малки и големи букви, цифри и специални знаци`;
    }
  }
};
