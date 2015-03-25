import {ValidationGroupBuilder} from '../validation/validationGroupBuilder';
import {ValidationResult} from '../validation/validationResult';

export class ValidationGroup {
  constructor(subject, observerLocator) {
    this.result = new ValidationResult();
    this.subject = subject;
    this.validationProperties = [];
    this.builder = new ValidationGroupBuilder(observerLocator, this);
  }

  checkAll() {
    for (let i = this.validationProperties.length - 1; i >= 0; i--) {
      var validatorProperty = this.validationProperties[i];
      validatorProperty.validateCurrentValue(true);
    }
    return this.result.isValid;
  }

  ensure(propertyName) {
    return this.builder.ensure(propertyName);
  }

  notEmpty() {
    return this.builder.notEmpty();
  }

  minimum(minimumValue) {
    return this.builder.minimum(minimumValue);
  }

  between(minimumValue, maximumValue) {
    return this.builder.between(minimumValue, maximumValue);
  }

  maximum(maximumValue) {
    return this.builder.maximum(maximumValue);
  }

  equals(otherValue, otherValueLabel) {
    return this.builder.equals(otherValue, otherValueLabel);
  }

  notEquals(otherValue, otherValueLabel) {
    return this.builder.notEquals(otherValue, otherValueLabel);
  }

  email() {
    return this.builder.email();
  }

  in(collection) {
    return this.builder.in(collection);
  }

  minLength(minimumValue) {
    return this.builder.minLength(minimumValue);
  }

  maxLength(maximumValue) {
    return this.builder.maxLength(maximumValue);
  }

  betweenLength(minimumValue, maximumValue) {
    return this.builder.betweenLength(minimumValue, maximumValue);
  }

  isNumeric() {
    return this.builder.isNumeric();
  }

  isDigit() {
    return this.builder.isDigit();
  }

  isAlphanumeric() {
    return this.builder.isAlphaNumeric();
  }

  isAlphanumericOrWhitespace() {
    return this.builder.isAlphanumericOrWhitespace();
  }

  isStrongPassword(minimumComplexityLevel) {
    return this.builder.isStrongPassword(minimumComplexityLevel);
  }

  matchesRegex(regexString) {
    return this.builder.matchesRegex(regexString);
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
}
