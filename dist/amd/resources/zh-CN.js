define(['exports', '../validation/utilities'], function (exports, _validationUtilities) {
    'use strict';

    exports.__esModule = true;
    var data = {
        settings: {
            'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
        },
        messages: {
            'isRequired': '必填字段',
            'onValidateCallback': '非法字段',
            'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
                return '不能使用特殊字符';
            },
            'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
                return '只能包含字母数字字符';
            },
            'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
                return '只能包含字母';
            },
            'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
                return '只能包含字母或空格';
            },
            'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
                return '字符长度应该在 ' + _validationUtilities.Utilities.getValue(threshold.minimumLength) + ' ~ ' + _validationUtilities.Utilities.getValue(threshold.maximumLength) + ' 之间';
            },
            'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
                return '字符长度应该在 ' + _validationUtilities.Utilities.getValue(threshold.minimumValue) + ' ~ ' + _validationUtilities.Utilities.getValue(threshold.maximumValue) + ' 之间';
            },
            'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
                return '不合法的值';
            },
            'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
                return '只能包含数字';
            },
            'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
                return '邮箱格式不正确';
            },
            'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
                return '应该等于 ' + _validationUtilities.Utilities.getValue(threshold.otherValue);
            },
            'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
                return '不应该等于 ' + _validationUtilities.Utilities.getValue(threshold.otherValue);
            },
            'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
                return '与 ' + _validationUtilities.Utilities.getValue(threshold.otherValueLabel) + ' 不匹配';
            },
            'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
                return '不应该和 ' + _validationUtilities.Utilities.getValue(threshold.otherValueLabel) + ' 相等';
            },
            'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
                return '不合法的值';
            },
            'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
                return '最小值为 ' + _validationUtilities.Utilities.getValue(threshold) + ' (包含)';
            },
            'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
                return '最小字符长度为 ' + _validationUtilities.Utilities.getValue(threshold);
            },
            'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
                return '最小值为 ' + _validationUtilities.Utilities.getValue(threshold) + '(不包含)';
            },
            'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
                return '最大值为 ' + _validationUtilities.Utilities.getValue(threshold) + ' (包含)';
            },
            'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
                return '最大字符长度为 ' + _validationUtilities.Utilities.getValue(threshold);
            },
            'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
                return '最大值为 ' + _validationUtilities.Utilities.getValue(threshold) + '(不包含)';
            },
            'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
                return '请输入一个数字';
            },
            'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
                return '不能包含空字符';
            },
            'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
                return '不合法的值';
            },
            'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
                return '不合法的值';
            },
            'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
                return '应包含大小字母，数字和特殊字符';
            },
            'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
                return '至少包含 ' + _validationUtilities.Utilities.getValue(threshold) + ' 种以下组合:小写字母,大写字母,数字和特殊字符';
            },
            'URLValidationRule': function URLValidationRule(newValue, threshold) {
                return 'URL格式不正确';
            }
        }
    };
    exports.data = data;
});