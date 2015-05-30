import {Utilities} from '../validation/utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
  },
  messages: {
    'isRequired': 'est obligatoire',
    'onValidateCallback' : `n'est pas une valeur valide`,
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
      return `doit contenir de ${Utilities.getValue(threshold.minimumLength)} à ${Utilities.getValue(threshold.maximumLength)} caractères`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `doit être entre ${Utilities.getValue(threshold.minimumValue)} et ${Utilities.getValue(threshold.maximumValue)}`;
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
      return `doit être ${Utilities.getValue(threshold.otherValue)}`;
    },
    'InEqualityValidationRule' : (newValue, threshold) => {
      return `ne peut pas être ${Utilities.getValue(threshold.otherValue)}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `doit correspondre à ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
      return `ne doit pas correspondre à ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `n'est pas une valeur valide`;
    },
    'MinimumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `doit être ${Utilities.getValue(threshold)} ou plus`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `doit contenir au moins ${Utilities.getValue(threshold)} caractères`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `doit être plus que ${Utilities.getValue(threshold)}`;
    },
    'MaximumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `doit être moins que ${Utilities.getValue(threshold)}`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `ne doit pas contenir plus de ${Utilities.getValue(threshold)} caractères`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `doit être ${Utilities.getValue(threshold)} ou moins`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `doit être une valeur numérique`;
    },
    'NoSpacesValidationRule' : (newValue, threshold) => {
      return `ne peut pas contenir d'espaces`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `n'est pas une valeur valide`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `n'est pas une valeur valide`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `doit contenir une combinaison de lettres minuscules, de lettres majuscules, de caractères numériques et de caractères spéciaux`;
    },
    'MediumPasswordValidationRule' : (newValue, threshold) => {
      return `doit contenir au moins ${Utilities.getValue(threshold)} des caractéristiques suivantes : lettres minuscules, lettres majuscules, caractères numériques ou caractères spéciaux`;
    },
    'URLValidationRule' : (newValue, threshold) =>{
      return `est pas un URL valide`;
    }
  }
};
