import {Utilities} from '../validation/utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
  },
  messages: {
    'isRequired': 'is verplicht',
    'onValidateCallback' : 'geen geldige waarde',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `kan enkel alfanumerieke tekens of spaties bevatten`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `kan enkel alfanumerieke tekens bevatten`;
    },
    'AlphaValidationRule' : (newValue, threshold) => {
      return `kan enkel letters bevatten`;
    },
    'AlphaOrWhitespaceValidationRule' : (newValue, threshold) => {
      return `kan enkel letters of spaties bevatten`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `moet tussen ${Utilities.getValue(threshold.minimumLength)} en ${Utilities.getValue(threshold.maximumLength)} tekens lang zijn`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `moet tussen ${Utilities.getValue(threshold.minimumValue)} en ${Utilities.getValue(threshold.maximumValue)} zijn`;
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `mag enkel cijfers bevatten`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `geen geldige waarde`
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `is geen geldig email adres`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `moet ${Utilities.getValue(threshold.otherValue)} zijn`;
    },
    'InEqualityValidationRule' : (newValue, threshold) => {
      return `mag niet ${Utilities.getValue(threshold.otherValue)} zijn`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `moet overeen komen met ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
      return `mag niet overeen komen met ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `is geen geldige waarde`;
    },
    'MinimumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `moet op zijn minst ${Utilities.getValue(threshold)} zijn`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `moet op zijn minst ${Utilities.getValue(threshold)} tekens lang zijn`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `moet op meer dan ${Utilities.getValue(threshold)} zijn`;
    },
    'MaximumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `moet op zijn meest ${Utilities.getValue(threshold)} zijn`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `moet minder dan ${Utilities.getValue(threshold)} tekens lang zijn`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `moet minder dan ${Utilities.getValue(threshold)} zijn`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `moet een getal zijn`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `is geen geldige waarde`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `is geen geldige waarde`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `moet een combinatie van letters, hoofdletters, cijfers en speciale tekens zijn`;
    },
    'MediumPasswordValidationRule' : (newValue, threshold) => {
        return `moet op zijn minst ${Utilities.getValue(threshold)} van de volgende groupen bevatten: letters, hoofdletters, cijfers of speciale tekens`;
    }
  }
};
