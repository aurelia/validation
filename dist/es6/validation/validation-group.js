import {ValidationGroupBuilder} from '../validation/validation-group-builder';
import {ValidationResult} from '../validation/validation-result';

/**
 * Encapsulates validation rules and their current validation state for a given subject
 * @class ValidationGroup
 * @constructor
 */
export class ValidationGroup {
  /**
   * Instantiates a new {ValidationGroup}
   * @param subject The subject to evaluate
   * @param observerLocator The observerLocator used to monitor changes on the subject
   */
  constructor(subject, observerLocator) {
    this.result = new ValidationResult();
    this.subject = subject;
    this.validationProperties = [];
    this.builder = new ValidationGroupBuilder(observerLocator, this);
  }

  /**
   * Causes each property to re-evaluate: gets the latest value, marks the property as 'dirty', runs validation rules on latest value, updates this.result
   * @returns {bool} True/false indicating if every property is valid
   */
  checkAll() {
    throw 'The synchronous "checkAll()" function is no longer supported. Use "validate()" which returns a promise that fulfils when valid, rejects when invalid';
  }

  /**
   * Causes complete re-evaluation: gets the latest value, marks the property as 'dirty', runs validation rules asynchronously and updates this.result
   * @returns {Promise} A promise that fulfils when valid, rejects when invalid.
   */
  validate() {
    var promise = Promise.resolve(true);
    for (let i = this.validationProperties.length - 1; i >= 0; i--) {
      let validatorProperty = this.validationProperties[i];
      promise = promise.then( () => { return validatorProperty.validateCurrentValue(true); });
    }
    promise = promise.catch( () => {
      console.log("Should never get here: a validation property should always resolve to true/false!");
      debugger;
      throw Error("Should never get here: a validation property should always resolve to true/false!");
    });

    return promise.then( () => {
      if(this.result.isValid)
      {
        return Promise.resolve(this.result);
      }
      else
      {
        return Promise.reject(this.result);
      }
    });
  }

  /**
   * Adds a validation property for the specified path
   * @param {String} propertyPath the path of the property/field, for example 'firstName' or 'address.muncipality.zipCode'
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  ensure(propertyPath) {
    return this.builder.ensure(propertyPath);
  }

  /**
   * Adds a validation rule that checks a value for being 'notEmpty', 'required'
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  notEmpty() {
    return this.builder.notEmpty();
  }

  /**
   * Adds a validation rule that checks a value for being greater than or equal to a threshold
   * @param minimumValue the threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  minimum(minimumValue) {
    return this.builder.minimum(minimumValue);
  }

  /**
   * Adds a validation rule that checks a value for being greater than or equal to a threshold, and less than another threshold
   * @param minimumValue The minimum threshold
   * @param maximumValue The maximum threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  between(minimumValue, maximumValue) {
    return this.builder.between(minimumValue, maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for being less than a threshold
   * @param maximumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  maximum(maximumValue) {
    return this.builder.maximum(maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for being equal to a threshold
   * @param otherValue The threshold
   * @param otherValueLabel Optional: a label to use in the validation message
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  equals(otherValue, otherValueLabel) {
    return this.builder.equals(otherValue, otherValueLabel);
  }

  /**
   * Adds a validation rule that checks a value for not being equal to a threshold
   * @param otherValue The threshold
   * @param otherValueLabel Optional: a label to use in the validation message
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  notEquals(otherValue, otherValueLabel) {
    return this.builder.notEquals(otherValue, otherValueLabel);
  }

  /**
   * Adds a validation rule that checks a value for being a valid email address
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  email() {
    return this.builder.email();
  }

  /**
   * Adds a validation rule that checks a value for being equal to at least one other value in a particular collection
   * @param collection The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  in(collection) {
    return this.builder.in(collection);
  }

  /**
   * Adds a validation rule that checks a value for having a length greater than or equal to a specified threshold
   * @param minimumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  minLength(minimumValue) {
    return this.builder.minLength(minimumValue);
  }

  /**
   * Adds a validation rule that checks a value for having a length less than a specified threshold
   * @param maximumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  maxLength(maximumValue) {
    return this.builder.maxLength(maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for having a length greater than or equal to a specified threshold and less than another threshold
   * @param minimumValue The minimum threshold
   * @param maximumValue The maximum threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  betweenLength(minimumValue, maximumValue) {
    return this.builder.betweenLength(minimumValue, maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for being numeric, this includes formatted numbers like '-3,600.25'
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isNumeric() {
    return this.builder.isNumeric();
  }

  /**
   * Adds a validation rule that checks a value for being strictly numeric, this excludes formatted numbers like '-3,600.25'
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isDigit() {
    return this.builder.isDigit();
  }

  isAlpha()
  {
    return this.builder.isAlpha();
  }

  /**
   * Adds a validation rule that checks a value for only containing alphanumerical characters
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isAlphanumeric() {
    return this.builder.isAlphanumeric();
  }

  /**
   * Adds a validation rule that checks a value for only containing alphanumerical characters or whitespace
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isAlphanumericOrWhitespace() {
    return this.builder.isAlphanumericOrWhitespace();
  }

  /**
   * Adds a validation rule that checks a value for being a strong password. A strong password contains at least the specified of the following groups: lowercase characters, uppercase characters, digits and special characters.
   * @param minimumComplexityLevel {Number} Optionally, specifiy the number of groups to match. Default is 4.
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isStrongPassword(minimumComplexityLevel) {
    return this.builder.isStrongPassword(minimumComplexityLevel);
  }

  /**
   * Adds a validation rule that checks a value for matching a particular regex
   * @param regexString {String} the regex to match
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  matchesRegex(regexString) {
    return this.builder.matchesRegex(regexString);
  }

  /**
   * Adds a validation rule that checks a value for matching a particular regex
   * @param regexString {Regex} the regex to match
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  matches(regex) {
    return this.builder.matches(regex);
  }

  /**
   * Adds a validation rule that checks a value for passing a custom function
   * @param customFunction {Function} The custom function that needs to pass, that takes two arguments: newValue (the value currently being evaluated) and optionally: threshold, and returns true/false.
   * @param threshold {Object} An optional threshold that will be passed to the customFunction
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  passes(customFunction, threshold) {
    return this.builder.passes(customFunction, threshold);
  }

  /**
   * Adds the {ValidationRule}
   * @param validationRule {ValudationRule} The rule that needs to pass
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  passesRule(validationRule) {
    return this.builder.passesRule(validationRule);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when the specified conditionExpression is true
   * @param conditionExpression {Function} a function that returns true of false.
   * @param threshold {Object} an optional treshold object that is passed to the conditionExpression
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  if(conditionExpression, threshold) {
    return this.builder.if(conditionExpression, threshold);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when the previously specified conditionExpression is false.
   * See: if(conditionExpression, threshold)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  else() {
    return this.builder.else();
  }

  /**
   * Specifies that the execution of next validation rules no longer depend on the the previously specified conditionExpression.
   * See: if(conditionExpression, threshold)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  endIf() {
    return this.builder.endIf();
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when they are preceded by a case that matches the conditionExpression
   * @param conditionExpression {Function} a function that returns a case label to execute. This is optional, when omitted the case label will be matched using the underlying property's value
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  switch(conditionExpression) {
    return this.builder.switch(conditionExpression);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when the caseLabel matches the value returned by a preceding switch statement
   * See: switch(conditionExpression)
   * @param caseLabel {Object} the case label
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  case(caseLabel) {
    return this.builder.case(caseLabel);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when not other caseLabel matches the value returned by a preceding switch statement
   * See: switch(conditionExpression)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  default() {
    return this.builder.default();
  }

  /**
   * Specifies that the execution of next validation rules no longer depend on the the previously specified conditionExpression.
   * See: switch(conditionExpression)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  endSwitch() {
    return this.builder.endSwitch();
  }

  /**
   * Specifies that the execution of the previous validation rule should use the specified error message if it fails
   * @param message either a static string or a function that takes two arguments: newValue (the value that has been evaluated) and threshold.
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  withMessage(message) {
    return this.builder.withMessage(message);
  }
}
