System.register(['../validation/utilities'], function (_export) {
  var Utilities, data;
  return {
    setters: [function (_validationUtilities) {
      Utilities = _validationUtilities.Utilities;
    }],
    execute: function () {
      'use strict';

      data = {
        settings: {
          numericRegex: /^-?(?:\d+)(?:\,\d+)?$/
        },
        messages: {
          isRequired: 'es obligatorio',
          onValidateCallback: 'no es un valor valido',
          AlphaNumericOrWhitespaceValidationRule: function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
            return 'solo puede contener caracteres alfanuméricos y espacios';
          },
          AlphaNumericValidationRule: function AlphaNumericValidationRule(newValue, threshold) {
            return 'solo puede contener caracteres alfanuméricos';
          },
          AlphaValidationRule: function AlphaValidationRule(newValue, threshold) {
            return 'solo puede contener letras';
          },
          AlphaOrWhitespaceValidationRule: function AlphaOrWhitespaceValidationRule(newValue, threshold) {
            return 'solo puede contener letras y espacios';
          },
          BetweenLengthValidationRule: function BetweenLengthValidationRule(newValue, threshold) {
            return 'debe ser entre ' + Utilities.getValue(threshold.minimumLength) + ' y ' + Utilities.getValue(threshold.maximumLength) + ' letras de largo';
          },
          BetweenValueValidationRule: function BetweenValueValidationRule(newValue, threshold) {
            return 'debe tener un valor entre ' + Utilities.getValue(threshold.minimumValue) + ' y ' + Utilities.getValue(threshold.maximumValue);
          },
          CustomFunctionValidationRule: function CustomFunctionValidationRule(newValue, threshold) {
            return 'es un valor invalido';
          },
          DigitValidationRule: function DigitValidationRule(newValue, threshold) {
            return 'solo puede contener numeros';
          },
          EmailValidationRule: function EmailValidationRule(newValue, threshold) {
            return 'no es un correo electrónico valido';
          },
          EqualityValidationRule: function EqualityValidationRule(newValue, threshold) {
            return 'debe ser ' + Utilities.getValue(threshold.otherValue);
          },
          InEqualityValidationRule: function InEqualityValidationRule(newValue, threshold) {
            return 'no puede ser ' + Utilities.getValue(threshold.otherValue);
          },
          EqualityWithOtherLabelValidationRule: function EqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'no es igual a ' + Utilities.getValue(threshold.otherValueLabel);
          },
          InEqualityWithOtherLabelValidationRule: function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'no puede ser igual a ' + Utilities.getValue(threshold.otherValueLabel);
          },
          InCollectionValidationRule: function InCollectionValidationRule(newValue, threshold) {
            return 'no es un valor valido';
          },
          MinimumInclusiveValueValidationRule: function MinimumInclusiveValueValidationRule(newValue, threshold) {
            return 'debe ser ' + Utilities.getValue(threshold) + ' o mayor';
          },
          MinimumLengthValidationRule: function MinimumLengthValidationRule(newValue, threshold) {
            return 'debe ser almenos de ' + Utilities.getValue(threshold) + ' caracteres';
          },
          MinimumValueValidationRule: function MinimumValueValidationRule(newValue, threshold) {
            return 'debe ser ' + Utilities.getValue(threshold) + ' o superior';
          },
          MaximumInclusiveValueValidationRule: function MaximumInclusiveValueValidationRule(newValue, threshold) {
            return 'debe ser ' + Utilities.getValue(threshold) + ' o menos';
          },
          MaximumLengthValidationRule: function MaximumLengthValidationRule(newValue, threshold) {
            return 'no puede medir más de ' + Utilities.getValue(threshold) + ' caracteres';
          },
          MaximumValueValidationRule: function MaximumValueValidationRule(newValue, threshold) {
            return 'debe ser menor a ' + Utilities.getValue(threshold);
          },
          NumericValidationRule: function NumericValidationRule(newValue, threshold) {
            return 'debe ser un numero';
          },
          NoSpacesValidationRule: function NoSpacesValidationRule(newValue, threshold) {
            return 'no puede contener espacios';
          },
          RegexValidationRule: function RegexValidationRule(newValue, threshold) {
            return 'no es un valor valido';
          },
          ContainsOnlyValidationRule: function ContainsOnlyValidationRule(newValue, threshold) {
            return 'no es un valor valido';
          },
          StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
            return 'debe contener una combinación de letras minúsculas, mayúsculas, dígitos y caracteres especiales';
          },
          MediumPasswordValidationRule: function MediumPasswordValidationRule(newValue, threshold) {
            return 'debe poseer al menos ' + Utilities.getValue(threshold) + ' de las siguientes características: letras minúsculas, letras mayúsculas, dígitos o caracteres especiales';
          },
          URLValidationRule: function URLValidationRule(newValue, threshold) {
            return 'no es una URL válida';
          }
        }
      };

      _export('data', data);
    }
  };
});