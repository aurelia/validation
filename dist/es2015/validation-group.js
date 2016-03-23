import { metadata } from 'aurelia-metadata';
import { ValidationGroupBuilder } from './validation-group-builder';
import { ValidationResult } from './validation-result';
import { ValidationMetadata } from './decorators';

export let ValidationGroup = class ValidationGroup {
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
    validationMetadata = metadata.getOwn(ValidationMetadata.metadataKey, Object.getPrototypeOf(this.subject));
    if (validationMetadata) {
      validationMetadata.setup(this);
    }
  }

  destroy() {
    this.validationProperties.forEach(prop => {
      prop.destroy();
    });
    this.onDestroy();
  }

  clear() {
    this.validationProperties.forEach(prop => {
      prop.clear();
    });
    this.result.clear();
  }

  onBreezeEntity() {
    let breezeEntity = this.subject;
    let me = this;
    let errors;
    this.onPropertyValidate(propertyBindingPath => {
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
      breezeEntity.entityAspect.getValidationErrors().forEach(validationError => {
        let propertyName = validationError.propertyName;
        let currentResultProp;
        if (!me.result.properties[propertyName]) {
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

  validate(forceDirty = true, forceExecution = true) {
    this.isValidating = true;
    let promise = Promise.resolve(true);

    for (let i = this.validationProperties.length - 1; i >= 0; i--) {
      let validatorProperty = this.validationProperties[i];
      promise = promise.then(() => {
        return validatorProperty.validateCurrentValue(forceDirty, forceExecution);
      });
    }

    promise = promise.catch(() => {
      throw Error('Should never get here: a validation property should always resolve to true/false!');
    });
    this.onValidateCallbacks.forEach(onValidateCallback => {
      promise = promise.then(() => {
        return this.config.locale();
      }).then(locale => {
        return Promise.resolve(onValidateCallback.validationFunction()).then(callbackResult => {
          for (let prop in callbackResult) {
            let resultProp;
            let result;
            let newPropResult;
            if (!this.result.properties[prop]) {
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
                if (typeof result === 'string') {
                  newPropResult.message = result;
                } else {
                  newPropResult.message = locale.translate(newPropResult.failingRule);
                }
                resultProp.setValidity(newPropResult, true);
              }
            }
          }
          this.result.checkValidity();
        }, (a, b, c, d, e) => {
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

  onValidate(validationFunction, validationFunctionFailedCallback) {
    this.onValidateCallbacks.push({ validationFunction, validationFunctionFailedCallback });
    return this;
  }

  onPropertyValidate(validationFunction) {
    this.onPropertyValidationCallbacks.push(validationFunction);
    return this;
  }

  ensure(bindingPath, configCallback) {
    this.builder.ensure(bindingPath, configCallback);
    this.onPropertyValidationCallbacks.forEach(callback => {
      callback(bindingPath);
    });
    return this;
  }

  isNotEmpty() {
    return this.builder.isNotEmpty();
  }

  canBeEmpty() {
    return this.builder.canBeEmpty();
  }

  isGreaterThanOrEqualTo(minimumValue) {
    return this.builder.isGreaterThanOrEqualTo(minimumValue);
  }

  isGreaterThan(minimumValue) {
    return this.builder.isGreaterThan(minimumValue);
  }

  isBetween(minimumValue, maximumValue) {
    return this.builder.isBetween(minimumValue, maximumValue);
  }

  isLessThanOrEqualTo(maximumValue) {
    return this.builder.isLessThanOrEqualTo(maximumValue);
  }

  isLessThan(maximumValue) {
    return this.builder.isLessThan(maximumValue);
  }

  isEqualTo(otherValue, otherValueLabel) {
    return this.builder.isEqualTo(otherValue, otherValueLabel);
  }

  isNotEqualTo(otherValue, otherValueLabel) {
    return this.builder.isNotEqualTo(otherValue, otherValueLabel);
  }

  isEmail() {
    return this.builder.isEmail();
  }

  isURL() {
    return this.builder.isURL();
  }

  isIn(collection) {
    return this.builder.isIn(collection);
  }

  hasMinLength(minimumValue) {
    return this.builder.hasMinLength(minimumValue);
  }

  hasMaxLength(maximumValue) {
    return this.builder.hasMaxLength(maximumValue);
  }

  hasLengthBetween(minimumValue, maximumValue) {
    return this.builder.hasLengthBetween(minimumValue, maximumValue);
  }

  isNumber() {
    return this.builder.isNumber();
  }

  containsNoSpaces() {
    return this.builder.containsNoSpaces();
  }

  containsOnlyDigits() {
    return this.builder.containsOnlyDigits();
  }

  containsOnly(regex) {
    return this.builder.containsOnly(regex);
  }

  containsOnlyAlpha() {
    return this.builder.containsOnlyAlpha();
  }

  containsOnlyAlphaOrWhitespace() {
    return this.builder.containsOnlyAlphaOrWhitespace();
  }

  containsOnlyLetters() {
    return this.builder.containsOnlyAlpha();
  }

  containsOnlyLettersOrWhitespace() {
    return this.builder.containsOnlyAlphaOrWhitespace();
  }

  containsOnlyAlphanumerics() {
    return this.builder.containsOnlyAlphanumerics();
  }

  containsOnlyAlphanumericsOrWhitespace() {
    return this.builder.containsOnlyAlphanumericsOrWhitespace();
  }

  isStrongPassword(minimumComplexityLevel) {
    return this.builder.isStrongPassword(minimumComplexityLevel);
  }

  matches(regex) {
    return this.builder.matches(regex);
  }

  passes(customFunction, threshold) {
    return this.builder.passes(customFunction, threshold);
  }

  passesRule(validationRule) {
    return this.builder.passesRule(validationRule);
  }

  if(conditionExpression, threshold) {
    return this.builder.if(conditionExpression, threshold);
  }

  else() {
    return this.builder.else();
  }

  endIf() {
    return this.builder.endIf();
  }

  switch(conditionExpression) {
    return this.builder.switch(conditionExpression);
  }

  case(caseLabel) {
    return this.builder.case(caseLabel);
  }

  default() {
    return this.builder.default();
  }

  endSwitch() {
    return this.builder.endSwitch();
  }

  withMessage(message) {
    return this.builder.withMessage(message);
  }
};