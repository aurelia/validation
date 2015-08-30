import * as AllRules from './validation-rules';
import * as AllCollections from './validation-rules-collection'
import {ValidationProperty} from './validation-property';
import {ValidationConfig} from './validation-config';

export class ValidationGroupBuilder {
  constructor(observerLocator, validationGroup) {
    this.observerLocator = observerLocator;
    this.validationRuleCollections = []; //Flattened out queue of the nested collections
    this.validationGroup = validationGroup;
  }

  ensure(propertyName, configurationCallback) {
    var newValidationProperty = null;
    this.validationRuleCollections = [];

    for (let i = 0; i < this.validationGroup.validationProperties.length; i++) {
      if (this.validationGroup.validationProperties[i].propertyName === propertyName) {
        newValidationProperty = this.validationGroup.validationProperties[i];
        if(configurationCallback !== undefined && typeof(configurationCallback) === 'function')
        {
          throw Error('When creating validation rules on binding path ' + propertyName + ' a configuration callback function was provided, but validation rules have previously already been instantiated for this binding path');
        }
        break;
      }
    }
    if (newValidationProperty === null) {
      var propertyResult = this.validationGroup.result.addProperty(propertyName);
      var config = new ValidationConfig(this.validationGroup.config);
      if(configurationCallback !== undefined && typeof(configurationCallback) === 'function')
      {
        configurationCallback(config);
      }
      newValidationProperty = new ValidationProperty(this.observerLocator, propertyName, this.validationGroup, propertyResult, config );
      this.validationGroup.validationProperties.push(newValidationProperty);
    }
    this.validationRuleCollections.unshift(newValidationProperty.collectionOfValidationRules);
    return this.validationGroup;
  }

  isNotEmpty() {
    this.validationRuleCollections[0].isNotEmpty();
    this.checkLast();
    return this.validationGroup;
  }
  canBeEmpty(){
    this.validationRuleCollections[0].canBeEmpty();
    this.checkLast();
    return this.validationGroup;
  }

  isGreaterThan(minimumValue) {
    return this.passesRule(new AllRules.MinimumValueValidationRule(minimumValue));
  }
  isGreaterThanOrEqualTo(minimumValue) {
    return this.passesRule(new AllRules.MinimumInclusiveValueValidationRule(minimumValue));
  }

  isBetween(minimumValue, maximumValue) {
    return this.passesRule(new AllRules.BetweenValueValidationRule(minimumValue, maximumValue));
  }

  isIn(collection) {
    return this.passesRule(new AllRules.InCollectionValidationRule(collection));
  }

  isLessThan(maximumValue) {
    return this.passesRule(new AllRules.MaximumValueValidationRule(maximumValue));
  }

  isLessThanOrEqualTo(maximumValue) {
    return this.passesRule(new AllRules.MaximumInclusiveValueValidationRule(maximumValue));
  }

  isEqualTo(otherValue, otherValueLabel) {
    if(!otherValueLabel)
      return this.passesRule(new AllRules.EqualityValidationRule(otherValue));
    else
      return this.passesRule(new AllRules.EqualityWithOtherLabelValidationRule(otherValue, otherValueLabel))
  }

  isNotEqualTo(otherValue, otherValueLabel) {
    if(!otherValueLabel)
      return this.passesRule(new AllRules.InEqualityValidationRule(otherValue));
    else
      return this.passesRule(new AllRules.InEqualityWithOtherLabelValidationRule(otherValue, otherValueLabel))
  }

  isEmail() {
    return this.passesRule(new AllRules.EmailValidationRule());
  }

  isURL(){
    return this.passesRule(new AllRules.URLValidationRule());
  }

  hasMinLength(minimumValue) {
    return this.passesRule(new AllRules.MinimumLengthValidationRule(minimumValue));
  }

  hasMaxLength(maximumValue) {
    return this.passesRule(new AllRules.MaximumLengthValidationRule(maximumValue));
  }

  hasLengthBetween(minimumValue, maximumValue) {
    return this.passesRule(new AllRules.BetweenLengthValidationRule(minimumValue, maximumValue));
  }

  isNumber() {
    return this.passesRule(new AllRules.NumericValidationRule());
  }

  containsNoSpaces(){
    return this.passesRule(new AllRules.NoSpacesValidationRule());
  }

  containsOnlyDigits() {
    return this.passesRule(new AllRules.DigitValidationRule());
  }

  containsOnlyAlpha(){
    return this.passesRule(new AllRules.AlphaValidationRule());
  }

  containsOnlyAlphaOrWhitespace(){
    return this.passesRule(new AllRules.AlphaOrWhitespaceValidationRule());
  }

  containsOnlyAlphanumerics(){
    return this.passesRule(new AllRules.AlphaNumericValidationRule());
  }

  containsOnlyAlphanumericsOrWhitespace() {
    return this.passesRule(new AllRules.AlphaNumericOrWhitespaceValidationRule());
  }

  isStrongPassword(minimumComplexityLevel) {
    if(minimumComplexityLevel === 4)
      return this.passesRule(new AllRules.StrongPasswordValidationRule());
    else
      return this.passesRule(new AllRules.MediumPasswordValidationRule(minimumComplexityLevel));
  }

  containsOnly(regex)
  {
    return this.passesRule(new AllRules.ContainsOnlyValidationRule(regex));
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
