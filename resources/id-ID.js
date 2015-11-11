/* */
define(['exports', '../utilities'], function (exports, _validationUtilities) {
    'use strict';

    exports.__esModule = true;
    var data = {
        settings: {
            'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
        },
        messages: {
            'isRequired': 'wajib diisi',
            'onValidateCallback': 'bukan nilai yang valid',
            'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
                return 'hanya dapat berisi karakter alfanumerik atau spasi';
            },
            'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
                return 'hanya dapat berisi karakter alfanumerik';
            },
            'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
                return 'dapat berisi hanya huruf';
            },
            'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
                return 'dapat hanya berisi huruf atau spasi';
            },
            'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
                return 'perlu antara ' + _validationUtilities.Utilities.getValue(threshold.minimumLength) + ' dan ' + _validationUtilities.Utilities.getValue(threshold.maximumLength) + ' karakter';
            },
            'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
                return 'perlu antara ' + _validationUtilities.Utilities.getValue(threshold.minimumValue) + ' dan ' + _validationUtilities.Utilities.getValue(threshold.maximumValue);
            },
            'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
                return 'bukan nilai yang valid';
            },
            'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
                return 'hanya dapat berisi angka';
            },
            'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
                return 'bukan alamat email yang valid';
            },
            'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
                return 'seharusnya ' + _validationUtilities.Utilities.getValue(threshold.otherValue);
            },
            'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
                return 'tidak bisa ' + _validationUtilities.Utilities.getValue(threshold.otherValue);
            },
            'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
                return 'tidak sama ' + _validationUtilities.Utilities.getValue(threshold.otherValueLabel);
            },
            'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
                return 'tidak bisa cocok ' + _validationUtilities.Utilities.getValue(threshold.otherValueLabel);
            },
            'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
                return 'bukan nilai yang valid';
            },
            'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
                return 'perlu ' + _validationUtilities.Utilities.getValue(threshold) + ' atau lebih';
            },
            'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
                return 'perlu at least ' + _validationUtilities.Utilities.getValue(threshold) + ' karakter';
            },
            'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
                return 'perlu more than ' + _validationUtilities.Utilities.getValue(threshold);
            },
            'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
                return 'perlu ' + _validationUtilities.Utilities.getValue(threshold) + ' or less';
            },
            'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
                return 'tidak bisa longer then ' + _validationUtilities.Utilities.getValue(threshold) + ' karakter';
            },
            'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
                return 'perlu less than ' + _validationUtilities.Utilities.getValue(threshold);
            },
            'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
                return 'perlu a number';
            },
            'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
                return 'cannot contain spaces';
            },
            'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
                return 'bukan nilai yang valid';
            },
            'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
                return 'bukan nilai yang valid';
            },
            'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
                return 'harus berisi kombinasi huruf kecil, huruf besar, angka dan karakter khusus';
            },
            'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
                return 'harus mengandung setidaknya ' + _validationUtilities.Utilities.getValue(threshold) + ' dari kelompok berikut: huruf kecil, huruf besar, angka dan karakter khusus';
            },
            'URLValidationRule': function URLValidationRule(newValue, threshold) {
                return 'bukan URL yang valid';
            }
        }
    };
    exports.data = data;
});
