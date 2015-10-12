define(['exports', '../utilities'], function (exports, _utilities) {
  'use strict';

  exports.__esModule = true;
  var data = {
    settings: {
      'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
    },
    messages: {
      'isRequired': 'wird benötigt',
      'onValidateCallback': 'ist kein gültiger Wert',
      'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
        return 'darf nur alphanumerische Zeichen oder Leerzeichen beinhalten';
      },
      'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
        return 'darf nur alphanumerische Zeichen beinhalten';
      },
      'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
        return 'muss zwischen ' + _utilities.Utilities.getValue(threshold.minimumLength) + ' und ' + _utilities.Utilities.getValue(threshold.maximumLength) + ' Zeichen lang sein';
      },
      'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
        return 'muss zwischen ' + _utilities.Utilities.getValue(threshold.minimumValue) + ' und ' + _utilities.Utilities.getValue(threshold.maximumValue) + ' sein';
      },
      'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
        return 'ist kein gültiger Wert';
      },
      'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
        return 'darf nur Zahlen beinhalten';
      },
      'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
        return 'ist keine gültige Email-Adresse';
      },
      'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
        return 'sollte ' + _utilities.Utilities.getValue(threshold.otherValue) + ' sein';
      },
      'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
        return 'sollte nicht ' + _utilities.Utilities.getValue(threshold.otherValue) + ' sein';
      },
      'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'darf nicht mit ' + _utilities.Utilities.getValue(threshold.otherValueLabel) + ' übereinstimmen';
      },
      'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'cannot not match ' + _utilities.Utilities.getValue(threshold.otherValueLabel);
      },
      'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
        return 'ist kein gültiger Wert';
      },
      'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
        return 'muss mindestens ' + _utilities.Utilities.getValue(threshold) + ' Zeichen lang sein';
      },
      'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
        return 'sollte ' + _utilities.Utilities.getValue(threshold) + ' oder mehr sein';
      },
      'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
        return 'darf nicht länger als ' + _utilities.Utilities.getValue(threshold) + ' Zeichen sein';
      },
      'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
        return 'muss geringer als ' + _utilities.Utilities.getValue(threshold) + ' sein';
      },
      'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
        return 'muss eine Nummer sein';
      },
      'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
        return 'darf keine Leerzeichen enthalten';
      },
      'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
        return 'ist kein gültiger Wert';
      },
      'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
        return 'ist kein gültiger Wert';
      },
      'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
        return 'sollte eine Kombination aus Groß- und Kleinbuchstaben, sowie Zahlen und Sonderzeichen enthalten';
      },
      'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
        return 'sollte zumindest ' + _utilities.Utilities.getValue(threshold) + ' der folgenden Gruppen enthalten: Kleinbuchstaben, Großbuchstaben, Zahlen oder Sonderzeichen';
      },
      'URLValidationRule': function URLValidationRule(newValue, threshold) {
        return 'ist keine gültige URL';
      }
    }
  };
  exports.data = data;
});