import {Validation} from '../validation/validation'

export class ValidationRule {
    constructor(threshold, onValidate, message) {
        this.onValidate = onValidate;
        this.threshold = threshold;
        this.message = message;
        this.errorMessage = null;
        this.ruleName = this.constructor.name;
    }


    withMessage(message) {
        this.message = message;
    }

    explain() {
        return this.errorMessage;
    }

    validate(currentValue) {
        if (typeof (currentValue) === 'string') {
            if (String.prototype.trim) {
                currentValue = currentValue.trim();
            }
            else {
                currentValue = currentValue.replace(/^\s+|\s+$/g, '');
            }
        }
        var result = this.onValidate(currentValue, this.threshold);
        if (result) {
            this.errorMessage = null;
        }
        else {
            if(this.message)
            {
                if ( typeof(this.message) === 'function')
                {
                    this.errorMessage = this.message(currentValue, this.threshold);
                }
                else if(typeof(this.message) === 'string')
                {
                    this.errorMessage = this.message;
                }
                else
                    throw 'Unable to handle the error message:' + this.message;
            }
            else
            {
                this.errorMessage = Validation.Locale.translate(this.ruleName, currentValue, this.threshold);
            }
        }
        return result;
    }
}

export class EmailValidationRule extends ValidationRule {
    constructor() {
        this.emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        super(
            null,
            (newValue, threshold) => {
                return this.emailRegex.test(newValue);
            }
        );
    }
}

export class MinimumLengthValidationRule extends ValidationRule {
    constructor(minimumLength) {
        super(
            minimumLength,
            (newValue, minimumLength) => {
                return newValue.length !== undefined && newValue.length >= minimumLength;
            }
        );
    }
}

export class MaximumLengthValidationRule extends ValidationRule {
    constructor(maximumLength) {
        super(
            maximumLength,
            (newValue, maximumLength) => {
                return newValue.length !== undefined && newValue.length < maximumLength;
            }
        );
    }
}

export class BetweenLengthValidationRule extends ValidationRule {
    constructor(minimumLength, maximumLength) {
        super(
            { minimumLength : minimumLength, maximumLength : maximumLength },
            (newValue, threshold) => {
                return newValue.length !== undefined
                    && newValue.length >= threshold.minimumLength
                    && newValue.length < threshold.maximumLength;
            }
        );
    }
}

export class CustomFunctionValidationRule extends ValidationRule{
    constructor(customFunction, threshold){
        super(
            threshold,
            customFunction
        )
    }
}

export class NumericValidationRule extends ValidationRule {
    constructor() {
        super(
            null,
            (newValue) => {
                var numericRegex = Validation.Locale.setting('numericRegex');
                var floatValue = parseFloat(newValue);
                return !Number.isNaN(parseFloat(floatValue))
                    && Number.isFinite(floatValue)
                    && numericRegex.test(newValue);
            }
        );
    }
}

export class RegexValidationRule extends ValidationRule {
    constructor(regex) {
        super(
            regex,
            (newValue, regex) => {
                return regex.test(newValue);
            }
        );
    }
}

export class MinimumValueValidationRule extends ValidationRule {
    constructor(minimumValue) {
        super(
            minimumValue,
            (newValue, minimumValue) => {
                return minimumValue <= newValue;
            }
        );
    }
}
export class MaximumValueValidationRule extends ValidationRule {
    constructor(maximumValue) {
        super(
            maximumValue,
            (newValue, maximumValue) => {
                return newValue < maximumValue;
            }
        );
    }
}

export class BetweenValueValidationRule extends ValidationRule {
    constructor(minimumValue, maximumValue) {
        super(
            { minimumValue : minimumValue, maximumValue : maximumValue},
            (newValue, threshold) => {
                return threshold.minimumValue <= newValue && newValue < threshold.maximumValue;
            }
        );
    }
}

export class DigitValidationRule extends ValidationRule {
    constructor() {
        this.digitRegex = /^\d+$/;
        super(
            null,
            (newValue, threshold) => {
                return this.digitRegex.test(newValue);
            }
        );
    }
}

export class AlphaNumericValidationRule extends ValidationRule
{
    constructor() {
        this.alphaNumericRegex = /^[a-z0-9]+$/i;
        super(
            null,
            (newValue, threshold) => {
                return this.alphaNumericRegex.test(newValue);
            }
        );
    }
}


export class AlphaNumericOrWhitespaceValidationRule extends ValidationRule
{
    constructor() {
        this.alphaNumericRegex = /^[a-z0-9\s]+$/i;
        super(
            null,
            (newValue, threshold) => {
                return this.alphaNumericRegex.test(newValue);
            }
        );
    }
}


export class StrongPasswordValidationRule extends ValidationRule
{
    constructor(minimumComplexityLevel) {
        var complexityLevel = 4;
        if(minimumComplexityLevel && minimumComplexityLevel > 1 && minimumComplexityLevel < 4)
            complexityLevel = minimumComplexityLevel;

        super(
            complexityLevel,
            (newValue, threshold) => {
                if (typeof (newValue) !== 'string')
                    return false;
                var strength = 0;

                strength += /[A-Z]+/.test(newValue) ? 1 : 0;
                strength += /[a-z]+/.test(newValue) ? 1 : 0;
                strength += /[0-9]+/.test(newValue) ? 1 : 0;
                strength += /[\W]+/.test(newValue) ? 1 : 0;
                return strength >= threshold;
            }
        );
    }
}

export class EqualityValidationRule extends ValidationRule {
    constructor(otherValue, equality, otherValueLabel) {
        super(
            {
                otherValue: otherValue,
                equality: equality,
                otherValueLabel: otherValueLabel
            },
            (newValue, threshold) => {
                if(newValue instanceof Date && threshold.otherValue instanceof Date)
                    return threshold.equality === (newValue.getTime() === threshold.otherValue.getTime());
                return threshold.equality === (newValue === threshold.otherValue);
            }
        );
    }
}

export class InCollectionValidationRule extends ValidationRule {
    constructor(collection) {
        super(
            collection,
            (newValue, threshold) => {
                for(let i = 0; i < collection.length; i++)
                {
                    if(newValue === collection[i])
                        return true;
                }
                return false;
            }
        );
    }
}