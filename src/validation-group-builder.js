import {SwitchCaseValidationRulesCollection} from './validation-rules-collection';
import {ValidationProperty} from './validation-property';
import {ValidationConfig} from './validation-config';
import {
  MinimumValueValidationRule,
  MinimumInclusiveValueValidationRule,
  BetweenValueValidationRule,
  InCollectionValidationRule,
  MaximumValueValidationRule,
  MaximumInclusiveValueValidationRule,
  EqualityValidationRule,
  EqualityWithOtherLabelValidationRule,
  InEqualityValidationRule,
  InEqualityWithOtherLabelValidationRule,
  EmailValidationRule,
  URLValidationRule,
  MinimumLengthValidationRule,
  MaximumLengthValidationRule,
  BetweenLengthValidationRule,
  NumericValidationRule,
  NoSpacesValidationRule,
  DigitValidationRule,
  AlphaValidationRule,
  AlphaOrWhitespaceValidationRule,
  AlphaNumericValidationRule,
  AlphaNumericOrWhitespaceValidationRule,
  StrongPasswordValidationRule,
  MediumPasswordValidationRule,
  ContainsOnlyValidationRule,
  RegexValidationRule,
  CustomFunctionValidationRule
} from './validation-rules';

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
    return this.passesRule(new MinimumValueValidationRule(minimumValue));
  }
  isGreaterThanOrEqualTo(minimumValue) {
    return this.passesRule(new MinimumInclusiveValueValidationRule(minimumValue));
  }

  isBetween(minimumValue, maximumValue) {
    return this.passesRule(new BetweenValueValidationRule(minimumValue, maximumValue));
  }

  isIn(collection) {
    return this.passesRule(new InCollectionValidationRule(collection));
  }

  isLessThan(maximumValue) {
    return this.passesRule(new MaximumValueValidationRule(maximumValue));
  }

  isLessThanOrEqualTo(maximumValue) {
    return this.passesRule(new MaximumInclusiveValueValidationRule(maximumValue));
  }

  isEqualTo(otherValue, otherValueLabel) {
    if(!otherValueLabel)
      return this.passesRule(new EqualityValidationRule(otherValue));
    else
      return this.passesRule(new EqualityWithOtherLabelValidationRule(otherValue, otherValueLabel))
  }

  isNotEqualTo(otherValue, otherValueLabel) {
    if(!otherValueLabel)
      return this.passesRule(new InEqualityValidationRule(otherValue));
    else
      return this.passesRule(new InEqualityWithOtherLabelValidationRule(otherValue, otherValueLabel))
  }

  isEmail() {
    return this.passesRule(new EmailValidationRule());
  }

  isURL(){
    return this.passesRule(new URLValidationRule());
  }

  hasMinLength(minimumValue) {
    return this.passesRule(new MinimumLengthValidationRule(minimumValue));
  }

  hasMaxLength(maximumValue) {
    return this.passesRule(new MaximumLengthValidationRule(maximumValue));
  }

  hasLengthBetween(minimumValue, maximumValue) {
    return this.passesRule(new BetweenLengthValidationRule(minimumValue, maximumValue));
  }

  isNumber() {
    return this.passesRule(new NumericValidationRule());
  }

  containsNoSpaces(){
    return this.passesRule(new NoSpacesValidationRule());
  }

  containsOnlyDigits() {
    return this.passesRule(new DigitValidationRule());
  }

  containsOnlyAlpha(){
    return this.passesRule(new AlphaValidationRule());
  }

  containsOnlyAlphaOrWhitespace(){
    return this.passesRule(new AlphaOrWhitespaceValidationRule());
  }

  containsOnlyAlphanumerics(){
    return this.passesRule(new AlphaNumericValidationRule());
  }

  containsOnlyAlphanumericsOrWhitespace() {
    return this.passesRule(new AlphaNumericOrWhitespaceValidationRule());
  }

  isStrongPassword(minimumComplexityLevel) {
    if(minimumComplexityLevel === 4)
      return this.passesRule(new StrongPasswordValidationRule());
    else
      return this.passesRule(new MediumPasswordValidationRule(minimumComplexityLevel));
  }

  containsOnly(regex)
  {
    return this.passesRule(new ContainsOnlyValidationRule(regex));
  }

  matches(regex) {
    return this.passesRule(new RegexValidationRule(regex));
  }

  passes(customFunction, threshold) {
    return this.passesRule(new CustomFunctionValidationRule(customFunction, threshold));
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
    var conditionalCollection = new SwitchCaseValidationRulesCollection(conditionExpression);
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
    var conditionalCollection = new SwitchCaseValidationRulesCollection(condition);
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
