export
let
data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'est obligatoire',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `ne peut contenir que des caractères alphanumériques ou des espaces`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `ne peut contenir que des caractères alphanumériques`;
    },
    'AlphaValidationRule' : (newValue, threshold) => {
      return `ne peut contenir que des lettres`;
    },
    'AlphaOrWhitespaceValidationRule' : (newValue, threshold) => {
      return `ne peut contenir que des lettres ou des espaces`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `doit contenir de ${threshold.minimumLength} à ${threshold.maximumLength} caractères`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `doit être entre ${threshold.minimumValue} et ${threshold.maximumValue}`;
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
      return `doit être ${threshold.otherValue}`;
    },
    'InEqualityValidationRule' : (newValue, threshold) => {
      return `ne peut pas être ${threshold.otherValue}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `doit correspondre à ${threshold.otherValueLabel}`;
    },
    'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
      return `ne doit pas correspondre à ${threshold.otherValueLabel}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `n'est pas une valeur valide`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `doit contenir au moins ${threshold} caractères`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `doit être ${threshold} ou plus`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `ne doit pas contenir plus de ${threshold} caractères`;
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
      return `doit contenir une combinaison de lettres minuscules, de lettres majuscules, de caractères numériques et de caractères spéciaux`;
    },
    'MediumPasswordValidationRule' : (newValue, threshold) => {
      return `doit contenir au moins ${threshold} des caractéristiques suivantes : lettres minuscules, lettres majuscules, caractères numériques ou caractères spéciaux`;
    }
  }
};
