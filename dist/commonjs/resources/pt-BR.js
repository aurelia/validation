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
    'isRequired': 'é obrigatório',
    'onValidateCallback': 'não é válido',
    'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
      return 'pode conter apenas caracteres alphanuméricos ou espaços';
    },
    'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
      return 'pode conter apenas caracteres alphanuméricos';
    },
    'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
      return 'pode conter apenas letras';
    },
    'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
      return 'pode conter apenas letras ou espaços';
    },
    'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
      return 'deve ter entre ' + _utilities.Utilities.getValue(threshold.minimumLength) + ' e ' + _utilities.Utilities.getValue(threshold.maximumLength) + ' caracteres';
    },
    'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
      return 'deve estar entre ' + _utilities.Utilities.getValue(threshold.minimumValue) + ' e ' + _utilities.Utilities.getValue(threshold.maximumValue);
    },
    'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
      return 'não é válido';
    },
    'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
      return 'deve ser um número inteiro';
    },
    'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
      return 'não é um e-mail válido';
    },
    'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
      return 'deve ser ' + _utilities.Utilities.getValue(threshold.otherValue);
    },
    'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
      return 'não pode ser ' + _utilities.Utilities.getValue(threshold.otherValue);
    },
    'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
      return 'deve combinar com ' + _utilities.Utilities.getValue(threshold.otherValueLabel);
    },
    'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
      return 'não pode combinar com ' + _utilities.Utilities.getValue(threshold.otherValueLabel);
    },
    'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
      return 'não é válido';
    },
    'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
      return 'deve ser ' + _utilities.Utilities.getValue(threshold) + ' ou mais';
    },
    'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
      return 'deve possuir pelo menos ' + _utilities.Utilities.getValue(threshold) + ' caracteres';
    },
    'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
      return 'deve ser maior que ' + _utilities.Utilities.getValue(threshold);
    },
    'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
      return 'deve ser ' + _utilities.Utilities.getValue(threshold) + ' ou menos';
    },
    'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
      return 'não pode ser maior que ' + _utilities.Utilities.getValue(threshold) + ' caracteres';
    },
    'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
      return 'deve ser menor que ' + _utilities.Utilities.getValue(threshold);
    },
    'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
      return 'deve ser um número';
    },
    'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
      return 'não pode conter espaços';
    },
    'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
      return 'não é válido';
    },
    'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
      return 'não é válido';
    },
    'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
      return 'deve conter uma combinação de letras minúsculas, letras maiúsculas, números e caracteres especiais';
    },
    'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
      return 'deve conter pelo menos ' + _utilities.Utilities.getValue(threshold) + ' dos seguintes grupos: letras minúsculas, letras maiúsculas, números ou caracteres especiais';
    },
    'URLValidationRule': function URLValidationRule(newValue, threshold) {
      return 'não é uma URL válida';
    }
  }
};