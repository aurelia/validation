import {Metadata} from 'aurelia-metadata';
import {ValidationGroupBuilder} from './validation-group-builder';
import {ValidationResult} from './validation-result';
import {ValidationMetadata} from './decorators';

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
   * @param config The configuration
   */
  constructor(subject, observerLocator, config) {
    let validationMetadata;
    this.result = new ValidationResult();
    this.subject = subject;
    this.validationProperties = [];
    this.config = config;
    this.builder = new ValidationGroupBuilder(observerLocator, this);
    this.onValidateCallbacks = [];
    this.onPropertyValidationCallbacks = [];
    this.isValidating = false;
    this.onDestroy = config.onLocaleChanged(() => {
      this.validate(false, true);
    });
    validationMetadata = Metadata.getOwn(ValidationMetadata.metadataKey, this.subject);
    if (validationMetadata) {
      validationMetadata.setup(this);
    }
  }

  destroy(): void {
    this.validationProperties.forEach(prop => {
      prop.destroy();
    });
    this.onDestroy();
    // TODO: what else needs to be done for proper cleanup?
  }

  clear(): void {
    this.validationProperties.forEach((prop) => {
      prop.clear();
    });
    this.result.clear();
  }

  onBreezeEntity() {
    let breezeEntity = this.subject;
    let me = this;
    let errors;
    this.onPropertyValidate((propertyBindingPath) => {
      this.passes(() => {
        breezeEntity.entityAspect.validateProperty(propertyBindingPath);
        errors = breezeEntity.entityAspect.getValidationErrors(propertyBindingPath);
        if (errors.length === 0) {
          return true;
        }
        return errors[0].errorMessage;
      });
    });
    this.onValidate(() => {
      breezeEntity.entityAspect.validateEntity();
      return {};
    });
    breezeEntity.entityAspect.validationErrorsChanged.subscribe(() => {
      breezeEntity.entityAspect.getValidationErrors().forEach((validationError) => {
        let propertyName = validationError.propertyName;
        let currentResultProp;
        if (!me.result.properties[propertyName]) {
          //set up empty validation on the property
          me.ensure(propertyName);
        }
        currentResultProp = me.result.addProperty(propertyName);
        if (currentResultProp.isValid) {
          currentResultProp.setValidity({
            isValid: false,
            message: validationError.errorMessage,
            failingRule: 'breeze',
            latestValue: currentResultProp.latestValue
          }, true);
        }
      });
    });
  }

  /**
   * Causes complete re-evaluation: gets the latest value, marks the property as 'dirty' (unless false is passed), runs validation rules asynchronously and updates this.result
   * @returns {Promise} A promise that fulfils when valid, rejects when invalid.
   */
  validate(forceDirty: boolean = true, forceExecution: boolean = true): Promise<ValidationResult> {
    this.isValidating = true;
    let promise = Promise.resolve(true);
    // FIXME: Need to refactor this to not use promises and loop over them
    /*eslint-disable */
    for (let i = this.validationProperties.length - 1; i >= 0; i--) {
      let validatorProperty = this.validationProperties[i];
      promise = promise.then(() => {
        return validatorProperty.validateCurrentValue(forceDirty, forceExecution);
      });
    }
    /*eslint-enable */
    promise = promise.catch(() => {
      throw Error('Should never get here: a validation property should always resolve to true/false!');
    });
    this.onValidateCallbacks.forEach((onValidateCallback) => {
      promise = promise.then(() => {
        return this.config.locale();
      }).then((locale) => {
        return Promise.resolve(onValidateCallback.validationFunction()).then((callbackResult) => {
          for (let prop in callbackResult) {
            let resultProp;
            let result;
            let newPropResult;
            if (!this.result.properties[prop]) {
              //set up empty validation on the property
              this.ensure(prop);
            }
            resultProp = this.result.addProperty(prop);
            result = callbackResult[prop];
            newPropResult = {
              latestValue: resultProp.latestValue
            };
            if (result === true || result === null || result === '') {
              if (!resultProp.isValid && resultProp.failingRule === 'onValidateCallback') {
                newPropResult.failingRule = null;
                newPropResult.message = '';
                newPropResult.isValid = true;
                resultProp.setValidity(newPropResult, true);
              }
            } else {
              if (resultProp.isValid) {
                newPropResult.failingRule = 'onValidateCallback';
                newPropResult.isValid = false;
                if (typeof(result) === 'string') {
                  newPropResult.message = result;
                } else {
                  newPropResult.message = locale.translate(newPropResult.failingRule);
                }
                resultProp.setValidity(newPropResult, true);
              }
            }
          }
          this.result.checkValidity();
        },
        (a, b, c, d, e) => {
          this.result.isValid = false;
          if (onValidateCallback.validationFunctionFailedCallback) {
            onValidateCallback.validationFunctionFailedCallback(a, b, c, d, e);
          }
        });
      });
    });
    promise = promise.then(() => {
      this.isValidating = false;
      if (this.result.isValid) {
        return Promise.resolve(this.result);
      }
      return Promise.reject(this.result);
    });
    return promise;
  }

  onValidate(validationFunction: () => any, validationFunctionFailedCallback?: (a: any, b: any, c: any, d: any, e: any) => any): ValidationGroup {
    this.onValidateCallbacks.push({validationFunction, validationFunctionFailedCallback});
    return this;
  }

  onPropertyValidate(validationFunction): ValidationGroup {
    this.onPropertyValidationCallbacks.push(validationFunction);
    return this;
  }

  /**
   * Adds a validation property for the specified path
   * @param {String} bindingPath the path of the property/field, for example 'firstName' or 'address.muncipality.zipCode'
   * @param configCallback a configuration callback
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  ensure(bindingPath: string, configCallback?: (config: ValidationConfig) => void): ValidationGroup {
    this.builder.ensure(bindingPath, configCallback);
    this.onPropertyValidationCallbacks.forEach((callback) => {
      callback(bindingPath);
    });
    return this;
  }

  /**
   * Adds a validation rule that checks a value for being 'isNotEmpty', 'required'
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isNotEmpty(): ValidationGroup {
    return this.builder.isNotEmpty();
  }

  /**
   * Adds a validation rule that allows a value to be empty/null
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  canBeEmpty(): ValidationGroup {
    return this.builder.canBeEmpty();
  }

  /**
   * Adds a validation rule that checks a value for being greater than or equal to a threshold
   * @param minimumValue the threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isGreaterThanOrEqualTo(minimumValue): ValidationGroup {
    return this.builder.isGreaterThanOrEqualTo(minimumValue);
  }

  /**
   * Adds a validation rule that checks a value for being greater than a threshold
   * @param minimumValue the threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isGreaterThan(minimumValue): ValidationGroup {
    return this.builder.isGreaterThan(minimumValue);
  }

  /**
   * Adds a validation rule that checks a value for being greater than or equal to a threshold, and less than or equal to another threshold
   * @param minimumValue The minimum threshold
   * @param maximumValue The isLessThanOrEqualTo threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isBetween(minimumValue, maximumValue): ValidationGroup {
    return this.builder.isBetween(minimumValue, maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for being less than a threshold
   * @param maximumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isLessThanOrEqualTo(maximumValue): ValidationGroup {
    return this.builder.isLessThanOrEqualTo(maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for being less than or equal to a threshold
   * @param maximumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isLessThan(maximumValue): ValidationGroup {
    return this.builder.isLessThan(maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for being equal to a threshold
   * @param otherValue The threshold
   * @param otherValueLabel Optional: a label to use in the validation message
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isEqualTo(otherValue, otherValueLabel): ValidationGroup {
    return this.builder.isEqualTo(otherValue, otherValueLabel);
  }

  /**
   * Adds a validation rule that checks a value for not being equal to a threshold
   * @param otherValue The threshold
   * @param otherValueLabel Optional: a label to use in the validation message
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isNotEqualTo(otherValue, otherValueLabel): ValidationGroup {
    return this.builder.isNotEqualTo(otherValue, otherValueLabel);
  }

  /**
   * Adds a validation rule that checks a value for being a valid isEmail address
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isEmail(): ValidationGroup {
    return this.builder.isEmail();
  }

  /**
   * Adds a validation rule that checks a value for being a valid URL
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isURL(): ValidationGroup {
    return this.builder.isURL();
  }

  /**
   * Adds a validation rule that checks a value for being equal to at least one other value in a particular collection
   * @param collection The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isIn(collection): ValidationGroup {
    return this.builder.isIn(collection);
  }

  /**
   * Adds a validation rule that checks a value for having a length greater than or equal to a specified threshold
   * @param minimumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  hasMinLength(minimumValue: number): ValidationGroup {
    return this.builder.hasMinLength(minimumValue);
  }

  /**
   * Adds a validation rule that checks a value for having a length less than a specified threshold
   * @param maximumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  hasMaxLength(maximumValue: number): ValidationGroup {
    return this.builder.hasMaxLength(maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for having a length greater than or equal to a specified threshold and less than another threshold
   * @param minimumValue The min threshold
   * @param maximumValue The max threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  hasLengthBetween(minimumValue: number, maximumValue: number): ValidationGroup {
    return this.builder.hasLengthBetween(minimumValue, maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for being numeric, this includes formatted numbers like '-3,600.25'
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isNumber(): ValidationGroup {
    return this.builder.isNumber();
  }

  /**
   * Adds a validation rule that checks a value for containing not a single whitespace
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  containsNoSpaces(): ValidationGroup {
    return this.builder.containsNoSpaces();
  }

  /**
   * Adds a validation rule that checks a value for being strictly numeric, this excludes formatted numbers like '-3,600.25'
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  containsOnlyDigits(): ValidationGroup {
    return this.builder.containsOnlyDigits();
  }

  containsOnly(regex): ValidationGroup {
    return this.builder.containsOnly(regex);
  }

  containsOnlyAlpha(): ValidationGroup {
    return this.builder.containsOnlyAlpha();
  }

  containsOnlyAlphaOrWhitespace(): ValidationGroup {
    return this.builder.containsOnlyAlphaOrWhitespace();
  }

  containsOnlyLetters(): ValidationGroup {
    return this.builder.containsOnlyAlpha();
  }

  containsOnlyLettersOrWhitespace(): ValidationGroup {
    return this.builder.containsOnlyAlphaOrWhitespace();
  }

  /**
   * Adds a validation rule that checks a value for only containing alphanumerical characters
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  containsOnlyAlphanumerics(): ValidationGroup {
    return this.builder.containsOnlyAlphanumerics();
  }

  /**
   * Adds a validation rule that checks a value for only containing alphanumerical characters or whitespace
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  containsOnlyAlphanumericsOrWhitespace(): ValidationGroup {
    return this.builder.containsOnlyAlphanumericsOrWhitespace();
  }

  /**
   * Adds a validation rule that checks a value for being a strong password. A strong password contains at least the specified of the following groups: lowercase characters, uppercase characters, digits and special characters.
   * @param minimumComplexityLevel {Number} Optionally, specifiy the number of groups to match. Default is 4.
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isStrongPassword(minimumComplexityLevel: number): ValidationGroup {
    return this.builder.isStrongPassword(minimumComplexityLevel);
  }

  /**
   * Adds a validation rule that checks a value for matching a particular regex
   * @param regex the regex to match
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  matches(regex): ValidationGroup {
    return this.builder.matches(regex);
  }

  /**
   * Adds a validation rule that checks a value for passing a custom function
   * @param customFunction {Function} The custom function that needs to pass, that takes two arguments: newValue (the value currently being evaluated) and optionally: threshold, and returns true/false.
   * @param threshold {Object} An optional threshold that will be passed to the customFunction
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  passes(customFunction: Function, threshold: any): ValidationGroup {
    return this.builder.passes(customFunction, threshold);
  }

  /**
   * Adds the {ValidationRule}
   * @param validationRule {ValidationRule} The rule that needs to pass
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  passesRule(validationRule: ValidationRule): ValidationGroup {
    return this.builder.passesRule(validationRule);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when the specified conditionExpression is true
   * @param conditionExpression {Function} a function that returns true of false.
   * @param threshold {Object} an optional treshold object that is passed to the conditionExpression
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  if(conditionExpression: Function, threshold: any): ValidationGroup {
    return this.builder.if(conditionExpression, threshold);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when the previously specified conditionExpression is false.
   * See: if (conditionExpression, threshold)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  else(): ValidationGroup {
    return this.builder.else();
  }

  /**
   * Specifies that the execution of next validation rules no longer depend on the the previously specified conditionExpression.
   * See: if (conditionExpression, threshold)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  endIf(): ValidationGroup {
    return this.builder.endIf();
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when they are preceded by a case that matches the conditionExpression
   * @param conditionExpression {Function} a function that returns a case label to execute. This is optional, when omitted the case label will be matched using the underlying property's value
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  switch(conditionExpression: Function): ValidationGroup {
    return this.builder.switch(conditionExpression);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when the caseLabel matches the value returned by a preceding switch statement
   * See: switch(conditionExpression)
   * @param caseLabel {Object} the case label
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  case(caseLabel: any): ValidationGroup {
    return this.builder.case(caseLabel);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when not other caseLabel matches the value returned by a preceding switch statement
   * See: switch(conditionExpression)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  default(): ValidationGroup {
    return this.builder.default();
  }

  /**
   * Specifies that the execution of next validation rules no longer depend on the the previously specified conditionExpression.
   * See: switch(conditionExpression)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  endSwitch(): ValidationGroup {
    return this.builder.endSwitch();
  }

  /**
   * Specifies that the execution of the previous validation rule should use the specified error message if it fails
   * @param message either a static string or a function that takes two arguments: newValue (the value that has been evaluated) and threshold.
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  withMessage(message: string | (newValue: any, threshold: any) => any) {
    return this.builder.withMessage(message);
  }
}
