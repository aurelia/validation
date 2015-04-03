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
      if (threshold.otherValueLabel)
        if (threshold.equality)
          return `entspricht nicht ${threshold.otherValueLabel}`;
        else
          return `darf nicht mit ${threshold.otherValueLabel} übereinstimmen`;
      else if (threshold.equality)
        return `sollte ${threshold.otherValue} sein`;
      else
        return `sollte nicht ${threshold.otherValue} sein`;
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
    'StrongPasswordValidationRule': (newValue, threshold) => {
      if (threshold == 4)
        return `sollte eine Kombination aus Groß- und Kleinbuchstaben, sowie Zahlen und Sonderzeichen enthalten`;
      else
        return `sollte zumindest ${threshold} der folgenden Gruppen enthalten: Kleinbuchstaben, Großbuchstaben, Zahlen oder Sonderzeichen`;
    }
  }
};
