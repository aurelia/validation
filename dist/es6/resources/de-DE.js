import {Utilities} from '../utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
  },
  messages: {
    'isRequired': 'wird benötigt',
    'onValidateCallback': 'ist kein gültiger Wert',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `darf nur alphanumerische Zeichen oder Leerzeichen beinhalten`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `darf nur alphanumerische Zeichen beinhalten`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `muss zwischen ${Utilities.getValue(threshold.minimumLength)} und ${Utilities.getValue(threshold.maximumLength)} Zeichen lang sein`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `muss zwischen ${Utilities.getValue(threshold.minimumValue)} und ${Utilities.getValue(threshold.maximumValue)} sein`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `ist kein gültiger Wert`;
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `darf nur Zahlen beinhalten`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `ist keine gültige Email-Adresse`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `sollte ${Utilities.getValue(threshold.otherValue)} sein`;
    },
    'InEqualityValidationRule': (newValue, threshold) => {
      return `sollte nicht ${Utilities.getValue(threshold.otherValue)} sein`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `darf nicht mit ${Utilities.getValue(threshold.otherValueLabel)} übereinstimmen`;
    },
    'InEqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `cannot not match ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `ist kein gültiger Wert`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `muss mindestens ${Utilities.getValue(threshold)} Zeichen lang sein`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `sollte ${Utilities.getValue(threshold)} oder mehr sein`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `darf nicht länger als ${Utilities.getValue(threshold)} Zeichen sein`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `muss geringer als ${Utilities.getValue(threshold)} sein`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `muss eine Nummer sein`;
    },
    'NoSpacesValidationRule': (newValue, threshold) => {
      return `darf keine Leerzeichen enthalten`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `ist kein gültiger Wert`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `ist kein gültiger Wert`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `sollte eine Kombination aus Groß- und Kleinbuchstaben, sowie Zahlen und Sonderzeichen enthalten`;
    },
    'MediumPasswordValidationRule': (newValue, threshold) => {
      return `sollte zumindest ${Utilities.getValue(threshold)} der folgenden Gruppen enthalten: Kleinbuchstaben, Großbuchstaben, Zahlen oder Sonderzeichen`;
    },
    'URLValidationRule': (newValue, threshold) => {
      return `ist keine gültige URL`;
    }
  }
};
