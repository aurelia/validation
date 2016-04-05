'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.data = undefined;

var _utilities = require('../utilities');

var data = exports.data = {
  settings: {
    'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
  },
  messages: {
    'isRequired': 'es obligatorio',
    'onValidateCallback': 'no es un valor válido',
    'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
      return 'sólo puede contener caracteres alfanuméricos y espacios';
    },
    'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
      return 'sólo puede contener caracteres alfanuméricos';
    },
    'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
      return 'sólo puede contener letras';
    },
    'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
      return 'sólo puede contener letras y espacios';
    },
    'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
      return 'debe tener entre ' + _utilities.Utilities.getValue(threshold.minimumLength) + ' y ' + _utilities.Utilities.getValue(threshold.maximumLength) + ' letras de largo';
    },
    'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
      return 'debe tener un valor entre ' + _utilities.Utilities.getValue(threshold.minimumValue) + ' y ' + _utilities.Utilities.getValue(threshold.maximumValue);
    },
    'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
      return 'es un valor inválido';
    },
    'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
      return 'sólo puede contener números';
    },
    'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
      return 'no es un correo electrónico válido';
    },
    'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
      return 'debe ser ' + _utilities.Utilities.getValue(threshold.otherValue);
    },
    'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
      return 'no puede ser ' + _utilities.Utilities.getValue(threshold.otherValue);
    },
    'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
      return 'no es igual a ' + _utilities.Utilities.getValue(threshold.otherValueLabel);
    },
    'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
      return 'no puede ser igual a ' + _utilities.Utilities.getValue(threshold.otherValueLabel);
    },
    'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
      return 'no es un valor válido';
    },
    'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
      return 'debe ser ' + _utilities.Utilities.getValue(threshold) + ' o más';
    },
    'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
      return 'debe ser al menos de ' + _utilities.Utilities.getValue(threshold) + ' caracteres';
    },
    'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
      return 'debe ser ' + _utilities.Utilities.getValue(threshold) + ' o superior';
    },
    'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
      return 'debe ser ' + _utilities.Utilities.getValue(threshold) + ' o menos';
    },
    'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
      return 'no puede medir más de ' + _utilities.Utilities.getValue(threshold) + ' caracteres';
    },
    'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
      return 'debe ser menor a ' + _utilities.Utilities.getValue(threshold);
    },
    'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
      return 'debe ser un número';
    },
    'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
      return 'no puede contener espacios';
    },
    'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
      return 'no es un valor válido';
    },
    'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
      return 'no es un valor válido';
    },
    'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
      return 'debe contener una combinación de letras minúsculas, mayúsculas, dígitos y caracteres especiales';
    },
    'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
      return 'debe poseer al menos ' + _utilities.Utilities.getValue(threshold) + ' de las siguientes características: letras minúsculas, letras mayúsculas, dígitos o caracteres especiales';
    },
    'URLValidationRule': function URLValidationRule(newValue, threshold) {
      return 'no es una URL válida';
    }
  }
};