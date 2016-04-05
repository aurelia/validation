import { Utilities } from '../utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'is required',
    'onValidateCallback': 'not a valid value',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `can contain only alphanumerical characters or spaces`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `can contain only alphanumerical characters`;
    },
    'AlphaValidationRule': (newValue, threshold) => {
      return `can contain only letters`;
    },
    'AlphaOrWhitespaceValidationRule': (newValue, threshold) => {
      return `can contain only letters or spaces`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `needs to be between ${ Utilities.getValue(threshold.minimumLength) } and ${ Utilities.getValue(threshold.maximumLength) } characters long`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `needs to be between ${ Utilities.getValue(threshold.minimumValue) } and ${ Utilities.getValue(threshold.maximumValue) }`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `not a valid value`;
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `can contain only digits`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `is not a valid email address`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `should be ${ Utilities.getValue(threshold.otherValue) }`;
    },
    'InEqualityValidationRule': (newValue, threshold) => {
      return `cannot be ${ Utilities.getValue(threshold.otherValue) }`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `does not match ${ Utilities.getValue(threshold.otherValueLabel) }`;
    },
    'InEqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `cannot match ${ Utilities.getValue(threshold.otherValueLabel) }`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `not a valid value`;
    },
    'MinimumInclusiveValueValidationRule': (newValue, threshold) => {
      return `needs to be ${ Utilities.getValue(threshold) } or more`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `needs to be at least ${ Utilities.getValue(threshold) } characters long`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `needs to be more than ${ Utilities.getValue(threshold) }`;
    },
    'MaximumInclusiveValueValidationRule': (newValue, threshold) => {
      return `needs to be ${ Utilities.getValue(threshold) } or less`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `cannot be longer than ${ Utilities.getValue(threshold) } characters`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `needs to be less than ${ Utilities.getValue(threshold) }`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `needs to be a number`;
    },
    'NoSpacesValidationRule': (newValue, threshold) => {
      return `cannot contain spaces`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `not a valid value`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `not a valid value`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `should contain a combination of lowercase letters, uppercase letters, digits and special characters`;
    },
    'MediumPasswordValidationRule': (newValue, threshold) => {
      return `should contain at least ${ Utilities.getValue(threshold) } of the following groups: lowercase letters, uppercase letters, digits or special characters`;
    },
    'URLValidationRule': (newValue, threshold) => {
      return `is not a valid URL`;
    }
  }
};