export
let
data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'wird benötigt',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `darf nur alphanumerische Zeichen oder Leerzeichen beinhalten`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `darf nur alphanumerische Zeichen beinhalten`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `muss zwischen ${threshold.minimumLength} und ${threshold.maximumLength} Zeichen lang sein`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `muss zwischen ${threshold.minimumValue} und ${threshold.maximumValue} sein`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `ist kein gültiger Wert`
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `darf nur Zahlen beinhalten`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `ist keine gültige Email-Adresse`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
        return `sollte ${threshold.otherValue} sein`;
    },
    'InEqualityValidationRule' : (newValue, threshold) => {
        return `sollte nicht ${threshold.otherValue} sein`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `darf nicht mit ${threshold.otherValueLabel} übereinstimmen`;
    },
    'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
      return `cannot not match ${threshold.otherValueLabel}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `ist kein gültiger Wert`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `muss mindestens ${threshold} Zeichen lang sein`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `sollte ${threshold} oder mehr sein`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `darf nicht länger als ${threshold} Zeichen sein`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `muss geringer als ${threshold} sein`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `muss eine Nummer sein`;
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
    'MediumPasswordValidationRule' : (newValue, threshold) => {
        return `sollte zumindest ${threshold} der folgenden Gruppen enthalten: Kleinbuchstaben, Großbuchstaben, Zahlen oder Sonderzeichen`;
    }
  }
};
