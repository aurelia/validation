import {Utilities} from '../utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
  },
  messages: {
    'isRequired': 'é obrigatório',
    'onValidateCallback': 'não é válido',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `pode conter apenas caracteres alphanuméricos ou espaços`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `pode conter apenas caracteres alphanuméricos`;
    },
    'AlphaValidationRule': (newValue, threshold) => {
      return `pode conter apenas letras`;
    },
    'AlphaOrWhitespaceValidationRule': (newValue, threshold) => {
      return `pode conter apenas letras ou espaços`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `deve ter entre ${Utilities.getValue(threshold.minimumLength)} e ${Utilities.getValue(threshold.maximumLength)} caracteres`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `deve estar entre ${Utilities.getValue(threshold.minimumValue)} e ${Utilities.getValue(threshold.maximumValue)}`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `não é válido`;
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `deve ser um número inteiro`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `não é um e-mail válido`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `deve ser ${Utilities.getValue(threshold.otherValue)}`;
    },
    'InEqualityValidationRule': (newValue, threshold) => {
      return `não pode ser ${Utilities.getValue(threshold.otherValue)}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `deve combinar com ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InEqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `não pode combinar com ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `não é válido`;
    },
    'MinimumInclusiveValueValidationRule': (newValue, threshold) => {
      return `deve ser ${Utilities.getValue(threshold)} ou mais`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `deve possuir pelo menos ${Utilities.getValue(threshold)} caracteres`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `deve ser maior que ${Utilities.getValue(threshold)}`;
    },
    'MaximumInclusiveValueValidationRule': (newValue, threshold) => {
      return `deve ser ${Utilities.getValue(threshold)} ou menos`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `não pode ser maior que ${Utilities.getValue(threshold)} caracteres`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `deve ser menor que ${Utilities.getValue(threshold)}`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `deve ser um número`;
    },
    'NoSpacesValidationRule': (newValue, threshold) => {
      return `não pode conter espaços`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `não é válido`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `não é válido`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `deve conter uma combinação de letras minúsculas, letras maiúsculas, números e caracteres especiais`;
    },
    'MediumPasswordValidationRule': (newValue, threshold) => {
      return `deve conter pelo menos ${Utilities.getValue(threshold)} dos seguintes grupos: letras minúsculas, letras maiúsculas, números ou caracteres especiais`;
    },
    'URLValidationRule': (newValue, threshold) => {
      return `não é uma URL válida`;
    }
  }
};
