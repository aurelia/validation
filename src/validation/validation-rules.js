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

  setResult(result, currentValue) {
    if (result === true || result === undefined || result === null || result === '' ) {
      this.errorMessage = null;
      return true;
    }
    else {
      if (typeof(result) === 'string') {
        this.errorMessage = result;
      }
      else {
        if (this.message) {
          if (typeof(this.message) === 'function') {
            this.errorMessage = this.message(currentValue, this.threshold);
          }
          else if (typeof(this.message) === 'string') {
            this.errorMessage = this.message;
          }
          else
            throw 'Unable to handle the error message:' + this.message;
        }
        else {
          this.errorMessage = Validation.Locale.translate(this.ruleName, currentValue, this.threshold);
        }
      }
      return false;
    }
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
    var promise = Promise.resolve(result);

    var nextPromise = promise.then(
      (promiseResult) => {
        if (this.setResult(promiseResult, currentValue)) {
          return Promise.resolve(this);
        }
        else {
          return Promise.reject(this);
        }
      },
      (promiseResult) => {
        if( typeof(promiseResult) === 'string' && promiseResult !== '')
          this.setResult(promiseResult, currentValue);
        else
          this.setResult(false, currentValue);
        return Promise.reject(this);
      }
    );

    return nextPromise;
  }
}

export class EmailValidationRule extends ValidationRule {
  //https://github.com/chriso/validator.js/blob/master/LICENSE
  constructor() {
    this.emailUserUtf8Regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;
    this.isFQDN = function (str) {
      var parts = str.split('.');
      for (var part, i = 0; i < parts.length; i++) {
        part = parts[i];
        if (part.indexOf('__') >= 0) {
          return false;
        }
        part = part.replace(/_/g, '');
        if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
          return false;
        }
        if (part[0] === '-' || part[part.length - 1] === '-' ||
          part.indexOf('---') >= 0) {
          return false;
        }
      }
      return true;
    };
    super(
      null,
      (newValue, threshold) => {
        if (/\s/.test(newValue)) {
          return false;
        }
        var parts = newValue.split('@');
        var domain = parts.pop();
        var user = parts.join('@');

        if (!this.isFQDN(domain)) {
          return false;
        }
        return this.emailUserUtf8Regex.test(user);
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
      {minimumLength: minimumLength, maximumLength: maximumLength},
      (newValue, threshold) => {
        return newValue.length !== undefined
          && newValue.length >= threshold.minimumLength
          && newValue.length < threshold.maximumLength;
      }
    );
  }
}

export class CustomFunctionValidationRule extends ValidationRule {
  constructor(customFunction, threshold) {
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
      {minimumValue: minimumValue, maximumValue: maximumValue},
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

export class AlphaNumericValidationRule extends ValidationRule {
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


export class AlphaNumericOrWhitespaceValidationRule extends ValidationRule {
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


export class StrongPasswordValidationRule extends ValidationRule {
  constructor(minimumComplexityLevel) {
    var complexityLevel = 4;
    if (minimumComplexityLevel && minimumComplexityLevel > 1 && minimumComplexityLevel < 4)
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
        if (newValue instanceof Date && threshold.otherValue instanceof Date)
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
        for (let i = 0; i < collection.length; i++) {
          if (newValue === collection[i])
            return true;
        }
        return false;
      }
    );
  }
}
