'use strict';

exports.__esModule = true;

var _utilities = require('../utilities');

var data = {
  settings: {
    'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
  },
  messages: {
    'isRequired': 'is verplicht',
    'onValidateCallback': 'geen geldige waarde',
    'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
      return 'kan enkel alfanumerieke tekens of spaties bevatten';
    },
    'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
      return 'kan enkel alfanumerieke tekens bevatten';
    },
    'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
      return 'kan enkel letters bevatten';
    },
    'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
      return 'kan enkel letters of spaties bevatten';
    },
    'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
      return 'moet tussen ' + _utilities.Utilities.getValue(threshold.minimumLength) + ' en ' + _utilities.Utilities.getValue(threshold.maximumLength) + ' tekens lang zijn';
    },
    'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
      return 'moet tussen ' + _utilities.Utilities.getValue(threshold.minimumValue) + ' en ' + _utilities.Utilities.getValue(threshold.maximumValue) + ' zijn';
    },
    'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
      return 'mag enkel cijfers bevatten';
    },
    'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
      return 'geen geldige waarde';
    },
    'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
      return 'is geen geldig email adres';
    },
    'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
      return 'moet ' + _utilities.Utilities.getValue(threshold.otherValue) + ' zijn';
    },
    'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
      return 'mag niet ' + _utilities.Utilities.getValue(threshold.otherValue) + ' zijn';
    },
    'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
      return 'moet overeen komen met ' + _utilities.Utilities.getValue(threshold.otherValueLabel);
    },
    'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
      return 'mag niet overeen komen met ' + _utilities.Utilities.getValue(threshold.otherValueLabel);
    },
    'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
      return 'is geen geldige waarde';
    },
    'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
      return 'moet op zijn minst ' + _utilities.Utilities.getValue(threshold) + ' zijn';
    },
    'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
      return 'moet op zijn minst ' + _utilities.Utilities.getValue(threshold) + ' tekens lang zijn';
    },
    'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
      return 'moet op meer dan ' + _utilities.Utilities.getValue(threshold) + ' zijn';
    },
    'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
      return 'moet op zijn meest ' + _utilities.Utilities.getValue(threshold) + ' zijn';
    },
    'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
      return 'moet minder dan ' + _utilities.Utilities.getValue(threshold) + ' tekens lang zijn';
    },
    'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
      return 'moet minder dan ' + _utilities.Utilities.getValue(threshold) + ' zijn';
    },
    'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
      return 'moet een getal zijn';
    },
    'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
      return 'mag geen spaties bevatten';
    },
    'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
      return 'is geen geldige waarde';
    },
    'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
      return 'is geen geldige waarde';
    },
    'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
      return 'moet een combinatie van letters, hoofdletters, cijfers en speciale tekens zijn';
    },
    'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
      return 'moet op zijn minst ' + _utilities.Utilities.getValue(threshold) + ' van de volgende groepen bevatten: letters, hoofdletters, cijfers of speciale tekens';
    },
    'URLValidationRule': function URLValidationRule(newValue, threshold) {
      return 'is geen geldige URL';
    }
  }
};
exports.data = data;