import {Utilities} from './utilities';
import {ValidationLocale} from './validation-locale';

export class ValidationRule {
  constructor(threshold, onValidate, message, ruleName) {
    this.onValidate = onValidate;
    this.threshold = threshold;
    this.message = message;
    this.errorMessage = null;
    this.ruleName = ruleName;
  }

  withMessage(message) {
    this.message = message;
  }

  explain() {
    return this.errorMessage;
  }

  setResult(result, currentValue, locale) {
    if (result === true || result === undefined || result === null || result === '') {
      this.errorMessage = null;
      return true;
    }
    if (typeof(result) === 'string') {
      this.errorMessage = result;
    } else {
      if (this.message) {
        if (typeof(this.message) === 'function') {
          this.errorMessage = this.message(currentValue, this.threshold);
        } else if (typeof(this.message) === 'string') {
          this.errorMessage = this.message;
        } else {
          throw Error('Unable to handle the error message:' + this.message);
        }
      } else {
        this.errorMessage = locale.translate(this.ruleName, currentValue, this.threshold);
      }
    }
    return false;
  }

  /**
   * Validation rules: return a promise that fulfills and resolves to true/false
   */
  validate(currentValue, locale) {
    if (locale === undefined) {
      locale = ValidationLocale.Repository.default;
    }
    currentValue = Utilities.getValue(currentValue);
    let result = this.onValidate(currentValue, this.threshold, locale);
    let promise = Promise.resolve(result);

    let nextPromise = promise.then(
      (promiseResult) => {
        return this.setResult(promiseResult, currentValue, locale);
      },
      (promiseFailure) => {
        if (typeof(promiseFailure) === 'string' && promiseFailure !== '') {
          return this.setResult(promiseFailure, currentValue, locale);
        }
        return this.setResult(false, currentValue, locale);
      }
    );
    return nextPromise;
  }
}

export class URLValidationRule extends ValidationRule {
  //https://github.com/chriso/validator.js/blob/master/LICENSE
  static isIP(str, version) {
    let ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    let ipv6Block = /^[0-9A-F]{1,4}$/i;
    if (!version) {
      return this.isIP(str, 4) || this.isIP(str, 6);
    } else if (version === 4) {
      if (!ipv4Maybe.test(str)) {
        return false;
      }
      let parts = str.split('.').sort((a, b) => {
        return a - b;
      });
      return parts[3] <= 255;
    } else if (version === 6) {
      let blocks = str.split(':');
      let foundOmissionBlock = false; // marker to indicate ::
      if (blocks.length > 8) {
        return false;
      }
      // initial or final ::
      if (str === '::') {
        return true;
      } else if (str.substr(0, 2) === '::') {
        blocks.shift();
        blocks.shift();
        foundOmissionBlock = true;
      } else if (str.substr(str.length - 2) === '::') {
        blocks.pop();
        blocks.pop();
        foundOmissionBlock = true;
      }
      for (let i = 0; i < blocks.length; ++i) {
        // test for a :: which can not be at the string start/end
        // since those cases have been handled above
        if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
          if (foundOmissionBlock) {
            return false; // multiple :: in address
          }
          foundOmissionBlock = true;
        } else if (!ipv6Block.test(blocks[i])) {
          return false;
        }
      }
      if (foundOmissionBlock) {
        return blocks.length >= 1;
      }
      return blocks.length === 8;
    }
    return false;
  }

  static isFQDN(str, options) {
    /* Remove the optional trailing dot before checking validity */
    if (options.allow_trailing_dot && str[str.length - 1] === '.') {
      str = str.substring(0, str.length - 1);
    }
    let parts = str.split('.');
    if (options.require_tld) {
      let tld = parts.pop();
      if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
        return false;
      }
    }
    for (let part, i = 0; i < parts.length; i++) {
      part = parts[i];
      if (options.allow_underscores) {
        if (part.indexOf('__') >= 0) {
          return false;
        }
        part = part.replace(/_/g, '');
      }
      if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
        return false;
      }
      if (part[0] === '-' || part[part.length - 1] === '-' ||
        part.indexOf('---') >= 0) {
        return false;
      }
    }
    return true;
  }

  // threshold here renamed to startingThreshold because linter was mad,
  //  probably not the best name
  constructor(startingThreshold) {
    let defaultUrlOptions = {
      protocols: ['http', 'https', 'ftp'],
      require_tld: true,
      require_protocol: false,
      allow_underscores: true,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: true
    };
    if (startingThreshold === undefined) {
      startingThreshold = defaultUrlOptions;
    }
    super(
      startingThreshold,
      (newValue, threshold) => {
        let url = newValue;
        let protocol;
        let auth;
        let host;
        let hostname;
        let port;
        let portStr;
        let split;
        if (!url || url.length >= 2083 || /\s/.test(url)) {
          return false;
        }
        if (url.indexOf('mailto:') === 0) {
          return false;
        }
        split = url.split('://');
        if (split.length > 1) {
          protocol = split.shift();
          if (threshold.protocols.indexOf(protocol) === -1) {
            return false;
          }
        } else if (threshold.require_protocol) {
          return false;
        } else if (threshold.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
          split[0] = url.substr(2);
        }
        url = split.join('://');
        split = url.split('#');
        url = split.shift();
        split = url.split('?');
        url = split.shift();
        split = url.split('/');
        url = split.shift();
        split = url.split('@');
        if (split.length > 1) {
          auth = split.shift();
          if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
            return false;
          }
        }
        hostname = split.join('@');
        split = hostname.split(':');
        host = split.shift();
        if (split.length) {
          portStr = split.join(':');
          port = parseInt(portStr, 10);
          if (!/^[0-9]+$/.test(portStr) || port <= 0 || port > 65535) {
            return false;
          }
        }
        if (!URLValidationRule.isIP(host) && !URLValidationRule.isFQDN(host, threshold) &&
          host !== 'localhost') {
          return false;
        }
        if (threshold.host_whitelist &&
          threshold.host_whitelist.indexOf(host) === -1) {
          return false;
        }
        if (threshold.host_blacklist &&
          threshold.host_blacklist.indexOf(host) !== -1) {
          return false;
        }
        return true;
      },
      null,
      'URLValidationRule'
    );
  }

}

export class EmailValidationRule extends ValidationRule {
  //https://github.com/chriso/validator.js/blob/master/LICENSE
  static testEmailUserUtf8Regex(user) {
    let emailUserUtf8Regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;
    return emailUserUtf8Regex.test(user);
  }
  static isFQDN(str) {
    let parts = str.split('.');
    for (let part, i = 0; i < parts.length; i++) {
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
  }

  constructor() {
    super(
      null,
      (newValue, threshold) => {
        if (/\s/.test(newValue)) {
          return false;
        }
        let parts = newValue.split('@');
        let domain = parts.pop();
        let user = parts.join('@');

        if (!EmailValidationRule.isFQDN(domain)) {
          return false;
        }
        return EmailValidationRule.testEmailUserUtf8Regex(user);
      },
      null,
      'EmailValidationRule'
    );
  }
}

export class MinimumLengthValidationRule extends ValidationRule {
  constructor(minimumLength) {
    super(
      minimumLength,
      (newValue, minLength) => {
        return newValue.length !== undefined && newValue.length >= minLength;
      },
      null,
      'MinimumLengthValidationRule'
    );
  }
}

export class MaximumLengthValidationRule extends ValidationRule {
  constructor(maximumLength) {
    super(
      maximumLength,
      (newValue, maxLength) => {
        return newValue.length !== undefined && newValue.length <= maxLength;
      },
      null,
      'MaximumLengthValidationRule'
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
          && newValue.length <= threshold.maximumLength;
      },
      null,
      'BetweenLengthValidationRule'
    );
  }
}

export class CustomFunctionValidationRule extends ValidationRule {
  constructor(customFunction, threshold) {
    super(
      threshold,
      customFunction,
      null,
      'CustomFunctionValidationRule'
    );
  }
}

export class NumericValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold, locale) => {
        let numericRegex = locale.setting('numericRegex');
        let floatValue = parseFloat(newValue);
        return !Number.isNaN(parseFloat(newValue))
          && Number.isFinite(floatValue)
          && numericRegex.test(newValue);
      },
      null,
      'NumericValidationRule'
    );
  }
}

export class RegexValidationRule extends ValidationRule {
  constructor(startingRegex, ruleName) {
    super(
      startingRegex,
      (newValue, regex) => {
        return regex.test(newValue);
      },
      null,
      ruleName || 'RegexValidationRule'
    );
  }
}

export class ContainsOnlyValidationRule extends RegexValidationRule {
  constructor(regex) {
    super(regex, 'ContainsOnlyValidationRule');
  }
}

export class MinimumValueValidationRule extends ValidationRule {
  constructor(minimumValue) {
    super(
      minimumValue,
      (newValue, minValue) => {
        return Utilities.getValue(minValue) < newValue;
      },
      null,
      'MinimumValueValidationRule'
    );
  }
}

export class MinimumInclusiveValueValidationRule extends ValidationRule {
  constructor(minimumValue) {
    super(
      minimumValue,
      (newValue, minValue) => {
        return Utilities.getValue(minValue) <= newValue;
      },
      null,
      'MinimumInclusiveValueValidationRule'
    );
  }
}

export class MaximumValueValidationRule extends ValidationRule {
  constructor(maximumValue) {
    super(
      maximumValue,
      (newValue, maxValue) => {
        return newValue < Utilities.getValue(maxValue);
      },
      null,
      'MaximumValueValidationRule'
    );
  }
}

export class MaximumInclusiveValueValidationRule extends ValidationRule {
  constructor(maximumValue) {
    super(
      maximumValue,
      (newValue, maxValue) => {
        return newValue <= Utilities.getValue(maxValue);
      },
      null,
      'MaximumInclusiveValueValidationRule'
    );
  }
}

export class BetweenValueValidationRule extends ValidationRule {
  constructor(minimumValue, maximumValue) {
    super(
      {minimumValue: minimumValue, maximumValue: maximumValue},
      (newValue, threshold) => {
        return Utilities.getValue(threshold.minimumValue) <= newValue && newValue <= Utilities.getValue(threshold.maximumValue);
      },
      null,
      'BetweenValueValidationRule'
    );
  }
}

export class DigitValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^\d+$/.test(newValue);
      },
      null,
      'DigitValidationRule'
    );
  }
}

export class NoSpacesValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^\S*$/.test(newValue);
      },
      null,
      'NoSpacesValidationRule'
    );
  }
}

export class AlphaNumericValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^[a-z0-9]+$/i.test(newValue);
      },
      null,
      'AlphaNumericValidationRule'
    );
  }
}

export class AlphaValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^[a-z]+$/i.test(newValue);
      },
      null,
      'AlphaValidationRule'
    );
  }
}


export class AlphaOrWhitespaceValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^[a-z\s]+$/i.test(newValue);
      },
      null,
      'AlphaOrWhitespaceValidationRule'
    );
  }
}


export class AlphaNumericOrWhitespaceValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^[a-z0-9\s]+$/i.test(newValue);
      },
      null,
      'AlphaNumericOrWhitespaceValidationRule'
    );
  }
}

export class MediumPasswordValidationRule extends ValidationRule {
  constructor(minimumComplexityLevel, ruleName) {
    super(
      (minimumComplexityLevel) ? minimumComplexityLevel : 3,
      (newValue, threshold) => {
        if (typeof (newValue) !== 'string') {
          return false;
        }
        let strength = 0;
        strength += /[A-Z]+/.test(newValue) ? 1 : 0;
        strength += /[a-z]+/.test(newValue) ? 1 : 0;
        strength += /[0-9]+/.test(newValue) ? 1 : 0;
        strength += /[\W]+/.test(newValue) ? 1 : 0;
        return strength >= threshold;
      },
      null,
      ruleName || 'MediumPasswordValidationRule'
    );
  }
}


export class StrongPasswordValidationRule extends MediumPasswordValidationRule {
  constructor() {
    super(4, 'StrongPasswordValidationRule');
  }
}

export class EqualityValidationRuleBase extends ValidationRule {
  constructor(startingOtherValue, equality, otherValueLabel, ruleName) {
    super(
      {
        otherValue: startingOtherValue,
        equality: equality,
        otherValueLabel: otherValueLabel
      },
      (newValue, threshold) => {
        let otherValue = Utilities.getValue(threshold.otherValue);
        if (newValue instanceof Date && otherValue instanceof Date) {
          return threshold.equality === (newValue.getTime() === otherValue.getTime());
        }
        return threshold.equality === (newValue === otherValue);
      },
      null,
      ruleName || 'EqualityValidationRuleBase'
    );
  }
}

export class EqualityValidationRule extends EqualityValidationRuleBase {
  constructor(otherValue) {
    super(otherValue, true, null, 'EqualityValidationRule');
  }
}

export class EqualityWithOtherLabelValidationRule extends EqualityValidationRuleBase {
  constructor(otherValue, otherLabel) {
    super(otherValue, true, otherLabel, 'EqualityWithOtherLabelValidationRule');
  }
}

export class InEqualityValidationRule extends EqualityValidationRuleBase {
  constructor(otherValue) {
    super(otherValue, false, null, 'InEqualityValidationRule');
  }
}

export class InEqualityWithOtherLabelValidationRule extends EqualityValidationRuleBase {
  constructor(otherValue, otherLabel) {
    super(otherValue, false, otherLabel, 'InEqualityWithOtherLabelValidationRule');
  }
}


export class InCollectionValidationRule extends ValidationRule {
  constructor(startingCollection) {
    super(
      startingCollection,
      (newValue, threshold) => {
        let collection = Utilities.getValue(threshold);
        for (let i = 0; i < collection.length; i++) {
          if (newValue === collection[i]) {
            return true;
          }
        }
        return false;
      },
      null,
      'InCollectionValidationRule'
    );
  }
}
