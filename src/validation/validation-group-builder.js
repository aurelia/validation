import * as AllRules from '../validation/validation-rules';
import * as AllCollections from '../validation/validation-rules-collection'
import {ValidationProperty} from '../validation/validation-property';

export class ValidationGroupBuilder {
  constructor(observerLocator, validationGroup) {
    this.observerLocator = observerLocator;
    this.validationRuleCollections = []; //Flattened out queue of the nested collections
    this.validationGroup = validationGroup;
  }

  ensure(propertyName) {
    var newValidationProperty = null;
    this.validationRuleCollections = [];
    for (let i = 0; i < this.validationGroup.validationProperties.length; i++) {
      if (this.validationGroup.validationProperties[i].propertyName === propertyName) {
        newValidationProperty = this.validationGroup.validationProperties[i];
        break;
      }
    }
    if (newValidationProperty === null) {
      var propertyResult = this.validationGroup.result.addProperty(propertyName);
      newValidationProperty = new ValidationProperty(this.observerLocator, propertyName, this.validationGroup, propertyResult);
      this.validationGroup.validationProperties.push(newValidationProperty);
    }
    this.validationRuleCollections.unshift(newValidationProperty.validationRules);
    return this.validationGroup;
  }

  notEmpty() {
    this.validationRuleCollections[0].notEmpty();
    this.checkLast();
    return this.validationGroup;
  }

  minimum(minimumValue) {
    return this.passesRule(new AllRules.MinimumValueValidationRule(minimumValue));
  }

  between(minimumValue, maximumValue) {
    return this.passesRule(new AllRules.BetweenValueValidationRule(minimumValue, maximumValue));
  }

  in(collection) {
    return this.passesRule(new AllRules.InCollectionValidationRule(collection));
  }

  maximum(maximumValue) {
    return this.passesRule(new AllRules.MaximumValueValidationRule(maximumValue));
  }

  equals(otherValue, otherValueLabel) {
    if(!otherValueLabel)
      return this.passesRule(new AllRules.EqualityValidationRule(otherValue));
    else
      return this.passesRule(new AllRules.EqualityWithOtherLabelValidationRule(otherValue, otherValueLabel))
  }

  notEquals(otherValue, otherValueLabel) {
    if(!otherValueLabel)
      return this.passesRule(new AllRules.InEqualityValidationRule(otherValue));
    else
      return this.passesRule(new AllRules.InEqualityWithOtherLabelValidationRule(otherValue, otherValueLabel))
  }

  email() {
    return this.passesRule(new AllRules.EmailValidationRule());
  }

  minLength(minimumValue) {
    return this.passesRule(new AllRules.MinimumLengthValidationRule(minimumValue));
  }

  maxLength(maximumValue) {
    return this.passesRule(new AllRules.MaximumLengthValidationRule(maximumValue));
  }

  betweenLength(minimumValue, maximumValue) {
    return this.passesRule(new AllRules.BetweenLengthValidationRule(minimumValue, maximumValue));
  }

  isNumeric() {
    return this.passesRule(new AllRules.NumericValidationRule());
  }

  isDigit() {
    return this.passesRule(new AllRules.DigitValidationRule());
  }

  isAlpha(){
    return this.passesRule(new AllRules.AlphaValidationRule());
  }

  isAlphaOrWhitespace(){
    return this.passesRule(new AllRules.AlphaOrWhitespaceValidationRule());
  }

  isAlphanumeric() {
    return this.passesRule(new AllRules.AlphaNumericValidationRule());
  }

  isAlphanumericOrWhitespace() {
    return this.passesRule(new AllRules.AlphaNumericOrWhitespaceValidationRule());
  }

  isStrongPassword(minimumComplexityLevel) {
    return this.passesRule(new AllRules.StrongPasswordValidationRule(minimumComplexityLevel));
  }

  matchesRegex(regexString) {
    return this.matches(new RegExp(regexString));
  }

  matches(regex) {
    return this.passesRule(new AllRules.RegexValidationRule(regex));
  }

  passes(customFunction, threshold) {
    return this.passesRule(new AllRules.CustomFunctionValidationRule(customFunction, threshold));
  }

  passesRule(validationRule) {

    this.validationRuleCollections[0].addValidationRule(validationRule);
    this.checkLast();
    return this.validationGroup;
  }

  checkLast() {
    var validationProperty = this.validationGroup.validationProperties[this.validationGroup.validationProperties.length - 1];
    validationProperty.validateCurrentValue(false);
  }

  withMessage(message) {
    this.validationRuleCollections[0].withMessage(message);
    this.checkLast();
    return this.validationGroup;
  }

  if(conditionExpression) {
    //IF is treated as a 'switch' with case 'true' and 'default'
    var conditionalCollection = new AllCollections.SwitchCaseValidationRulesCollection(conditionExpression);
    conditionalCollection.case(true);
    this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
    this.validationRuleCollections.unshift(conditionalCollection);
    return this.validationGroup;
  }

  else() {
    if (!this.validationRuleCollections[0].default)
      throw 'Invalid statement: \'else\'';
    //this.validationRuleCollections[0].case(false);
    this.validationRuleCollections[0].default();//slightly less object creation then 'case false'
    return this.validationGroup;
  }

  endIf() {
    if (!this.validationRuleCollections[0].default)
      throw 'Invalid statement: \'endIf\'';
    this.validationRuleCollections.shift(); //go up one level in the nested collections
    this.checkLast();
    return this.validationGroup;
  }

  switch(conditionExpression) {
    var condition = conditionExpression;
    if (condition === undefined) {
      let observer = this.validationGroup.validationProperties[this.validationGroup.validationProperties.length - 1].observer;
      condition = () => {
        return observer.getValue();
      };
    }
    var conditionalCollection = new AllCollections.SwitchCaseValidationRulesCollection(condition);
    this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
    this.validationRuleCollections.unshift(conditionalCollection);
    return this.validationGroup;
  }

  case(caseLabel) {
    if (!this.validationRuleCollections[0].default)
      throw 'Invalid statement: \'case\'';
    this.validationRuleCollections[0].case(caseLabel);
    return this.validationGroup;
  }

  default() {
    if (!this.validationRuleCollections[0].default)
      throw 'Invalid statement: \'case\'';
    this.validationRuleCollections[0].default();
    return this.validationGroup;
  }

  endSwitch() {
    if (!this.validationRuleCollections[0].default)
      throw 'Invalid statement: \'endIf\'';
    this.validationRuleCollections.shift(); //go up one level in the nested collections
    this.checkLast();
    return this.validationGroup;
  }
}
