export
let
data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'est obligatoire',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `ne peut contenir que des caractères alphanumériques ou des espace`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `ne peut contenir que des caractères alphanumériques`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `doit avoir une longueur comprise entre ${threshold.minimumLength} et ${threshold.maximumLength} caractères`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `doit être compris entre ${threshold.minimumValue} et ${threshold.maximumValue}`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `n'est pas une valeur valide`
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `doit contenir uniquement des caractères numériques`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `n'est pas une adresse email valide`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      if (threshold.otherValueLabel)
        if (threshold.equality)
          return `ne correspond pas à ${threshold.otherValueLabel}`;
        else
          return `ne peut pas correspondre à ${threshold.otherValueLabel}`;
      else if (threshold.equality)
        return `devrait être ${threshold.otherValue}`;
      else
        return `ne peut être ${threshold.otherValue}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `n'est pas une valeur valide`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `doit avoir au moins ${threshold} caractères`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `doit être ${threshold} ou plus`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `ne peut être plus long que ${threshold} caractères`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `doit être moins que ${threshold}`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `doit être une valeur numérique`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `n'est pas une valeur valide`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      if (threshold == 4)
        return `devrait contenir une combinaison de lettres minuscules, lettres majuscules, de caractères numériques et de caractères spéciaux`;
      else
        return `devrait contenir au moins ${threshold} des caractéristiques suivantes : lettres minuscules, lettres majuscules, caractères numériques ou caractères spéciaux`;
    }
  }
}
