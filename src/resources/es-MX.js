import {Utilities} from '../validation/utilities';

export let data = {
    settings: {
    'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
    },
    messages:{
      'isRequired': 'es obligatorio',
      'onValidateCallback' : 'no es un valor valido', 
      'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
        return `solo puede contener caracteres alfanuméricos y espacios`;
      },
      'AlphaNumericValidationRule': (newValue, threshold) => {
        return `solo puede contener caracteres alfanuméricos`;
      },
      'AlphaValidationRule' : (newValue, threshold) => {
        return `solo puede contener letras`;
      },
      'AlphaOrWhitespaceValidationRule' : (newValue, threshold) => {
        return `solo puede contener letras y espacios`;
      },
      'BetweenLengthValidationRule': (newValue, threshold) => {
        return `debe ser entre ${Utilities.getValue(threshold.minimumLength)} y ${Utilities.getValue(threshold.maximumLength)} letras de largo`;
      },
      'BetweenValueValidationRule': (newValue, threshold) => {
        return `debe tener un valor entre ${Utilities.getValue(threshold.minimumValue)} y ${Utilities.getValue(threshold.maximumValue)}`;
      },
      'CustomFunctionValidationRule': (newValue, threshold) => {
        return `es un valor invalido`
      },
      'DigitValidationRule': (newValue, threshold) => {
        return `solo puede contener numeros`;
      },
      'EmailValidationRule': (newValue, threshold) => {
        return `no es un correo electrónico valido`;
      },
      'EqualityValidationRule': (newValue, threshold) => {
          return `debe ser ${Utilities.getValue(threshold.otherValue)}`;
      },
      'InEqualityValidationRule' : (newValue, threshold) => {
          return `no puede ser ${Utilities.getValue(threshold.otherValue)}`;
      },
      'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
        return `no es igual a ${Utilities.getValue(threshold.otherValueLabel)}`;
      },
      'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
        return `no puede ser igual a ${Utilities.getValue(threshold.otherValueLabel)}`;
      },
      'InCollectionValidationRule': (newValue, threshold) => {
        return `no es un valor valido`;
      },
      'MinimumInclusiveValueValidationRule' : (newValue, threshold) => {
        return `debe ser ${Utilities.getValue(threshold)} o mayor`;
      },
      'MinimumLengthValidationRule': (newValue, threshold) => {
        return `debe ser almenos de ${Utilities.getValue(threshold)} caracteres`;
      },
      'MinimumValueValidationRule': (newValue, threshold) => {
        return `debe ser ${Utilities.getValue(threshold)} o superior`;
      },
      'MaximumInclusiveValueValidationRule' : (newValue, threshold) => {
        return `debe ser ${Utilities.getValue(threshold)} o menos`;
      },
      'MaximumLengthValidationRule': (newValue, threshold) => {
        return `no puede medir más de ${Utilities.getValue(threshold)} caracteres`;
      },
      'MaximumValueValidationRule': (newValue, threshold) => {
        return `debe ser menor a ${Utilities.getValue(threshold)}`;
      },
      'NumericValidationRule': (newValue, threshold) => {
        return `debe ser un numero`;
      },
      'RegexValidationRule': (newValue, threshold) => {
        return `no es un valor valido`;
      },
      'ContainsOnlyValidationRule': (newValue, threshold) => {
        return `no es un valor valido`;
      },
      'StrongPasswordValidationRule': (newValue, threshold) => {
          return `debe contener una combinación de letras minúsculas, mayúsculas, dígitos y caracteres especiales`;
      },
      'MediumPasswordValidationRule' : (newValue, threshold) => {
          return `debe poseer al menos ${Utilities.getValue(threshold)} de las siguientes características: letras minúsculas, letras mayúsculas, dígitos o caracteres especiales`;
      }
    }
  };